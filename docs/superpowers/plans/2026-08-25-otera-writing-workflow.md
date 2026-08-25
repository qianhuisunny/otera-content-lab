# Otera Writing Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive, frontend-only Otera Writing workspace as a third left-navigation tab while preserving the existing Context Library and Workflow catalog.

**Architecture:** Keep `App` as the three-view coordinator and hold the writing session in a reducer so it survives view switches. Build the four writing screens as focused app-local React components driven by immutable Otera fixture data, reuse `@qianhui/ui` and `--qh-*` tokens, and isolate new visual rules in `src/writing.css`.

**Tech Stack:** React 19, Vite 6, plain JavaScript/JSX, Node's built-in test runner, Vite SSR test loading, `@qianhui/ui`, `@phosphor-icons/react`, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-08-25-otera-writing-workflow-design.md`

## Global Constraints

- Preserve the existing `Context`, `Workflow`, and new `Writing` views; `Writing` is the third accessible sidebar tab.
- Do not modify `src/components/WorkflowView.jsx`, any file under `content/otera/`, the Sites worker, hosting manifest, build preparation script, `vendor/`, or `../UI-library`.
- Preserve the user's existing unstaged changes in `README.md` and `src/components/CollectionHeader.jsx`; never stage those files in this plan.
- Use the repository-local `@qianhui/ui` package and its `--qh-*` tokens; use Phosphor for every standard interface icon.
- Do not add a router, rich-text framework, backend, AI request, persistence, authentication, publishing, collaboration, annotation, or dynamic coverage analysis.
- Keep all writing changes in memory; switching views preserves the session and refreshing resets it.
- Treat the four screenshots as structural references only. Do not reproduce the external `Workflow Studio` toolbar from screenshot 4.
- Use Otera evidence-aware copy: label company claims, label inference, and retain re-verification language for time-sensitive facts.
- Every task commit must stage only the files named by that task.

## File map

- Create `src/data/writingScenario.js`: immutable Otera brief, outline, research, article HTML, activity, coverage, and workflow definitions.
- Create `src/data/writingSession.js`: session factory, validation, reducer, step-access helper, paste normalization, link validation, and Markdown export builder.
- Create `src/components/writing/WritingPageHeader.jsx`: shared screen heading and supporting copy.
- Create `src/components/writing/BriefStep.jsx`: controlled angle-and-format form.
- Create `src/components/writing/OutlineStep.jsx`: editable plain-text outline and navigation actions.
- Create `src/components/writing/DraftStep.jsx`: activity/research accordions and research export.
- Create `src/components/writing/RichTextEditor.jsx`: content-editable article surface and formatting toolbar.
- Create `src/components/writing/CoveragePanel.jsx`: read-only Otera coverage summary.
- Create `src/components/writing/ReviewStep.jsx`: editor/coverage composition.
- Create `src/components/writing/WritingSidebar.jsx`: BRIEF IT, WRITE IT, and SHIP IT step navigation.
- Create `src/components/writing/WritingTopbar.jsx`: writing-specific title, article ID, status, and Exit action.
- Create `src/components/writing/WritingWorkspace.jsx`: maps reducer state to the four screen components.
- Create `src/writing.css`: all new writing-workspace visual and responsive rules.
- Create `tests/writing.test.mjs`: reducer, validation, fixture, SSR, and export tests.
- Modify `src/App.jsx`: add the persistent writing reducer, third view, conditional top bar, and workspace wiring.
- Modify `src/components/AppSidebar.jsx`: add Writing to the accessible tab list and mount WritingSidebar only for that view.
- Modify `src/main.jsx`: import `writing.css` after the existing app stylesheet.
- Modify `src/styles.css`: only the small shared-shell selectors required for a writing-specific main width; place all other new styling in `writing.css`.
- Modify `tests/content.test.mjs`: preserve existing Workflow assertions and update tab expectations from two to three.
- Modify `package.json`: run Context and Writing tests together while leaving Sites packaging under `test:sites`.
- Modify `design-qa.md`: append writing-flow QA without removing the existing Context/Workflow QA history.

---

### Task 1: Writing fixture and deterministic session state

**Files:**
- Create: `src/data/writingScenario.js`
- Create: `src/data/writingSession.js`
- Create: `tests/writing.test.mjs`
- Modify: `package.json:6-11`

**Interfaces:**
- Consumes: No new implementation interfaces.
- Produces: `WRITING_STEP_ORDER`, `WRITING_PHASES`, `WRITING_SCENARIO`, `ACTIVITY_ITEMS`, `COVERAGE_ITEMS`, `createWritingSession()`, `validateBrief(brief)`, `canVisitWritingStep(session, step)`, `writingReducer(state, action)`, `normalizePastedText(text)`, `normalizeEditorLink(value)`, and `buildResearchMarkdown()`.

