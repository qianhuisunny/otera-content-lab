import assert from "node:assert/strict";
import test from "node:test";

import {
  WRITING_SCENARIO,
  WRITING_STEP_ORDER,
} from "../src/data/writingScenario.js";
import {
  buildResearchMarkdown,
  canVisitWritingStep,
  createWritingSession,
  normalizeEditorLink,
  normalizePastedText,
  validateBrief,
  writingReducer,
} from "../src/data/writingSession.js";

test("the Otera writing fixture defines the approved four-step scenario", () => {
  assert.deepEqual(WRITING_STEP_ORDER, ["brief", "outline", "draft", "review"]);
  assert.equal(
    WRITING_SCENARIO.title,
    "How governed AI agents automate insurance claims across legacy systems",
  );
  assert.equal(WRITING_SCENARIO.brief.keyword, "agentic claims automation");
  assert.deepEqual(WRITING_SCENARIO.brief.audiences, [
    "Operations Leader",
    "Enterprise Architect",
    "Transformation Lead",
  ]);
  assert.match(WRITING_SCENARIO.articleHtml, /company-reported outcomes/i);
  assert.match(WRITING_SCENARIO.articleHtml, /reverify/i);
});

test("brief validation reports every required empty field", () => {
  assert.deepEqual(
    validateBrief({
      opportunity: "",
      format: "",
      audiences: [],
      keyword: "",
      intent: "",
      directions: "",
      targetLength: "",
    }),
    {
      format: "Choose an article format.",
      audiences: "Choose at least one audience.",
      keyword: "Add a primary keyword.",
      targetLength: "Add a target length.",
    },
  );
});

test("the reducer preserves edits and unlocks steps in order", () => {
  const initial = createWritingSession();
  const edited = writingReducer(initial, {
    type: "set-brief-field",
    field: "keyword",
    value: "governed claims agents",
  });
  const advanced = writingReducer(edited, { type: "advance-step" });

  assert.equal(advanced.brief.keyword, "governed claims agents");
  assert.equal(advanced.currentStep, "outline");
  assert.equal(advanced.furthestStepIndex, 1);
  assert.equal(canVisitWritingStep(advanced, "outline"), true);
  assert.equal(canVisitWritingStep(advanced, "draft"), false);
});

test("editor helpers keep paste plain and links safe", () => {
  assert.equal(normalizePastedText("A\r\n\r\nB\u0000"), "A\n\nB");
  assert.equal(
    normalizeEditorLink("https://www.otera.ai/product"),
    "https://www.otera.ai/product",
  );
  assert.equal(normalizeEditorLink("javascript:alert(1)"), null);
});

test("research export contains title, evidence posture, and source date", () => {
  const markdown = buildResearchMarkdown();
  assert.match(markdown, /^# Governed claims automation research/m);
  assert.match(markdown, /Research cutoff: 2026-08-23/);
  assert.match(markdown, /Company-reported outcomes require attribution/);
});
