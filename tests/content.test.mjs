import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

import { ARTIFACT_DEFINITIONS } from "../src/data/artifactDefinitions.js";
import { RETELL_ARTIFACT_DEFINITIONS } from "../src/data/retellArtifactDefinitions.js";
import {
  filterArtifacts,
  normalizeSearchText,
  resolveArtifactHref,
} from "../src/data/artifactUtils.js";

const expectedHashes = {
  "company-overview": "86f13bb99c0e018787d2ebdc405addf54604c845c84599e035456142975ef2f2",
  "icp-context": "3bbe35c206d563b0aa39c55ac84a36432f1cc8e895e089acfa5cef96fc41bb06",
  "persona-index": "e6b968c8fbf212630ac8dc0af23842c9e1260edad2d078d3b4576d670030388b",
  "economic-buyer": "34da657c10385dcb4d121a3ab8ed99f136ffdffa9e868277610a795afb90d3fd",
  "executive-champion": "e60f214c2679051c147aa1b0c8ff784df66eca036666dada2b9cefad0c20b303",
  "functional-champion": "34d79b01e5b1542a83c177a8d9d47fb8733a1692f133d3223db7fe31d827c48f",
  "technical-evaluator": "2679c283c129aad7e3710c1151cfd28667c9fd44993608f581828b909bb59fac",
  "risk-approval-gate": "d1274bac78375c546330aafa4b33eab426af9524529dc001efcb0ea2d2feaef4",
  "operational-user": "cbb2a7303850c633ee87ebcd5a57439f26802fe888402c9768f07c9e4c7c0389",
  "transformation-partner": "92b1e67c48820c07e1b78bc0dfc644eeea8c076cac0383fa5c1776e2aa675e4d",
};

test("the manifest contains every exact Otera source artifact once", async () => {
  assert.equal(ARTIFACT_DEFINITIONS.length, 10);
  assert.equal(new Set(ARTIFACT_DEFINITIONS.map((artifact) => artifact.id)).size, 10);

  for (const artifact of ARTIFACT_DEFINITIONS) {
    const fileUrl = new URL(`../${artifact.contentPath}`, import.meta.url);
    const content = await readFile(fileUrl, "utf8");
    const digest = createHash("sha256").update(content).digest("hex");

    assert.ok(content.trim().length > 0, `${artifact.id} must not be empty`);
    assert.equal(digest, expectedHashes[artifact.id], `${artifact.id} must remain an exact source snapshot`);
  }
});

test("the Retell manifest contains four context artifacts and seven evidence-derived dossiers", async () => {
  assert.equal(RETELL_ARTIFACT_DEFINITIONS.length, 12);
  assert.equal(
    new Set(RETELL_ARTIFACT_DEFINITIONS.map((artifact) => artifact.id)).size,
    12,
  );

  const dossiers = RETELL_ARTIFACT_DEFINITIONS.filter(
    (artifact) => artifact.artifactType === "persona_dossier",
  );
  assert.equal(dossiers.length, 7);
  assert.deepEqual(
    dossiers.map((artifact) => artifact.id),
    [
      "retell-executive-sponsor",
      "retell-workflow-owner",
      "retell-technical-owner",
      "retell-agent-builder",
      "retell-conversation-quality-owner",
      "retell-governance-approver",
      "retell-solution-partner-platform-operator",
    ],
  );

  for (const artifact of RETELL_ARTIFACT_DEFINITIONS) {
    const fileUrl = new URL(`../${artifact.contentPath}`, import.meta.url);
    const content = await readFile(fileUrl, "utf8");
    const sourceLines = content.split(/\r?\n/).length - (content.endsWith("\n") ? 1 : 0);

    assert.ok(content.trim().length > 0, `${artifact.id} must not be empty`);
    assert.equal(
      artifact.lineCount,
      sourceLines,
      `${artifact.id} must expose exact source depth`,
    );
  }
});

test("the company catalog keeps Otera and Retell as separate complete contexts", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
  });
  t.after(() => vite.close());
  const { COMPANY_CATALOG } = await vite.ssrLoadModule("/src/data/companyCatalog.js");

  assert.deepEqual(COMPANY_CATALOG.map(({ id }) => id), ["otera", "retell"]);

  const otera = COMPANY_CATALOG.find(({ id }) => id === "otera");
  const retell = COMPANY_CATALOG.find(({ id }) => id === "retell");

  assert.equal(otera.artifacts.length, 10);
  assert.equal(otera.stats.personas, 7);
  assert.equal(otera.stats.researchCutoff, "2026-08-23");
  assert.equal(retell.artifacts.length, 12);
  assert.equal(retell.stats.personas, 7);
  assert.equal(retell.stats.researchCutoff, "2026-09-06");
  assert.match(retell.collectionTitle, /Retell AI/);
  assert.match(retell.evidenceDescription, /Retell AI/);
});