- [ ] **Step 1: Write the failing data and reducer tests**

Create `tests/writing.test.mjs` with these initial tests:

```js
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
  assert.equal(normalizeEditorLink("https://www.otera.ai/product"), "https://www.otera.ai/product");
  assert.equal(normalizeEditorLink("javascript:alert(1)"), null);
});

test("research export contains title, evidence posture, and source date", () => {
  const markdown = buildResearchMarkdown();
  assert.match(markdown, /^# Governed claims automation research/m);
  assert.match(markdown, /Research cutoff: 2026-08-23/);
  assert.match(markdown, /Company-reported outcomes require attribution/);
});
```

- [ ] **Step 2: Make the test command discover the new file and verify failure**

Change the package script to keep Sites packaging isolated from the normal unit suite:

```json
"test": "node --test tests/content.test.mjs tests/writing.test.mjs"
```

Run: `npm test`

Expected: FAIL because `src/data/writingScenario.js` and `src/data/writingSession.js` do not exist.

- [ ] **Step 3: Create the immutable Otera scenario**

Create `src/data/writingScenario.js` with these exports and exact approved values:

```js
export const WRITING_STEP_ORDER = ["brief", "outline", "draft", "review"];

export const WRITING_PHASES = [
  {
    number: "01",
    label: "BRIEF IT",
    steps: [
      { id: "brief", label: "Pick angle & format", description: "Intent, format, audience" },
      { id: "outline", label: "Plan outline", description: "Sketch the structure" },
    ],
  },
  {
    number: "02",
    label: "WRITE IT",
    steps: [
      { id: "draft", label: "Drafted first version", description: "Agent's first draft" },
      { id: "review", label: "Review & edit", description: "Edit the article" },
      { id: "polish", label: "Polish", description: "Wordsmith, restructure, refine", disabled: true },
      { id: "feedback", label: "Invite feedback", description: "Optional teammate reviews", disabled: true },
    ],
  },
  {
    number: "03",
    label: "SHIP IT",
    steps: [
      { id: "meta", label: "Adjust title & meta", description: "Title, slug, meta, cover", disabled: true },
      { id: "publish", label: "Publish", description: "Export and ship", disabled: true },
    ],
  },
];

export const WRITING_SCENARIO = {
  articleId: "OT-18",
  title: "How governed AI agents automate insurance claims across legacy systems",
  status: "Reviewing",
  researchCutoff: "2026-08-23",
  brief: {
    opportunity: "Governed claims automation for regulated insurers",
    format: "Explainer",
    audiences: ["Operations Leader", "Enterprise Architect", "Transformation Lead"],
    keyword: "agentic claims automation",
    intent:
      "An insurance operations or technology leader wants to understand how governed agents coordinate document intake, rules, exceptions, human review, and system-of-record updates without replacing core claims systems.",
    directions:
      "Separate company claims from independently corroborated evidence. Reverify time-sensitive product and customer facts before external publication.",
    targetLength: "2,500–3,200",
  },
  outline: `1. [Intro: Why claims automation stalls when documents, rules, exceptions, and legacy systems meet. 2–3 sentences.]

2. h2: What agentic claims automation changes [Define the operating problem and distinguish governed workflow execution from extraction-only tools.]

3. h2: How governed agents move a claim across systems [Describe intake, classification, validation, business rules, system writes, and exception handling.]
   • h3: Document and email intake
   • h3: Validation, confidence, and business rules
   • h3: Human review and exception recovery

4. h2: Why legacy claims systems stay in place [Explain the operating-layer model, integration boundaries, credentials, logs, and rollback.]

5. h2: Evidence an insurer should require [Representative ground truth, error taxonomy, end-to-end integration tests, and operational ownership.]

6. h2: What Otera publicly claims—and what still needs verification [Attribute company-reported customer outcomes and flag open diligence questions.]

7. h2: A production-readiness checklist [Architecture, governance, support, and measurable operational outcomes.]

8. h2: FAQ [Accuracy, human review, core-system replacement, integration maturity, and evaluation.]`,
  researchTitle: "Governed claims automation research",
  researchSummary:
    "A source-aware synthesis of Otera product context, insurance ICP signals, technical evaluation criteria, and public customer evidence. Company-reported outcomes require attribution and time-sensitive facts must be reverified before publication.",
  articleHtml: `<h1>How governed AI agents automate insurance claims across legacy systems</h1>
