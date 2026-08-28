import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

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

async function withVite(t, callback) {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true },
  });
  t.after(() => vite.close());
  return callback(vite);
}

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

test("brief screen renders the approved controlled fields", async (t) => {
  await withVite(t, async (vite) => {
    const { BriefStep } = await vite.ssrLoadModule("/src/components/writing/BriefStep.jsx");
    const session = createWritingSession();
    const markup = renderToStaticMarkup(
      React.createElement(BriefStep, {
        brief: session.brief,
        dispatch: () => {},
        onAdvance: () => {},
      }),
    );
    const readableMarkup = markup.replaceAll("&#x27;", "'");
    for (const label of ["Linked opportunity", "Article format", "Who it's for", "Primary keyword", "What the searcher wants", "Additional directions", "Target length"]) {
      assert.ok(readableMarkup.includes(label), `${label} must be rendered`);
    }
    assert.match(markup, /Plan outline/);
    assert.match(markup, /Regenerate outline/);
    assert.doesNotMatch(markup, /Brief is ready for the next step\./);
  });
});

test("brief controls retain accessible validation and disclosure semantics", async (t) => {
  await withVite(t, async (vite) => {
    const { BriefStep } = await vite.ssrLoadModule("/src/components/writing/BriefStep.jsx");
    const session = createWritingSession();
    const briefMarkup = renderToStaticMarkup(
      React.createElement(BriefStep, {
        brief: session.brief,
        dispatch: () => {},
        onAdvance: () => {},
      }),
    );
    for (const [controlId, errorId] of [
      ["brief-format", "brief-format-error"],
      ["brief-audiences", "brief-audiences-error"],
      ["brief-keyword", "brief-keyword-error"],
      ["brief-target-length", "brief-target-length-error"],
    ]) {
      const control = briefMarkup.match(new RegExp(`<[^>]+id="${controlId}"[^>]*>`))?.[0] ?? "";
      assert.ok(control.includes(`aria-describedby="${errorId}"`), `${controlId} must describe its error`);
      assert.match(briefMarkup, new RegExp(`id="${errorId}"`));
    }

    assert.doesNotMatch(briefMarkup, /role="menu"|role="menuitemradio"|aria-checked=/);
  });
});

test("outline screen renders editable Otera structure and actions", async (t) => {
  await withVite(t, async (vite) => {
    const { OutlineStep } = await vite.ssrLoadModule("/src/components/writing/OutlineStep.jsx");
    const markup = renderToStaticMarkup(
      React.createElement(OutlineStep, {
        outline: WRITING_SCENARIO.outline,
        dispatch: () => {},
        onAdvance: () => {},
        onBack: () => {},
      }),
    );
    assert.match(markup, /Plan outline/);
    assert.match(markup, /What agentic claims automation changes/);
    assert.match(markup, /Draft first version/);
    assert.match(markup, /h2:/);
  });
});
