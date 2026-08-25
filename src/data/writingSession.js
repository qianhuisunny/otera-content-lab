import { WRITING_SCENARIO, WRITING_STEP_ORDER } from "./writingScenario.js";

export function createWritingSession() {
  return {
    currentStep: "brief",
    furthestStepIndex: 0,
    brief: structuredClone(WRITING_SCENARIO.brief),
    outline: WRITING_SCENARIO.outline,
    articleHtml: WRITING_SCENARIO.articleHtml,
  };
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
  if (action.type === "set-brief-field") {
    return { ...state, brief: { ...state.brief, [action.field]: action.value } };
  }
  if (action.type === "set-audiences") {
    return { ...state, brief: { ...state.brief, audiences: action.value } };
  }
  if (action.type === "set-outline") return { ...state, outline: action.value };
  if (action.type === "reset-outline") return { ...state, outline: WRITING_SCENARIO.outline };
  if (action.type === "set-article-html") return { ...state, articleHtml: action.value };
  if (action.type === "go-to-step") {
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

export function buildResearchMarkdown() {
  return `# ${WRITING_SCENARIO.researchTitle}\n\nResearch cutoff: ${WRITING_SCENARIO.researchCutoff}\n\n${WRITING_SCENARIO.researchSummary}\n`;
}