<p>Claims automation rarely fails because a team cannot extract another field from a document. It fails when emails, PDFs, business rules, approvals, exceptions, and legacy claims systems must behave like one governed process.</p>
<h2>What agentic claims automation changes</h2>
<p>Agentic claims automation coordinates classification, validation, decision support, system updates, and human review across an end-to-end workflow. The useful distinction is not whether a model is present; it is whether the operating process remains observable, reversible, and accountable.</p>
<h2>How governed agents move a claim across systems</h2>
<p>A production design starts with representative intake, applies rules and confidence thresholds, writes only through approved permissions, and sends consequential exceptions to a reviewer with the evidence needed to decide.</p>
<blockquote>Human review is a control only when the reviewer receives context, authority, and a manageable exception load.</blockquote>
<h2>Evidence an insurer should require</h2>
<ul><li>A benchmark using representative ground truth</li><li>An error taxonomy tied to business consequence</li><li>An end-to-end test including failure recovery</li><li>Clear ownership for monitoring, change, and rollback</li></ul>
<h2>Public claims and verification</h2>
<p>Otera and its partners publish customer outcomes, including claims-processing improvements. These are company-reported outcomes and should be attributed to the original dated source. Reverify product capabilities, customer status, leadership, and integration counts before external publication.</p>
<table><thead><tr><th>Dimension</th><th>Extraction-only automation</th><th>Governed agent workflow</th></tr></thead><tbody><tr><td>Exceptions</td><td>Manual queue after extraction</td><td>Context, confidence, routing, and recovery path</td></tr><tr><td>Core systems</td><td>Point integration</td><td>Controlled writes across an orchestrated process</td></tr></tbody></table>`,
};

export const ACTIVITY_ITEMS = [
  { id: "questions", title: "Generating research questions", description: "Turning the approved Otera outline into evidence-aware research questions." },
  { id: "research", title: "Researching the topic", description: "Reviewing Otera context, insurance workflow evidence, and technical diligence criteria." },
  { id: "writing", title: "Writing the draft", description: "Composing the article from the approved outline and source posture." },
  { id: "post", title: "Post-processing", description: "Formatting the article, checking attribution, and reviewing editorial voice.", details: ["Formatting headings, links, and the comparison table.", "Checking company claims for source attribution.", "Flagging facts that require re-verification before publication."] },
];

export const COVERAGE_ITEMS = [
  { label: "governed claims automation", covered: true },
  { label: "human review and exceptions", covered: true },
  { label: "legacy system integration", covered: true },
  { label: "independent customer evidence", covered: false },
];
```

- [ ] **Step 4: Implement the session helpers and reducer**

Create `src/data/writingSession.js` with the tested exports. Use `structuredClone(WRITING_SCENARIO.brief)` in `createWritingSession()`. For `advance-step`, cap the next index at `WRITING_STEP_ORDER.length - 1`; for `go-to-step`, return the unchanged state when `canVisitWritingStep()` is false. `normalizeEditorLink()` must accept only `http:` and `https:` URLs. `buildResearchMarkdown()` must return this structure:

```js
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
```

- [ ] **Step 5: Run the tests and commit the state foundation**

Run: `npm test`

Expected: all existing content tests and the five new writing tests PASS.

Run: `git status --short`

Expected: the task files plus the pre-existing unstaged `README.md` and `src/components/CollectionHeader.jsx` changes. Stage only:

```bash
git add package.json src/data/writingScenario.js src/data/writingSession.js tests/writing.test.mjs
git commit -m "feat: add Otera writing session data"
```

---

### Task 2: Brief and outline screen components

**Files:**
- Create: `src/components/writing/WritingPageHeader.jsx`
- Create: `src/components/writing/BriefStep.jsx`
- Create: `src/components/writing/OutlineStep.jsx`
- Create: `src/writing.css`
- Modify: `tests/writing.test.mjs`

**Interfaces:**
- Consumes: `WRITING_SCENARIO`, `validateBrief(brief)`, reducer actions `set-brief-field`, `set-audiences`, `reset-outline`, `set-outline`, and `advance-step`.
- Produces: `WritingPageHeader({ title, description, meta })`, `BriefStep({ brief, dispatch, onAdvance })`, and `OutlineStep({ outline, dispatch, onAdvance, onBack })`.

- [ ] **Step 1: Write failing SSR tests for the first two screens**

Append a Vite SSR helper and these tests to `tests/writing.test.mjs`:

