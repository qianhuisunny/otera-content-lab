import test from "node:test";
import assert from "node:assert/strict";
import { createLiveWritingSession, writingReducer } from "../src/data/writingSession.js";
import { generateWriting, liveWritingScenario } from "../src/data/writingGeneration.js";
import { markdownToEditorHtml } from "../src/data/markdownToEditorHtml.js";
import { getWritingScenario } from "../src/data/writingScenario.js";

const result = (stage = "outline") => ({ stage, companyId: "retell", markdown: "# Generated content\n\n## A real section", model: "test-model", sources: [{ id: "retell.company_context", title: "Company Overview", cutoff: "2026-09-06" }], durationMs: 1000, generatedAt: "2026-09-06T00:00:00Z" });
const start = (state, stage = "outline", id = "req-1") => writingReducer(state, { type: "generation-start", id, stage, companyId: state.companyId });
const finish = (state, stage = "outline", id = "req-1") => writingReducer(state, { type: "generation-success", id, companyId: "retell", result: result(stage), articleHtml: "<h1>Generated content</h1>" });

test("the live writer starts with a brief, not a pre-generated example article", () => {
  const session = createLiveWritingSession("retell");
  assert.equal(session.outline, "");
  assert.equal(session.articleHtml, "");
  assert.equal(session.furthestStepIndex, 0);
  assert.ok(session.brief.keyword);
  const switched = writingReducer(session, { type: "open-company", companyId: "otera" });
  assert.equal(switched.articleHtml, "");
  assert.equal(switched.live, true);
});

test("successful outline and draft replace examples and unlock only the next real step", () => {
  let session = start(createLiveWritingSession("retell"));
  assert.equal(session.currentStep, "brief");
  assert.equal(session.generation.status, "generating");
  session = finish(session);
  assert.equal(session.outline, result().markdown);
  assert.equal(session.currentStep, "outline");
  assert.equal(session.furthestStepIndex, 1);
  session = finish(start(session, "draft", "req-2"), "draft", "req-2");
  assert.equal(session.articleHtml, "<h1>Generated content</h1>");
  assert.equal(session.currentStep, "draft");
  assert.equal(session.furthestStepIndex, 2);
  assert.equal(session.draftResult.model, "test-model");
});

test("failure and cancellation retain edits, do not advance, and ignore late results", () => {
  let session = { ...createLiveWritingSession("retell"), outline: "My edited outline", currentStep: "outline", furthestStepIndex: 1 };
  session = start(session, "draft");
  assert.equal(writingReducer(session, { type: "go-to-step", step: "brief" }), session);
  session = writingReducer(session, { type: "generation-failure", id: "req-1", companyId: "retell", message: "Check the server key." });
  assert.equal(session.outline, "My edited outline");
  assert.equal(session.currentStep, "outline");
  assert.equal(session.generation.status, "error");
  assert.equal(finish(session, "draft"), session);
  session = start(session, "draft", "req-2");
  session = writingReducer(session, { type: "generation-cancel", id: "req-2", companyId: "retell" });
  assert.equal(session.generation, null);
  assert.equal(finish(session, "draft", "req-2"), session);
});

test("new requests and company switches cannot be overwritten by an old response", () => {
  let session = start(createLiveWritingSession("retell"));
  assert.equal(finish(session, "outline", "wrong-id"), session);
  session = writingReducer(session, { type: "open-company", companyId: "otera" });
  assert.equal(finish(session), session);
});

test("editing the brief or outline makes downstream results inaccessible until regenerated", () => {
  let session = finish(start(createLiveWritingSession("retell")));
  session = finish(start(session, "draft", "req-2"), "draft", "req-2");
  session = writingReducer(session, { type: "set-outline", value: "Revised structure" });
  assert.equal(session.furthestStepIndex, 1);
  assert.equal(session.draftResult, null);
  session = writingReducer(session, { type: "set-brief-field", field: "keyword", value: "New topic" });
  assert.equal(session.furthestStepIndex, 0);
});

test("client sends only the current brief and approved outline, validates response identity", async () => {
  const session = createLiveWritingSession("retell");
  const controller = new AbortController();
  const generated = await generateWriting(session, "draft", { signal: controller.signal, fetchImpl: async (url, options) => {
    assert.equal(url, "/api/writing/generate");
    assert.equal(options.signal, controller.signal);
    const body = JSON.parse(options.body);
    assert.deepEqual(Object.keys(body).sort(), ["brief", "companyId", "outline", "stage"]);
    return Response.json(result("draft"));
  } });
  assert.equal(generated.markdown, result().markdown);
  await assert.rejects(() => generateWriting(session, "draft", { fetchImpl: async () => Response.json(result("outline")) }), /invalid/i);
});

test("client distinguishes unavailable previews, configured server errors, and network failures", async () => {
  const session = createLiveWritingSession("retell");
  await assert.rejects(() => generateWriting(session, "outline", { fetchImpl: async () => new Response("<!doctype html>", { headers: { "content-type": "text/html" } }) }), /backend.*preview/i);
  await assert.rejects(() => generateWriting(session, "outline", { fetchImpl: async () => Response.json({ error: { code: "NOT_CONFIGURED", message: "Add OPENAI_API_KEY in Vercel." } }, { status: 503 }) }), /OPENAI_API_KEY/);
  await assert.rejects(() => generateWriting(session, "outline", { fetchImpl: async () => { throw new TypeError("network down"); } }), /connection/i);
});

test("model Markdown becomes safe editor HTML, never executable HTML or remote images", () => {
  const html = markdownToEditorHtml('# Article\n\n## Section\n\n[Source](https://example.com)\n\n<script>alert(1)</script>\n\n[bad](javascript:alert(1))\n\n![tracking](https://evil.example/pixel)\n\n<img src=x onerror=alert(1)>');
  assert.match(html, /<h1>Article<\/h1>/);
  assert.match(html, /href="https:\/\/example.com"/);
  assert.doesNotMatch(html, /<script|<img|javascript:|onerror=/);
});

test("HTML-only or image-only provider output cannot replace a draft with an empty editor", () => {
  for (const markdown of ["<article><h1>Generated title</h1><p>Generated article</p></article>", "![only image](https://example.com/image.png)", "---", "   "]) {
    assert.throws(() => markdownToEditorHtml(markdown), /editable text/i);
  }
});

test("live activity and metadata reflect generation, not fixture timings or fake research", () => {
  const fixture = getWritingScenario("retell");
  const empty = liveWritingScenario(fixture, createLiveWritingSession("retell"));
  assert.equal(empty.articleId, "Unsaved draft");
  assert.equal(empty.status, "Brief");
  assert.ok(empty.coverageItems.every((item) => !item.covered));
  const session = { ...createLiveWritingSession("retell"), draftResult: result("draft"), articleHtml: "<h1>New</h1><p>Real words here.</p>", currentStep: "draft" };
  const live = liveWritingScenario(fixture, session);
  assert.match(live.draftMeta, /test-model/);
  assert.match(live.researchMarkdown, /Company Overview/);
  assert.match(live.researchSummary, /No live web research/);
  assert.equal(live.activityItems.length, 2);
  assert.doesNotMatch(live.draftMeta, /25m|2,940|8 sources/);
});
