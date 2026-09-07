export const WORKSTREAM_IDS = Object.freeze([
  "company_positioning", "product_technical", "executive_buyer",
  "technical_buyer", "market_alternatives", "proof_claims", "skeptical_review",
]);
export const STAGE_IDS = Object.freeze(["scope", "research", "narrative", "asset", "review"]);
export const TERMINAL_RUN_STATUSES = Object.freeze(["completed", "failed"]);

const STAGES = Object.freeze(["discovery", "demo", "evaluation", "proposal"]);
const BUYERS = Object.freeze([
  "executive_sponsor", "workflow_owner", "technical_owner", "agent_builder",
  "conversation_quality_owner", "governance_approver",
  "solution_partner_platform_operator",
]);
const PURPOSES = Object.freeze([
  "problem", "cost", "shift", "approach", "workflow", "proof", "case_study",
  "implementation", "roi", "pricing", "cta",
]);
const PROOF_STATES = Object.freeze(["verified", "company_claim", "inference", "unresolved"]);
const REVIEW_CHECK_IDS = Object.freeze([
  "buyer_relevance", "story_arc", "business_outcome", "scanability", "proof",
  "pricing_posture", "next_step",
]);
const RUN_STATUSES = Object.freeze(["queued", "in_progress", "completed", "failed"]);
const STAGE_STATUSES = Object.freeze(["pending", "active", "complete", "failed"]);
const WORKSTREAM_STATUSES = Object.freeze(["queued", "running", "complete", "failed"]);
const SOURCE_CLASSES = Object.freeze(["local_context", "company_source", "third_party", "inference"]);

const invalid = (message) => { throw new TypeError(message); };
const object = (value, message) => {
  if (!value || Array.isArray(value) || typeof value !== "object") invalid(message);
  return value;
};
const text = (value, label, max) => {
  if (typeof value !== "string" || !value.trim() || value.length > max) {
    invalid("Check " + label + " (maximum " + max + " characters).");
  }
  return value.trim();
};
const nullableText = (value, label, max) => value === "" ? "" : text(value, label, max);
const array = (value, label, maximum = Infinity) => {
  if (!Array.isArray(value) || value.length > maximum) invalid("Check " + label + ".");
  return value;
};
const enumValue = (value, choices, label) => {
  if (!choices.includes(value)) invalid("Choose a supported " + label + ".");
  return value;
};
const exactKeys = (value, keys, label) => {
  object(value, "A valid " + label + " is required.");
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) {
    invalid("Check " + label + " fields.");
  }
  return value;
};
const unique = (values, label) => {
  if (new Set(values).size !== values.length) invalid("Duplicate " + label + " values are not allowed.");
  return values;
};
const exactSet = (values, expected, label) => {
  unique(values, label);
  if (values.length !== expected.length || expected.some((value) => !values.includes(value))) {
    invalid("Provide every required " + label + ".");
  }
  return values;
};
const iso = (value, label) => {
  const sanitized = text(value, label, 40);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(sanitized) ||
      Number.isNaN(Date.parse(sanitized)) || new Date(sanitized).toISOString() !== sanitized) {
    invalid("Check " + label + " as an ISO timestamp.");
  }
  return sanitized;
};
const date = (value, label) => {
  const sanitized = text(value, label, 10);
  const timestamp = sanitized + "T00:00:00.000Z";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sanitized) || Number.isNaN(Date.parse(timestamp)) ||
      new Date(timestamp).toISOString().slice(0, 10) !== sanitized) {
    invalid("Check " + label + " as an ISO date.");
  }
  return sanitized;
};