```js
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

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
    for (const label of ["Linked opportunity", "Article format", "Who it's for", "Primary keyword", "What the searcher wants", "Additional directions", "Target length"]) {
      assert.ok(markup.includes(label), `${label} must be rendered`);
    }
    assert.match(markup, /Plan outline/);
    assert.match(markup, /Regenerate outline/);
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
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `node --test --test-name-pattern="brief screen|outline screen" tests/writing.test.mjs`

Expected: FAIL because the two JSX modules do not exist.

- [ ] **Step 3: Implement the shared header and brief form**

`WritingPageHeader` renders a `header.writing-page-header`, optional metadata, `h1`, and description. `BriefStep` uses semantic labels and controlled inputs. It keeps `errors`, the format menu, audience suggestion menu, and refs for required controls in local React state. On submit:

```js
const nextErrors = validateBrief(brief);
setErrors(nextErrors);
if (Object.keys(nextErrors).length === 0) onAdvance();
```

When errors exist, focus the first control in the fixed order `format`, `audiences`, `keyword`, `targetLength` so keyboard and screen-reader users arrive at the first problem.

Use `Button` for `Regenerate outline` and `Plan outline`. Dispatch these exact actions:

```js
dispatch({ type: "set-brief-field", field: event.target.name, value: event.target.value });
dispatch({ type: "set-audiences", value: brief.audiences.filter((item) => item !== audience) });
dispatch({ type: "reset-outline" });
```

The format menu offers `Explainer`, `Technical guide`, and `Executive brief`. Audience suggestions are the three approved audiences, and a removed audience can be added again.

- [ ] **Step 4: Implement the outline editor**

Render a labeled textarea whose value is `outline` and whose `onChange` dispatches `set-outline`. Trim the outline before allowing `onAdvance`; show `Add at least one outline section.` in an `aria-live="polite"` error when empty. The helper line must contain literal `h2:`, `h3:`, and `[brackets]` examples. Use secondary `Back to brief` and primary `Draft first version` buttons.

- [ ] **Step 5: Add the first writing styles**

Create `src/writing.css` with token-based rules for:

- `.writing-page`, max width `62rem`, centered with `3rem 2.75rem 6rem` padding.
- `.writing-page-header`, title size `1.9rem`, muted description, and metadata row.
- `.writing-form`, `.writing-field`, inputs, textareas, menu cards, and audience chips.
- `.writing-actions`, a border-top action row with secondary action left and primary action right.
- `.writing-outline-editor`, minimum height `48rem`, border `0`, font size `var(--qh-text-body)`, line height `1.9`, and visible focus outline.
- `.writing-error`, using `var(--qh-color-diff-removed-text)` plus text so color is not the only signal.

Do not use gradients, hand-drawn icons, or hard-coded colors that duplicate existing `--qh-*` tokens.

- [ ] **Step 6: Run tests and commit the first two screens**

Run: `npm test`

Expected: all tests PASS.

```bash
git add src/components/writing/WritingPageHeader.jsx src/components/writing/BriefStep.jsx src/components/writing/OutlineStep.jsx src/writing.css tests/writing.test.mjs
git commit -m "feat: build writing brief and outline"
```

---

### Task 3: Draft activity and research screen

**Files:**
- Create: `src/components/writing/DraftStep.jsx`
- Modify: `src/writing.css`
- Modify: `tests/writing.test.mjs`

**Interfaces:**
- Consumes: `ACTIVITY_ITEMS`, `WRITING_SCENARIO`, `buildResearchMarkdown()`, and callback `onAdvance()`.
- Produces: `DraftStep({ onAdvance })` with accessible activity/research accordions and local Markdown export.

- [ ] **Step 1: Write the failing DraftStep SSR test**

```js
test("draft screen exposes completed activity, research, export, and review actions", async (t) => {
  await withVite(t, async (vite) => {
    const { DraftStep } = await vite.ssrLoadModule("/src/components/writing/DraftStep.jsx");
    const markup = renderToStaticMarkup(React.createElement(DraftStep, { onAdvance: () => {} }));
    for (const text of ["Drafted first version", "Generating research questions", "Researching the topic", "Writing the draft", "Post-processing", "Governed claims automation research", "Export research", "Review & edit"]) {
      assert.ok(markup.includes(text), `${text} must be rendered`);
    }
    assert.match(markup, /aria-expanded="true"/);
  });
});
```

- [ ] **Step 2: Verify the focused test fails**

Run: `node --test --test-name-pattern="draft screen" tests/writing.test.mjs`

Expected: FAIL because `DraftStep.jsx` does not exist.

- [ ] **Step 3: Implement the activity and research accordions**

Create `DraftStep.jsx`. Initialize open activity IDs to `new Set(["post"])` and research to open. Each header is a button with `aria-expanded`, `aria-controls`, and a stable panel ID. `Inspect` replaces the set with every `ACTIVITY_ITEMS` ID. Render `CheckCircle` and `CaretDown` from Phosphor rather than text glyphs.

The page metadata is exactly `25m · 8 sources · 2,940 words · Target: 2,500–3,200`. Post-processing renders its three supplied detail rows. The research section shows `WRITING_SCENARIO.researchTitle` and `researchSummary`.

- [ ] **Step 4: Implement local Markdown export with an inline failure state**

The export handler creates a `Blob`, object URL, and temporary anchor named `otera-governed-claims-research.md`, then revokes the URL. Wrap the operation in `try/catch`; on failure render `Research export could not be created.` inside an `aria-live="polite"` element. Do not simulate loading.

- [ ] **Step 5: Add DraftStep styles and verify**

Add token-based rules for `.writing-activity`, `.writing-section-bar`, `.activity-card`, `.activity-card__summary`, `.activity-details`, `.activity-detail`, and `.research-summary`. Match the reference with 1px borders, token radii, no heavy shadows, muted descriptions, and generous vertical rhythm.

Run: `npm test`

Expected: all tests PASS.

```bash
git add src/components/writing/DraftStep.jsx src/writing.css tests/writing.test.mjs
git commit -m "feat: add writing draft activity"
```

---

### Task 4: Frontend-only rich text review editor

**Files:**
- Create: `src/components/writing/RichTextEditor.jsx`
- Create: `src/components/writing/CoveragePanel.jsx`
- Create: `src/components/writing/ReviewStep.jsx`
- Modify: `src/writing.css`
- Modify: `tests/writing.test.mjs`

**Interfaces:**
- Consumes: `articleHtml`, `dispatch({ type: "set-article-html", value })`, `COVERAGE_ITEMS`, `normalizeEditorLink(value)`, and `normalizePastedText(text)`.
- Produces: `RichTextEditor({ value, onChange })`, `CoveragePanel()`, and `ReviewStep({ articleHtml, dispatch })`.

- [ ] **Step 1: Write failing SSR tests for the editor and review composition**

```js
test("review screen renders an editable article toolbar and read-only coverage", async (t) => {
  await withVite(t, async (vite) => {
    const { ReviewStep } = await vite.ssrLoadModule("/src/components/writing/ReviewStep.jsx");
    const markup = renderToStaticMarkup(
      React.createElement(ReviewStep, {
        articleHtml: WRITING_SCENARIO.articleHtml,
        dispatch: () => {},
      }),
    );
    for (const label of ["Paragraph style", "Bold", "Italic", "Underline", "Add link", "Block quote", "Bulleted list", "Numbered list", "Undo", "Redo"]) {
      assert.ok(markup.includes(label), `${label} must be rendered`);
    }
    assert.match(markup, /contenteditable="true"/i);
    assert.match(markup, /Coverage/);
    assert.match(markup, /independent customer evidence/i);
    assert.doesNotMatch(markup, /Highlight any passage|leave a note|agent applies your notes/i);
  });
});
```

- [ ] **Step 2: Verify the review test fails**

Run: `node --test --test-name-pattern="review screen" tests/writing.test.mjs`

Expected: FAIL because `ReviewStep.jsx` does not exist.

- [ ] **Step 3: Build the editor toolbar and editable surface**

Use a `ref` for the editable article. Give the surface `role="textbox"`, `aria-multiline="true"`, and `aria-label="Article editor"`. Every toolbar button calls a shared command helper that refocuses the editor and invokes `document.execCommand(command, false, value)`. The block-style select maps `paragraph` to `p`, `heading1` to `h1`, `heading2` to `h2`, and `heading3` to `h3` through `formatBlock`.

Use Phosphor icons `TextB`, `TextItalic`, `TextUnderline`, `Link`, `Quotes`, `ListBullets`, `ListNumbers`, `ArrowCounterClockwise`, and `ArrowClockwise`. Each button has the exact accessible label asserted above.

The link command prompts with `Enter an https:// URL`, passes the value through `normalizeEditorLink()`, and only calls `createLink` for a non-null result. `onInput` passes `event.currentTarget.innerHTML` to `onChange`. Listen for `selectionchange` while the editor is mounted, call `document.queryCommandState()` for bold, italic, underline, insertUnorderedList, and insertOrderedList, and expose the result through `aria-pressed` on the corresponding toolbar buttons.

