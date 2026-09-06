import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { after, before } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

import { createWritingSession, validateBrief } from "../src/data/writingSession.js";

const viteCacheDir = await mkdtemp(join(tmpdir(), "otera-writing-cleanup-vite-"));
let vite;

before(async () => {
  vite = await createServer({
    appType: "custom",
    cacheDir: viteCacheDir,
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true },
  });
});
after(async () => {
  await vite?.close();
  await rm(viteCacheDir, { force: true, recursive: true });
});

test("Brief clears only the corrected field after its value becomes valid", async () => {
  const { clearResolvedBriefError } = await vite.ssrLoadModule(
    "/src/components/writing/BriefStep.jsx",
  );
  const emptyBrief = {
    ...createWritingSession().brief,
    audiences: [],
    format: "",
    keyword: "",
    targetLength: "",
  };
  const errors = validateBrief(emptyBrief);
  const cases = [
    ["format", "", "Explainer"],
    ["audiences", [], ["Operations Leader"]],
    ["keyword", "   ", "claims automation"],
    ["targetLength", "   ", "2,500 words"],
  ];

  for (const [field, invalidValue, validValue] of cases) {
    const stillInvalid = clearResolvedBriefError(errors, field, {
      ...emptyBrief,
      [field]: invalidValue,
    });
    assert.equal(stillInvalid, errors, `${field} must retain its error while invalid`);

    const corrected = clearResolvedBriefError(errors, field, {
      ...emptyBrief,
      [field]: validValue,
    });
    assert.equal(corrected[field], undefined, `${field} must clear after correction`);
    assert.deepEqual(
      Object.keys(corrected),
      Object.keys(errors).filter((errorField) => errorField !== field),
      `${field} correction must leave other errors intact`,
    );
  }
});

test("Brief names the empty audience state and keeps Add audience available", async () => {
  const { BriefStep } = await vite.ssrLoadModule(
    "/src/components/writing/BriefStep.jsx",
  );
  const session = createWritingSession();
  const markup = renderToStaticMarkup(
    React.createElement(BriefStep, {
      brief: { ...session.brief, audiences: [] },
      dispatch: () => {},
      onAdvance: () => {},
    }),
  );

  assert.match(markup, /No audiences selected/);
  assert.match(markup, />Add audience /);
});

test("Outline clears its validation error only after a nonblank edit", async () => {
  const { clearResolvedOutlineError } = await vite.ssrLoadModule(
    "/src/components/writing/OutlineStep.jsx",
  );
  const error = "Add at least one outline section.";

  assert.equal(clearResolvedOutlineError(error, " \n\t "), error);
  assert.equal(clearResolvedOutlineError(error, "h2: Introduction"), "");
  assert.equal(clearResolvedOutlineError("", "h2: Introduction"), "");
});

test("the empty editor exposes one visible and accessible placeholder hint", async () => {
  const { RichTextEditor } = await vite.ssrLoadModule(
    "/src/components/writing/RichTextEditor.jsx",
  );
  const markup = renderToStaticMarkup(
    React.createElement(RichTextEditor, { onChange: () => {}, value: "" }),
  );
  const surface = markup.match(/<div[^>]*class="editor-surface"[^>]*>/)?.[0] ?? "";

  assert.match(surface, /data-placeholder="Start writing your article…"/);
  assert.match(surface, /aria-placeholder="Start writing your article…"/);
});

test("Draft review action renders its static label as ordinary escaped text", async () => {
  const { DraftStep } = await vite.ssrLoadModule(
    "/src/components/writing/DraftStep.jsx",
  );
  const markup = renderToStaticMarkup(
    React.createElement(DraftStep, { onAdvance: () => {} }),
  );

  assert.match(markup, /<span>Review &amp; edit<\/span>/);
  assert.doesNotMatch(markup, /<span>Review & edit<\/span>/);
});