export function validateSalesEnablementInput(value) {
  object(value, "A sales enablement request is required.");
  exactKeys(value, [
    "companyId", "assetType", "sellerName", "salesStage", "primaryBuyer", "supportingBuyer",
    "buyerProblem", "desiredNextStep", "competitorContext", "knownObjections",
  ], "sales enablement request");
  if (value.assetType === "public_comparison_page") {
    invalid("A public comparison page belongs in the competitors workflow.");
  }
  if (value.companyId !== "retell") invalid("Choose the supported company.");
  if (value.assetType !== "executive_champion_deck") invalid("Choose the supported deck asset.");
  enumValue(value.salesStage, STAGES, "sales stage");
  enumValue(value.primaryBuyer, BUYERS, "primary buyer");
  enumValue(value.supportingBuyer, BUYERS, "supporting buyer");
  if (!Array.isArray(value.knownObjections) || value.knownObjections.length > 10) {
    invalid("Provide at most 10 objections.");
  }
  const knownObjections = [...new Set(value.knownObjections.map((entry) =>
    text(entry, "each objection", 300)))];
  return {
    companyId: "retell",
    assetType: "executive_champion_deck",
    sellerName: text(value.sellerName, "sellerName", 120),
    salesStage: value.salesStage,
    primaryBuyer: value.primaryBuyer,
    supportingBuyer: value.supportingBuyer,
    buyerProblem: text(value.buyerProblem, "buyerProblem", 4000),
    desiredNextStep: text(value.desiredNextStep, "desiredNextStep", 1000),
    competitorContext: typeof value.competitorContext === "string" && value.competitorContext.length <= 2000
      ? value.competitorContext.trim()
      : invalid("Check competitorContext (maximum 2000 characters)."),
    knownObjections,
  };
}

const validateSource = (value) => {
  exactKeys(value, ["id", "title", "locator", "sourceClass", "asOf"], "source");
  return {
    id: text(value.id, "source id", 200),
    title: text(value.title, "source title", 500),
    locator: text(value.locator, "source locator", 2000),
    sourceClass: enumValue(value.sourceClass, SOURCE_CLASSES, "source class"),
    asOf: date(value.asOf, "source asOf"),
  };
};

const validateEvidence = (value, sourceIds) => {
  exactKeys(value, ["id", "claim", "sourceIds", "evidenceClass", "confidence", "buyerImplication", "safeUse"], "evidence");
  const resolvedSourceIds = array(value.sourceIds, "evidence source IDs", 20)
    .map((id) => text(id, "evidence source ID", 200));
  if (!resolvedSourceIds.length) invalid("Evidence needs at least one source ID.");
  unique(resolvedSourceIds, "evidence source ID");
  if (resolvedSourceIds.some((id) => !sourceIds.has(id))) invalid("Evidence source ID does not resolve.");
  return {
    id: text(value.id, "evidence id", 200),
    claim: text(value.claim, "evidence claim", 6000),
    sourceIds: resolvedSourceIds,
    evidenceClass: text(value.evidenceClass, "evidence class", 100),
    confidence: text(value.confidence, "evidence confidence", 100),
    buyerImplication: text(value.buyerImplication, "buyer implication", 2000),
    safeUse: text(value.safeUse, "safe use", 2000),
  };
};

const validateResearch = (value, sourceIds) => {
  exactKeys(value, ["id", "summary", "evidence"], "research workstream");
  return {
    id: enumValue(value.id, WORKSTREAM_IDS, "research workstream"),
    summary: text(value.summary, "research summary", 6000),
    evidence: array(value.evidence, "research evidence", 50)
      .map((entry) => validateEvidence(entry, sourceIds)),
  };
};

const validateSlide = (value, sourceIds) => {
  exactKeys(value, ["id", "number", "purpose", "headline", "bodyBullets", "speakerNotes", "evidenceIds", "proofState"], "slide");
  if (!Number.isInteger(value.number) || value.number < 1 || value.number > 11) invalid("Check slide number.");
  const purpose = enumValue(value.purpose, PURPOSES, "slide purpose");
  const evidenceIds = array(value.evidenceIds, "slide evidence IDs", 20)
    .map((id) => text(id, "slide evidence ID", 200));
  unique(evidenceIds, "slide evidence ID");
  if (evidenceIds.some((id) => !sourceIds.has(id))) invalid("Slide evidence ID does not resolve.");
  const proofState = enumValue(value.proofState, PROOF_STATES, "proof state");
  if (["proof", "case_study", "roi"].includes(purpose) && !evidenceIds.length && proofState !== "unresolved") {
    invalid("Proof, case-study, and ROI slides need evidence or an unresolved proof state.");
  }
  const bodyBullets = array(value.bodyBullets, "slide body bullets", 5)
    .map((bullet) => text(bullet, "slide body bullet", 1000));
  if (!bodyBullets.length) invalid("Every slide needs at least one body bullet.");
  return {
    id: text(value.id, "slide id", 200), number: value.number, purpose,
    headline: text(value.headline, "slide headline", 500), bodyBullets,
    speakerNotes: text(value.speakerNotes, "slide speaker notes", 6000), evidenceIds, proofState,
  };
};