For paste:

```js
const handlePaste = (event) => {
  event.preventDefault();
  const text = normalizePastedText(event.clipboardData.getData("text/plain"));
  document.execCommand("insertText", false, text);
};
```

Render the initial HTML with `dangerouslySetInnerHTML={{ __html: value }}`. This content is the local trusted fixture plus user edits and never leaves the browser.

- [ ] **Step 4: Build the read-only Coverage panel and review grid**

`CoveragePanel` uses `ChartDonut`, `CheckCircle`, `Circle`, and `Star` from Phosphor. Show `3 of 4 core topics` and the four `COVERAGE_ITEMS`. Add three read-only criteria: `Evidence-aware`, `Worth differentiating`, and `Operational depth`. Do not draw a progress ring with CSS or SVG.

`ReviewStep` renders a two-column grid containing `RichTextEditor` and `CoveragePanel`. It has no yellow training card, highlighter, annotation UI, save action, or backend status.

- [ ] **Step 5: Style the editor and Coverage panel**

Add rules for `.review-layout`, `.rich-editor`, `.editor-toolbar`, `.editor-tool`, `.editor-surface`, `.coverage-panel`, `.coverage-score`, `.coverage-list`, and `.coverage-criterion`. The toolbar is sticky below the writing top bar, wraps on narrow screens, uses token borders, and shows visible focus. The article surface has a `46rem` readable line length, body line-height around `1.75`, bordered tables, underlined links, and token-styled block quotes.