test("search is normalized, case-insensitive, and combines with artifact type", () => {
  const artifacts = [
    {
      id: "company-overview",
      artifactType: "company_context",
      searchText: normalizeSearchText(["Otera", "Allianz", "claims"]),
    },
    {
      id: "functional-champion",
      artifactType: "persona_dossier",
      searchText: normalizeSearchText(["Trade finance", "workflow owner"]),
    },
  ];

  assert.deepEqual(filterArtifacts(artifacts, "ALLIANZ", "all").map(({ id }) => id), [
    "company-overview",
  ]);
  assert.deepEqual(
    filterArtifacts(artifacts, "  trade   finance ", "persona_dossier").map(({ id }) => id),
    ["functional-champion"],
  );
  assert.deepEqual(filterArtifacts(artifacts, "trade finance", "company_context"), []);
  assert.deepEqual(filterArtifacts(artifacts, "no-such-result", "all"), []);
});

test("the Company filter groups company, founder, and market context without swallowing ICP", () => {
  const artifacts = [
    { id: "company", artifactType: "company_context", searchText: "" },
    { id: "founder", artifactType: "founder_context", searchText: "" },
    { id: "market", artifactType: "market_context", searchText: "" },
    { id: "icp", artifactType: "icp_context", searchText: "" },
    { id: "persona", artifactType: "persona_dossier", searchText: "" },
  ];

  assert.deepEqual(
    filterArtifacts(artifacts, "", "company").map(({ id }) => id),
    ["company", "founder", "market"],
  );
  assert.deepEqual(
    filterArtifacts(artifacts, "", "icp_context").map(({ id }) => id),
    ["icp"],
  );
});

test("Markdown links keep sources external and route known local dossiers on-page", () => {
  assert.equal(resolveArtifactHref("https://www.otera.ai/security"), "https://www.otera.ai/security");
  assert.equal(resolveArtifactHref("01-economic-buyer.md"), "#artifact-economic-buyer");
  assert.equal(
    resolveArtifactHref("Otera Personas/05-risk-and-approval-gate.md"),
    "#artifact-risk-approval-gate",
  );
  assert.equal(resolveArtifactHref("../Otera ICP context.md"), "#artifact-icp-context");
  assert.equal(resolveArtifactHref("unknown-local-note.md"), "#evidence");
  assert.equal(
    resolveArtifactHref("05-conversation-quality-owner.md"),
    "#artifact-retell-conversation-quality-owner",
  );
  assert.equal(
    resolveArtifactHref("../content/retell/market-context.md"),
    "#artifact-retell-market-context",
  );
});

test("the collection chrome keeps the user-requested clutter out of the initial page", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
  });
  t.after(() => vite.close());

  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const { CollectionHeader } = await vite.ssrLoadModule(
    "/src/components/CollectionHeader.jsx",
  );
  const { COMPANY_CATALOG } = await vite.ssrLoadModule("/src/data/companyCatalog.js");
  const otera = COMPANY_CATALOG.find(({ id }) => id === "otera");
  const headerMarkup = renderToStaticMarkup(
    React.createElement(CollectionHeader, {
      company: otera,
      filter: "all",
      onFilterChange: () => {},
      stats: { artifacts: 10, lines: 3164, personas: 7, researchCutoff: "2026-08-23" },
      visibleCount: 10,
    }),
  );
  const pageMarkup = renderToStaticMarkup(React.createElement(App));

  assert.doesNotMatch(headerMarkup, /Agentic operations/);
  assert.doesNotMatch(headerMarkup, /type="search"/);
  assert.doesNotMatch(headerMarkup, />Public</);
  assert.doesNotMatch(pageMarkup, /10 local artifacts/);
  assert.doesNotMatch(pageMarkup, /Expand all/);
  assert.doesNotMatch(pageMarkup, /Collapse all/);
});