const validateCheck = (value) => {
  exactKeys(value, ["id", "label", "status", "detail"], "review check");
  return {
    id: enumValue(value.id, REVIEW_CHECK_IDS, "review check"),
    label: text(value.label, "review check label", 200),
    status: enumValue(value.status, ["passed", "warning", "blocked"], "review status"),
    detail: text(value.detail, "review check detail", 2000),
  };
};

const validateStringList = (value, label) => array(value, label, 100)
  .map((entry) => text(entry, label + " entry", 2000));

export function validateSalesEnablementArtifact(value) {
  exactKeys(value, ["context", "research", "narrative", "slides", "review", "sources"], "sales enablement artifact");
  const sourceRecords = array(value.sources, "sources", 100).map(validateSource);
  const sourceIds = sourceRecords.map(({ id }) => id);
  unique(sourceIds, "source ID");
  const sourceIdSet = new Set(sourceIds);
  exactKeys(value.context, ["seller", "primaryBuyer", "supportingBuyer", "salesStage", "objective", "evidencePosture"], "artifact context");
  const context = {
    seller: text(value.context.seller, "context seller", 500),
    primaryBuyer: text(value.context.primaryBuyer, "context primaryBuyer", 500),
    supportingBuyer: text(value.context.supportingBuyer, "context supportingBuyer", 500),
    salesStage: text(value.context.salesStage, "context salesStage", 500),
    objective: text(value.context.objective, "context objective", 4000),
    evidencePosture: text(value.context.evidencePosture, "context evidencePosture", 4000),
  };
  const research = array(value.research, "research", 7).map((entry) => validateResearch(entry, sourceIdSet));
  if (research.length !== 7) invalid("Provide exactly 7 research workstreams.");
  exactSet(research.map(({ id }) => id), WORKSTREAM_IDS, "research workstream");
  exactKeys(value.narrative, ["situation", "complication", "resolution", "slideRationale"], "narrative");
  const slideRationale = array(value.narrative.slideRationale, "slide rationale", 11).map((entry) => {
    exactKeys(entry, ["slideId", "rationale"], "slide rationale");
    return { slideId: text(entry.slideId, "slide rationale id", 200), rationale: text(entry.rationale, "slide rationale", 2000) };
  });
  if (slideRationale.length !== 11) invalid("Provide exactly 11 slide rationale records.");
  unique(slideRationale.map(({ slideId }) => slideId), "slide rationale ID");
  const slides = array(value.slides, "slides", 11).map((entry) => validateSlide(entry, sourceIdSet));
  if (slides.length !== 11) invalid("Provide exactly 11 slides.");
  if (slides.some((slide, index) => slide.number !== index + 1)) invalid("Slide numbers must be sequential.");
  unique(slides.map(({ id }) => id), "slide ID");
  exactSet(slides.map(({ purpose }) => purpose), PURPOSES, "slide purpose");
  if (slides.filter(({ purpose }) => purpose === "cta").length !== 1) invalid("Provide a single CTA slide.");
  if (slideRationale.some(({ slideId }) => !slides.some(({ id }) => id === slideId))) {
    invalid("Slide rationale ID does not resolve.");
  }
  exactKeys(value.review, ["checks", "warnings", "blockingGaps", "doNotOverclaim"], "review");
  const checks = array(value.review.checks, "review checks", 7).map(validateCheck);
  if (checks.length !== 7) invalid("Provide exactly 7 review checks.");
  exactSet(checks.map(({ id }) => id), REVIEW_CHECK_IDS, "review check");
  return {
    context, research,
    narrative: {
      situation: text(value.narrative.situation, "narrative situation", 6000),
      complication: text(value.narrative.complication, "narrative complication", 6000),
      resolution: text(value.narrative.resolution, "narrative resolution", 6000),
      slideRationale,
    },
    slides,
    review: {
      checks,
      warnings: validateStringList(value.review.warnings, "review warnings"),
      blockingGaps: validateStringList(value.review.blockingGaps, "review blocking gaps"),
      doNotOverclaim: validateStringList(value.review.doNotOverclaim, "review do-not-overclaim items"),
    },
    sources: sourceRecords,
  };
}