- [ ] **Step 6: Run tests and commit the review editor**

Run: `npm test`

Expected: all tests PASS.

```bash
git add src/components/writing/RichTextEditor.jsx src/components/writing/CoveragePanel.jsx src/components/writing/ReviewStep.jsx src/writing.css tests/writing.test.mjs
git commit -m "feat: add writing review editor"
```

---

### Task 5: Integrate the third view, workflow sidebar, and four-step journey

**Files:**
- Create: `src/components/writing/WritingSidebar.jsx`
- Create: `src/components/writing/WritingTopbar.jsx`
- Create: `src/components/writing/WritingWorkspace.jsx`
- Modify: `src/App.jsx:1-131`
- Modify: `src/components/AppSidebar.jsx:1-77`
- Modify: `src/main.jsx:1-10`
- Modify: `src/styles.css:71-260`
- Modify: `src/writing.css`
- Modify: `tests/content.test.mjs:110-154`
- Modify: `tests/writing.test.mjs`

**Interfaces:**
- Consumes: all prior writing components, `WRITING_PHASES`, `createWritingSession()`, `canVisitWritingStep(session, step)`, and `writingReducer(state, action)`.
- Produces: a third `Writing` tab, persistent session across view switches, accessible step navigation, conditional writing top bar, and complete Brief → Outline → Draft → Review journey.

- [ ] **Step 1: Update the existing tab tests and add failing integration assertions**

In `tests/content.test.mjs`, rename the sidebar test to `the sidebar exposes Context, Workflow, and Writing as accessible view tabs` and change its assertions to:

```js
assert.equal((navigationMarkup.match(/role="tab"/g) ?? []).length, 3);
assert.ok(navigationMarkup.indexOf("Context") < navigationMarkup.indexOf("Workflow"));
assert.ok(navigationMarkup.indexOf("Workflow") < navigationMarkup.indexOf("Writing"));
```

Keep every existing assertion that Workflow content is preserved. Update the default-app test to assert both `>Workflow<` and `>Writing<` while still asserting that Context content is the initial tab panel.

Append to `tests/writing.test.mjs`:

```js
test("Writing workspace wires all four screens to the approved session", async (t) => {
  await withVite(t, async (vite) => {
    const { WritingWorkspace } = await vite.ssrLoadModule("/src/components/writing/WritingWorkspace.jsx");
    for (const [step, expected] of [
      ["brief", "Pick angle & format"],
      ["outline", "Plan outline"],
      ["draft", "Drafted first version"],
      ["review", "Paragraph style"],
    ]) {
      const session = { ...createWritingSession(), currentStep: step, furthestStepIndex: 3 };
      const markup = renderToStaticMarkup(
        React.createElement(WritingWorkspace, { session, dispatch: () => {} }),
      );
      assert.match(markup, new RegExp(expected.replace(/[&]/g, "&amp;")));
    }
  });
});

test("Writing sidebar reports active, completed, locked, and disabled steps", async (t) => {
  await withVite(t, async (vite) => {
    const { WritingSidebar } = await vite.ssrLoadModule("/src/components/writing/WritingSidebar.jsx");
    const markup = renderToStaticMarkup(
      React.createElement(WritingSidebar, {
        session: { ...createWritingSession(), currentStep: "outline", furthestStepIndex: 1 },
        onStepChange: () => {},
      }),
    );
    assert.match(markup, /aria-current="step"/);
    assert.match(markup, /Pick angle &amp; format/);
    assert.match(markup, /Review &amp; edit/);
    assert.match(markup, /disabled=""/);
  });
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test`

