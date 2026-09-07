import { getWritingScenario, WRITING_STEP_ORDER } from "./writingScenario.js";

export function createWritingSession(companyId = "otera") {
  const scenario = getWritingScenario(companyId);
  return {
    companyId: scenario.companyId,
    currentStep: "brief",
    furthestStepIndex: 0,
    brief: structuredClone(scenario.brief),
    outline: scenario.outline,
    articleHtml: scenario.articleHtml,
  };
}

// Example sessions remain available to isolated UI previews/tests, never the live app.
export function createLiveWritingSession(companyId = "otera") {
  return { ...createWritingSession(companyId), live: true, outline: "", articleHtml: "",
    generation: null, outlineResult: null, draftResult: null };
}

export function validateBrief(brief) {
  const errors = {};
  if (!brief.format.trim()) errors.format = "Choose an article format.";
  if (brief.audiences.length === 0) errors.audiences = "Choose at least one audience.";
  if (!brief.keyword.trim()) errors.keyword = "Add a primary keyword.";
  if (!brief.targetLength.trim()) errors.targetLength = "Add a target length.";
  return errors;
}

export function canVisitWritingStep(session, step) {
  const index = WRITING_STEP_ORDER.indexOf(step);
  return index >= 0 && index <= session.furthestStepIndex;
}

export function writingReducer(state, action) {
  if (action.type === "open-company") {
    return state.companyId === action.companyId ? state : (state.live ? createLiveWritingSession : createWritingSession)(action.companyId);
  }
  if (action.type === "generation-start") {
    if (action.companyId !== state.companyId || !["outline", "draft"].includes(action.stage)) return state;
    return { ...state, generation: { id: action.id, stage: action.stage, status: "generating" } };
  }
  if (["generation-success", "generation-failure", "generation-cancel"].includes(action.type)) {
    if (action.companyId !== state.companyId || state.generation?.id !== action.id || state.generation.status !== "generating") return state;
    if (action.type === "generation-cancel") return { ...state, generation: null };
    if (action.type === "generation-failure") return { ...state, generation: { ...state.generation, status: "error", message: action.message } };
    if (action.result.companyId !== state.companyId || action.result.stage !== state.generation.stage) return state;
    if (action.result.stage === "outline") return { ...state, generation: null, outline: action.result.markdown,
      outlineResult: action.result, draftResult: null, articleHtml: "", currentStep: "outline", furthestStepIndex: 1 };
    return { ...state, generation: null, articleHtml: action.articleHtml, draftResult: action.result,
      currentStep: "draft", furthestStepIndex: 2 };
  }
  if (action.type === "set-brief-field") {
    return { ...state, ...(state.live ? { furthestStepIndex: 0, outlineResult: null, draftResult: null, generation: null } : {}),
      brief: { ...state.brief, [action.field]: action.value } };
  }
  if (action.type === "set-audiences") {
    return { ...state, ...(state.live ? { furthestStepIndex: 0, outlineResult: null, draftResult: null, generation: null } : {}),
      brief: { ...state.brief, audiences: action.value } };
  }
  if (action.type === "set-outline") return { ...state, outline: action.value,
    ...(state.live ? { furthestStepIndex: 1, draftResult: null, generation: null } : {}) };
  if (action.type === "reset-outline") {
    return { ...state, outline: getWritingScenario(state.companyId).outline };
  }
  if (action.type === "set-article-html") return { ...state, articleHtml: action.value };
  if (action.type === "go-to-step") {
    if (state.generation?.status === "generating") return state;
    return canVisitWritingStep(state, action.step)
      ? { ...state, currentStep: action.step }
      : state;
  }
  if (action.type === "advance-step") {
    const currentIndex = WRITING_STEP_ORDER.indexOf(state.currentStep);
    const nextIndex = Math.min(currentIndex + 1, WRITING_STEP_ORDER.length - 1);
    return {
      ...state,
      currentStep: WRITING_STEP_ORDER[nextIndex],
      furthestStepIndex: Math.max(state.furthestStepIndex, nextIndex),
    };
  }
  return state;
}

export function normalizePastedText(text) {
  return text.replace(/\r\n?/g, "\n").replace(/\u0000/g, "");
}

export function normalizeEditorLink(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function buildResearchMarkdown(companyId = "otera") {
  const scenario = getWritingScenario(companyId);
  return `# ${scenario.researchTitle}\n\nResearch cutoff: ${scenario.researchCutoff}\n\n${scenario.researchSummary}\n`;
}