const validateStage = (value) => {
  exactKeys(value, ["id", "status"], "run stage");
  return { id: enumValue(value.id, STAGE_IDS, "stage"), status: enumValue(value.status, STAGE_STATUSES, "stage status") };
};
const validateWorkstream = (value) => {
  exactKeys(value, ["id", "status", "evidenceCount", "summary"], "run workstream");
  if (!Number.isInteger(value.evidenceCount) || value.evidenceCount < 0 || value.evidenceCount > 1000) {
    invalid("Check workstream evidence count.");
  }
  return {
    id: enumValue(value.id, WORKSTREAM_IDS, "workstream"),
    status: enumValue(value.status, WORKSTREAM_STATUSES, "workstream status"),
    evidenceCount: value.evidenceCount,
    summary: nullableText(value.summary, "workstream summary", 6000),
  };
};
const validateError = (value) => {
  if (value === null) return null;
  exactKeys(value, ["code", "message", "retryable", "retryAfterSeconds"], "run error");
  if (typeof value.retryable !== "boolean") invalid("Check run error retryable.");
  if (value.retryAfterSeconds !== null && (!Number.isInteger(value.retryAfterSeconds) || value.retryAfterSeconds < 0 || value.retryAfterSeconds > 86400)) {
    invalid("Check run error retry-after seconds.");
  }
  return {
    code: text(value.code, "run error code", 100), message: text(value.message, "run error message", 1000),
    retryable: value.retryable, retryAfterSeconds: value.retryAfterSeconds,
  };
};

export function validatePublicSalesEnablementRun(value) {
  exactKeys(value, ["id", "workflowId", "companyId", "status", "stageId", "stages", "createdAt", "updatedAt", "workstreams", "artifact", "error"], "public sales enablement run");
  const id = text(value.id, "run ID", 210);
  if (id !== "example_retell_sales_deck_v1" && !/^resp_[A-Za-z0-9_-]{8,200}$/.test(id)) invalid("Invalid sales enablement run ID.");
  if (value.workflowId !== "sales-enablement" || value.companyId !== "retell") invalid("Unsupported sales enablement workflow.");
  const status = enumValue(value.status, RUN_STATUSES, "run status");
  const stages = array(value.stages, "run stages", 5).map(validateStage);
  if (stages.length !== 5) invalid("Provide exactly 5 run stages.");
  exactSet(stages.map(({ id: stageId }) => stageId), STAGE_IDS, "run stage");
  const workstreams = array(value.workstreams, "run workstreams", 7).map(validateWorkstream);
  if (workstreams.length !== 7) invalid("Provide exactly 7 run workstreams.");
  exactSet(workstreams.map(({ id: workstreamId }) => workstreamId), WORKSTREAM_IDS, "run workstream");
  const artifact = value.artifact === null ? null : validateSalesEnablementArtifact(value.artifact);
  const error = validateError(value.error);
  if (status === "completed" && !artifact) invalid("Completed runs need a validated artifact.");
  if (status === "completed" && error) invalid("Completed runs cannot include an error.");
  return {
    id, workflowId: "sales-enablement", companyId: "retell", status,
    stageId: enumValue(value.stageId, STAGE_IDS, "stage"), stages,
    createdAt: iso(value.createdAt, "run createdAt"), updatedAt: iso(value.updatedAt, "run updatedAt"),
    workstreams, artifact, error,
  };
}