Expected: FAIL because the sidebar still has two tabs and the three integration components do not exist.

- [ ] **Step 3: Implement WritingSidebar and WritingTopbar**

`WritingSidebar` maps `WRITING_PHASES`. Number and phase label are headings; implemented step IDs become buttons. Use `canVisitWritingStep()` to disable locked future steps, and respect each fixture item's explicit `disabled`. Add `aria-current="step"` to the active item. Use `Check` for completed steps and `Circle` for the active step; do not use text glyphs.

`WritingTopbar` renders an `Exit` button with `CaretLeft`, the uppercase label `CREATING PAGE FOR`, `WRITING_SCENARIO.title`, the `OT-18` chip, and `STATUS: Reviewing`. `Exit` calls the supplied `onExit` callback and returns to Workflow.

- [ ] **Step 4: Implement WritingWorkspace screen routing**

Map `session.currentStep` to the four components. The callbacks are exact reducer actions:

```js
const advance = () => dispatch({ type: "advance-step" });
const goTo = (step) => dispatch({ type: "go-to-step", step });
```

Pass `brief` and `dispatch` to BriefStep, `outline` and `dispatch` to OutlineStep, `onAdvance` to DraftStep, and `articleHtml` plus `dispatch` to ReviewStep. Back from outline uses `goTo("brief")`.

- [ ] **Step 5: Integrate the reducer and third tab in App**

Import `useReducer`, `WritingTopbar`, `WritingWorkspace`, `createWritingSession`, and `writingReducer`. Initialize once:

```js
const [writingSession, dispatchWriting] = useReducer(
  writingReducer,
  undefined,
  createWritingSession,
);
```

Render `WritingTopbar` when `activeView === "writing"`; otherwise preserve the existing Content Lab top bar exactly. Pass `writingSession` and a step-change dispatcher to AppSidebar. Render Context for `context`, preserve `WorkflowView` for `workflow`, and render `WritingWorkspace` for `writing`. Apply `writing-main` only to the writing tab panel.

- [ ] **Step 6: Add Writing to AppSidebar without disturbing keyboard behavior**

Set:

```js
const viewItems = [
  { id: "context", label: "Context" },
  { id: "workflow", label: "Workflow" },
  { id: "writing", label: "Writing" },
];
```

Keep the current left/right/up/down/Home/End behavior over all three tabs. Render `WritingSidebar` after the tab list only when `activeView === "writing"`.

- [ ] **Step 7: Import and finish integrated layout styles**

Import `./writing.css` after `./styles.css` in `src/main.jsx`. Add only shared selectors to `styles.css`: `.content-library.writing-main { max-width: none; padding: 0; }` and any focus selector needed to include writing controls. Put writing-specific top bar, nested sidebar, phase, button, step, and responsive rules in `writing.css`.

At widths below `56rem`, show the three primary tabs in one horizontal row and the Writing steps in a second horizontally scrollable row. At widths below `45rem`, stack the review grid and writing action rows.

- [ ] **Step 8: Run automated verification and commit the integration**

Run:

```bash
npm test
npm run build
npm run test:sites
```

Expected: all commands exit 0; the build creates `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

```bash
git add src/App.jsx src/components/AppSidebar.jsx src/components/writing/WritingSidebar.jsx src/components/writing/WritingTopbar.jsx src/components/writing/WritingWorkspace.jsx src/main.jsx src/styles.css src/writing.css tests/content.test.mjs tests/writing.test.mjs
git commit -m "feat: integrate Otera writing workflow"
```

---

### Task 6: Browser verification, responsive polish, and visual QA

**Files:**
- Modify: `src/writing.css`
- Modify only if a verified behavior bug requires it: files under `src/components/writing/`, `src/App.jsx`, or `src/components/AppSidebar.jsx`
- Modify: `design-qa.md`
- Create: `qa/writing/brief-desktop.png`
- Create: `qa/writing/outline-desktop.png`
- Create: `qa/writing/draft-desktop.png`
- Create: `qa/writing/review-desktop.png`
- Create: `qa/writing/review-narrow.png`

**Interfaces:**
- Consumes: the integrated writing workflow and the four supplied desktop reference screenshots.
- Produces: a browser-verified, responsive four-screen flow and a `design-qa.md` writing section ending in `final result: passed`.

- [ ] **Step 1: Start the local preview and open it in the Codex in-app Browser**

Run: `npm run dev -- --host 127.0.0.1 --port 4173 --strictPort`

Expected: Vite serves the app at `http://127.0.0.1:4173/` and stays running.