test("the sidebar exposes only Context and Workflow as accessible view tabs", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
  });
  t.after(() => vite.close());

  const { AppSidebar, getNextViewIndex } = await vite.ssrLoadModule(
    "/src/components/AppSidebar.jsx",
  );
  const { COMPANY_CATALOG } = await vite.ssrLoadModule("/src/data/companyCatalog.js");
  const otera = COMPANY_CATALOG.find(({ id }) => id === "otera");
  const sidebarMarkup = renderToStaticMarkup(
    React.createElement(AppSidebar, {
      activeView: "context",
      company: otera,
      onViewChange: () => {},
    }),
  );
  const navigationMarkup = sidebarMarkup.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? "";

  assert.match(navigationMarkup, /role="tablist"/);
  assert.equal((navigationMarkup.match(/role="tab"/g) ?? []).length, 2);
  assert.equal((navigationMarkup.match(/aria-selected="true"/g) ?? []).length, 1);
  assert.equal((navigationMarkup.match(/tabindex="0"/g) ?? []).length, 1);
  assert.equal(
    (navigationMarkup.match(/aria-controls="content-view-panel"/g) ?? []).length,
    2,
  );
  assert.ok(navigationMarkup.indexOf("Context") < navigationMarkup.indexOf("Workflow"));
  assert.doesNotMatch(navigationMarkup, /<a /);
  assert.doesNotMatch(navigationMarkup, /Company|ICP &amp; market fit|Personas|Evidence notes/);
  assert.doesNotMatch(navigationMarkup, /<svg/);

  assert.equal(getNextViewIndex("ArrowLeft", 0), 1);
  assert.equal(getNextViewIndex("ArrowLeft", 1), 0);
  assert.equal(getNextViewIndex("ArrowUp", 0), 1);
  assert.equal(getNextViewIndex("ArrowUp", 1), 0);
  assert.equal(getNextViewIndex("ArrowRight", 0), 1);
  assert.equal(getNextViewIndex("ArrowRight", 1), 0);
  assert.equal(getNextViewIndex("ArrowDown", 0), 1);
  assert.equal(getNextViewIndex("ArrowDown", 1), 0);
  assert.equal(getNextViewIndex("Home", 0), 0);
  assert.equal(getNextViewIndex("Home", 1), 0);
  assert.equal(getNextViewIndex("End", 0), 1);
  assert.equal(getNextViewIndex("End", 1), 1);
  assert.equal(getNextViewIndex("Escape", 0), null);
  assert.equal(getNextViewIndex("Escape", 1), null);
});

test("the app defaults to Context while exposing the Workflow tab", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
  });
  t.after(() => vite.close());

  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const pageMarkup = renderToStaticMarkup(React.createElement(App));
  const mainMarkup = pageMarkup.match(/<main\b[^>]*id="content-library"[^>]*>/)?.[0] ?? "";
  const viewPanelMarkup =
    pageMarkup.match(/<div\b[^>]*id="content-view-panel"[^>]*>/)?.[0] ?? "";

  assert.doesNotMatch(mainMarkup, /\srole=/);
  assert.match(viewPanelMarkup, /role="tabpanel"/);
  assert.match(viewPanelMarkup, /aria-labelledby="context-tab"/);
  assert.equal(
    (pageMarkup.match(/aria-controls="content-view-panel"/g) ?? []).length,
    2,
  );
  assert.match(pageMarkup, /Otera context artifacts/);
  assert.match(pageMarkup, />Workflow</);
  assert.doesNotMatch(pageMarkup, /Video Storyboarding Briefing/);
  assert.match(pageMarkup, /aria-label="Select company context"/);
  assert.equal((pageMarkup.match(/class="qh-segmented__item/g) ?? []).length >= 6, true);
  assert.match(pageMarkup, />Otera</);
  assert.match(pageMarkup, />Retell AI</);
});

test("Retell metadata drives the sidebar, header, and evidence copy", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
  });
  t.after(() => vite.close());

  const { AppSidebar } = await vite.ssrLoadModule("/src/components/AppSidebar.jsx");
  const { CollectionHeader } = await vite.ssrLoadModule(
    "/src/components/CollectionHeader.jsx",
  );
  const { EvidencePanel } = await vite.ssrLoadModule(
    "/src/components/EvidencePanel.jsx",
  );
  const { COMPANY_CATALOG } = await vite.ssrLoadModule("/src/data/companyCatalog.js");
  const retell = COMPANY_CATALOG.find(({ id }) => id === "retell");

  const sidebarMarkup = renderToStaticMarkup(
    React.createElement(AppSidebar, {
      activeView: "context",
      company: retell,
      onViewChange: () => {},
    }),
  );
  const headerMarkup = renderToStaticMarkup(
    React.createElement(CollectionHeader, {
      company: retell,
      filter: "all",
      onFilterChange: () => {},
      stats: retell.stats,
      visibleCount: retell.artifacts.length,
    }),
  );
  const evidenceMarkup = renderToStaticMarkup(
    React.createElement(EvidencePanel, { company: retell }),
  );

  assert.match(sidebarMarkup, />Retell AI</);
  assert.match(sidebarMarkup, /RA/);
  assert.match(sidebarMarkup, /2026-09-06/);
  assert.match(headerMarkup, /Retell AI context artifacts/);
  assert.match(headerMarkup, /12 shown/);
  assert.match(evidenceMarkup, /Retell AI/);
  assert.doesNotMatch(evidenceMarkup, /Otera/);
});

