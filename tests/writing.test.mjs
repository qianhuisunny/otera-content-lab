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

test("draft accordions keep controlled panels mounted when closed", async (t) => {
  await withVite(t, async (vite) => {
    const { DraftStep } = await vite.ssrLoadModule("/src/components/writing/DraftStep.jsx");
    const markup = renderToStaticMarkup(React.createElement(DraftStep, { onAdvance: () => {} }));

    for (const id of ["questions", "research", "writing"]) {
      const panel = markup.match(new RegExp(`<div[^>]*id="activity-details-${id}"[^>]*>`))?.[0] ?? "";
      assert.ok(panel.includes('hidden=""'), `activity-details-${id} must stay mounted and hidden`);
    }

    assert.match(markup, /id="activity-details-post"/);
    assert.match(markup, /id="research-details"/);
  });
});

test("research export cleans the temporary link after a click failure", async (t) => {
  await withVite(t, async (vite) => {
    const { downloadResearchMarkdown } = await vite.ssrLoadModule("/src/components/writing/DraftStep.jsx");
    const originalDocument = globalThis.document;
    const originalURL = globalThis.URL;
    let exportedBlob;
    let revokedUrl;
    let appendedLink;
    let removalCount = 0;
    const link = {
      click() {
        throw new Error("download blocked");
      },
      remove() {
        removalCount += 1;
      },
    };

    globalThis.document = {
      body: { append: (value) => { appendedLink = value; } },
      createElement: (tagName) => {
        assert.equal(tagName, "a");
        return link;
      },
    };
    globalThis.URL = {
      createObjectURL: (blob) => {
        exportedBlob = blob;
        return "blob:otera-research";
      },
      revokeObjectURL: (value) => { revokedUrl = value; },
    };
    t.after(() => {
      globalThis.document = originalDocument;
      globalThis.URL = originalURL;
    });

    assert.throws(() => downloadResearchMarkdown(), /download blocked/);
    assert.equal(appendedLink, link);
    assert.equal(link.download, "otera-governed-claims-research.md");
    assert.equal(link.href, "blob:otera-research");
    assert.equal(removalCount, 1);
    assert.equal(revokedUrl, "blob:otera-research");
    assert.match(await exportedBlob.text(), /^# Governed claims automation research/m);
  });
});

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

test("editor value synchronization preserves matching DOM and applies external changes", async (t) => {
  await withVite(t, async (vite) => {
    const { synchronizeEditorValue } = await vite.ssrLoadModule("/src/components/writing/RichTextEditor.jsx");
    let innerHtml = "<p>Edited locally</p>";
    let writes = 0;
    const editor = {
      get innerHTML() {
        return innerHtml;
      },
      set innerHTML(value) {
        writes += 1;
        innerHtml = value;
      },
    };

    synchronizeEditorValue(editor, "<p>Edited locally</p>");
    assert.equal(writes, 0);
    assert.equal(innerHtml, "<p>Edited locally</p>");

    synchronizeEditorValue(editor, "<p>Replaced externally</p>");
    assert.equal(writes, 1);
    assert.equal(innerHtml, "<p>Replaced externally</p>");
  });
});

test("Writing workspace wires all four screens to the approved session", async (t) => {
  await withVite(t, async (vite) => {
    const { WritingWorkspace } = await vite.ssrLoadModule(
      "/src/components/writing/WritingWorkspace.jsx",
    );
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
    const { WritingSidebar } = await vite.ssrLoadModule(
      "/src/components/writing/WritingSidebar.jsx",
    );
    const markup = renderToStaticMarkup(
      React.createElement(WritingSidebar, {
        session: { ...createWritingSession(), currentStep: "outline", furthestStepIndex: 1 },
        onStepChange: () => {},
      }),
    );
    assert.match(markup, /aria-current="step"/);
    assert.match(markup, /Pick angle &amp; format/);
    assert.match(markup, /Review &amp; edit/);
    assert.match(markup, /data-state="completed"/);
    assert.match(markup, /data-state="active"/);
    assert.match(markup, /data-state="locked"/);
    assert.match(markup, /data-state="disabled"/);
    assert.match(markup, /disabled=""/);
  });
});

test("Writing topbar exposes the approved scenario and delegates Exit", async (t) => {
  await withVite(t, async (vite) => {
    const { WritingTopbar } = await vite.ssrLoadModule(
      "/src/components/writing/WritingTopbar.jsx",
    );
    let exitCalls = 0;
    const topbar = WritingTopbar({ onExit: () => { exitCalls += 1; } });
    const exitControl = React.Children.toArray(topbar.props.children).find(
      (child) => child.props?.onClick,
    );
    assert.ok(exitControl, "Exit must be an interactive control");
    exitControl.props.onClick();
    assert.equal(exitCalls, 1);

    const markup = renderToStaticMarkup(topbar);
    for (const text of [
      "Exit",
      "CREATING PAGE FOR",
      WRITING_SCENARIO.title,
      WRITING_SCENARIO.articleId,
      `STATUS: ${WRITING_SCENARIO.status}`,
    ]) {
      assert.ok(markup.includes(text), `${text} must be rendered in the Writing topbar`);
    }
  });
});