Open that URL in the in-app Browser. Do not use Chrome unless the in-app Browser is unavailable and the user approves the fallback.

- [ ] **Step 2: Verify the preserved views before inspecting Writing**

Check Context loads first, its filters and artifact expansion work, and the Workflow tab still renders all seven registered workflow cards. Check the browser console contains no errors. Record any regression as P0 or P1 and fix it before continuing.

- [ ] **Step 3: Exercise the complete Writing journey**

Open Writing and verify:

1. Required brief validation appears when format, audience, keyword, or target length is empty.
2. Removed audience chips can be restored.
3. Plan outline advances and the edited outline persists after navigating back.
4. Activity and research accordions toggle; Inspect expands all.
5. Export downloads `otera-governed-claims-research.md`.
6. Review editor applies heading, bold, italic, underline, link, quote, list, undo, and redo commands.
7. Pasted rich content enters as plain text.
8. Switching to Context or Workflow and back preserves the article edits.

- [ ] **Step 4: Capture matching desktop states**

At a desktop viewport near each source image's native width, capture the four Writing states to the exact `qa/writing/*.png` paths listed above. Compare each reference and implementation together, judging:

- top bar and 16rem sidebar geometry;
- content width and whitespace;
- heading hierarchy and muted metadata;
- field, card, accordion, toolbar, and coverage anatomy;
- active/completed workflow states;
- Sana token translation for radius, neutral surfaces, borders, and actions.

Do not treat the implementation screenshot alone as QA.

- [ ] **Step 5: Verify responsive behavior and capture the narrow review state**

At approximately 820px width, verify the primary tabs and workflow steps are horizontally usable, the editor toolbar wraps, and Coverage stacks below the editor. At approximately 420px width, verify fields, buttons, activity rows, tables, and editor content do not overflow. Capture the 820px review state as `qa/writing/review-narrow.png`.

- [ ] **Step 6: Record and fix visual findings**

Append a clearly titled `Otera Writing workflow` section to `design-qa.md`; preserve all existing sections. List each finding with priority and evidence. Fix every P0, P1, and P2 issue, recapture the affected state, and repeat the combined comparison until the new section ends with exactly:

```md
final result: passed
```

P3 polish may remain as explicitly labeled follow-up notes.

- [ ] **Step 7: Run final checks and commit verified polish**

Run:

```bash
npm test
npm run build
npm run test:sites
git diff --check
```

Expected: tests, build, Sites check, and whitespace check all exit 0.

Confirm `git status --short` still shows the user's original unstaged `README.md` and `src/components/CollectionHeader.jsx` changes. Stage only writing QA and verified fixes:

```bash
git add src/writing.css src/components/writing src/App.jsx src/components/AppSidebar.jsx design-qa.md qa/writing
git commit -m "fix: polish Otera writing workflow"
```

If no source files changed during QA, omit them from `git add` and commit only `design-qa.md` plus `qa/writing`.

---

### Task 7: Final regression audit and handoff evidence

**Files:**
- No source changes expected.
- Modify only when a final verification command exposes a real defect: the smallest in-scope file and its focused test.

**Interfaces:**
- Consumes: all implementation and QA commits.
- Produces: final command evidence, clean writing-workflow changes, and a running local preview for user inspection.

- [ ] **Step 1: Review the complete diff without including user changes**

Run:

```bash
git log --oneline --decorate -8
git diff e7c3ad6..HEAD -- src tests package.json design-qa.md qa/writing
git status --short
```

Verify the feature commits contain no edits to `README.md`, `src/components/CollectionHeader.jsx`, `src/components/WorkflowView.jsx`, `content/otera/`, worker/hosting files, `vendor/`, or `../UI-library`.

- [ ] **Step 2: Run the full final verification suite**

Run:

```bash
npm test
npm run build
npm run test:sites
git diff --check
```

Expected: every command exits 0 and `design-qa.md` contains `final result: passed` inside the Otera Writing workflow section.

- [ ] **Step 3: Keep the verified preview running and report the handoff**

Leave the local Vite preview running at `http://127.0.0.1:4173/`. Handoff must lead with that clickable URL, summarize the three preserved/added views, mention the frontend-only editor and passing verification, and ask the user to inspect the four Writing states.