test("the workflow view uses registered sections and exact screenshot content", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true },
  });
  t.after(() => vite.close());

  const source = await readFile(
    new URL("../src/components/WorkflowView.jsx", import.meta.url),
    "utf8",
  );
  const { WorkflowView } = await vite.ssrLoadModule("/src/components/WorkflowView.jsx");
  const markup = renderToStaticMarkup(React.createElement(WorkflowView));

  assert.match(source, /import \{ IconGridSection \} from "@qianhui\/ui";/);
  assert.equal((markup.match(/<section/g) ?? []).length, 3);
  assert.equal((markup.match(/class="qh-icon-tile"/g) ?? []).length, 7);

  for (const heading of ["BRIEF", "WRITE", "PUBLISH"]) {
    assert.match(markup, new RegExp(`aria-label="${heading}"`));
  }

  for (const title of [
    "Video Storyboarding Briefing",
    "Blog Article Briefing",
    "Learning Solution Plan",
    "Video Storyboard",
    "Long-Form Blog Article",
    "E-Learning Storyboard",
    "Illustration Creation",
  ]) {
    assert.ok(markup.includes(title), `${title} must be rendered`);
  }

  const expectedRenderedOrder = [
    'aria-label="BRIEF"',
    'class="qh-icon-tile__name">Video Storyboarding Briefing<',
    'class="qh-icon-tile__name">Blog Article Briefing<',
    'class="qh-icon-tile__name">Learning Solution Plan<',
    'aria-label="WRITE"',
    'class="qh-icon-tile__name">Video Storyboard<',
    'class="qh-icon-tile__name">Long-Form Blog Article<',
    'class="qh-icon-tile__name">E-Learning Storyboard<',
    'aria-label="PUBLISH"',
    'class="qh-icon-tile__name">Illustration Creation<',
  ];
  let previousPosition = -1;
  for (const renderedItem of expectedRenderedOrder) {
    const position = markup.indexOf(renderedItem);
    assert.ok(position > previousPosition, `${renderedItem} must follow the previous workflow item`);
    previousPosition = position;
  }

  for (const description of [
    "Define the objective, audience, and creative direction.",
    "Define goals, audience, key messages, and visual style for your video storyboard.",
    "Define topic, angle, audience, keywords, and success metrics for your blog article.",
    "Define learning objectives, audience, content structure, and success metrics.",
    "Turn briefs into structured content and narratives.",
    "Transform your brief into a visual storyboard with scene-by-scene breakdown.",
    "Craft comprehensive, SEO-optimized long-form blog articles.",
    "Design e-learning flows and storyboards for engaging learning experiences.",
    "Finalize and publish content across channels.",
    "Create custom illustrations and social graphics for LinkedIn, Xiaohongshu, and other platforms.",
  ]) {
    assert.ok(markup.includes(description), `${description} must be rendered`);
  }
});

test("Long-Form Blog Article is the workflow's semantic writing entry", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true },
  });
  t.after(() => vite.close());

  const { WorkflowView } = await vite.ssrLoadModule("/src/components/WorkflowView.jsx");
  const markup = renderToStaticMarkup(
    React.createElement(WorkflowView, { onOpenLongForm: () => {} }),
  );

  assert.equal(
    (markup.match(/aria-label="Open Long-Form Blog Article"/g) ?? []).length,
    1,
  );
  assert.match(markup, /<button[^>]*aria-label="Open Long-Form Blog Article"/);
});

test("the writing workspace initializes from the selected company", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true },
  });
  t.after(() => vite.close());

  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const markup = renderToStaticMarkup(
    React.createElement(App, { initialCompanyId: "retell", initialView: "writing" }),
  );

  assert.match(
    markup,
    /Production voice-agent operations for high-volume customer workflows/,
  );
  assert.match(markup, /Unsaved draft/);
  assert.match(markup, /STATUS: Brief/);
  assert.doesNotMatch(markup, /OT-18/);
});

test("opening the writer resets inherited page scroll", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true },
  });
  t.after(() => vite.close());

  const { resetWritingEntryScroll } = await vite.ssrLoadModule("/src/App.jsx");
  const scrollCalls = [];
  const viewport = {
    scrollTo: (options) => scrollCalls.push(options),
  };

  assert.equal(resetWritingEntryScroll(viewport), true);
  assert.deepEqual(scrollCalls, [{ behavior: "instant", left: 0, top: 0 }]);
  assert.equal(resetWritingEntryScroll({}), false);
});

test("the narrow writing navigator contains its horizontal scroll", async () => {
  const stylesheet = await readFile(
    new URL("../src/writing.css", import.meta.url),
    "utf8",
  );

  assert.match(
    stylesheet,
    /@media \(max-width: 56rem\)[\s\S]*?\.writing-sidebar \{[^}]*contain: layout paint;[^}]*overflow-x: auto;/,
  );
});
