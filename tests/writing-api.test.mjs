import test from "node:test";
import assert from "node:assert/strict";
import { handleApiRequest, createLimiter } from "../server/writing-api.js";
import { loadCompanyContext } from "../server/company-context.js";
import { getWritingScenario } from "../src/data/writingScenario.js";

const payload = (overrides = {}) => ({
  companyId: "retell", stage: "outline", brief: getWritingScenario("retell").brief, ...overrides,
});
const request = (body = payload(), options = {}) => new Request("https://lab.example/api/writing/generate", {
  method: "POST", headers: { "content-type": "application/json", origin: "https://lab.example" },
  body: JSON.stringify(body), ...options,
});
const completion = (text = "# A real outline\n\n## Testing and recovery") => Response.json({
  id: "resp_test", status: "completed", output: [
    { type: "reasoning", summary: [] },
    { type: "message", role: "assistant", content: [{ type: "output_text", text }] },
  ],
});
const options = (overrides = {}) => ({
  env: { OPENAI_API_KEY: "server-only-test-key", OPENAI_MODEL: "configurable-model" },
  fetchImpl: async () => completion(), limiter: createLimiter(), ...overrides,
});

test("health distinguishes a deployed backend from a configured provider without leaking secrets", async () => {
  for (const configured of [false, true]) {
    const response = await handleApiRequest(new Request("https://lab.example/api/health"), options({
      env: configured ? { OPENAI_API_KEY: "never-return-this" } : {},
    }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.equal(body.configured, configured);
    assert.equal(body.provider, "openai");
    assert.deepEqual(body.features.salesEnablement, {
      configured,
      model: "gpt-5.6-sol",
    });
    assert.ok(!JSON.stringify(body).includes("never-return-this"));
  }
});

test("outline calls Responses with server-owned configuration and the selected company context", async () => {
  let called = 0;
  const response = await handleApiRequest(request(payload({ model: "ignored", apiKey: "ignored" })), options({
    fetchImpl: async (url, init) => {
      called++;
      assert.equal(url, "https://api.openai.com/v1/responses");
      assert.equal(init.headers.Authorization, "Bearer server-only-test-key");
      const body = JSON.parse(init.body);
      assert.equal(body.model, "configurable-model");
      assert.equal(body.store, false);
      assert.equal(body.max_output_tokens, 4000);
      assert.match(body.input, /Retell/i);
      assert.match(body.input, /production AI voice agents/);
      assert.match(body.instructions, /untrusted/i);
      assert.match(body.instructions, /no live web research/i);
      assert.ok(init.signal);
      return completion();
    },
  }));
  assert.equal(called, 1);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.markdown, "# A real outline\n\n## Testing and recovery");
  assert.equal(body.stage, "outline");
  assert.equal(body.companyId, "retell");
  assert.ok(body.sources.length >= 3);
  assert.ok(body.sources.every((source) => source.id.startsWith("retell.")));
});

test("draft includes the edited outline and gives the model a bounded article budget", async () => {
  const response = await handleApiRequest(request(payload({ stage: "draft", outline: "## My edited outline" })), options({
    fetchImpl: async (_, init) => {
      const body = JSON.parse(init.body);
      assert.match(body.input, /My edited outline/);
      assert.equal(body.max_output_tokens, 12000);
      assert.match(body.instructions, /article/i);
      return completion("# Generated article\n\nThis is new content.");
    },
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).stage, "draft");
});

test("invalid requests are rejected before provider calls", async () => {
  const cases = [null, [], payload({ companyId: "../secrets" }), payload({ stage: "publish" }),
    payload({ brief: {} }), payload({ brief: { ...payload().brief, audiences: "not-an-array" } }),
    payload({ brief: { ...payload().brief, keyword: " " } }), payload({ stage: "draft", outline: " " }),
    payload({ brief: { ...payload().brief, directions: "a".repeat(6001) } })];
  for (const body of cases) {
    const response = await handleApiRequest(request(body), options({
      fetchImpl: () => assert.fail("Invalid input must not reach OpenAI"),
    }));
    assert.equal(response.status, 400, JSON.stringify(body).slice(0, 120));
  }
  assert.equal((await handleApiRequest(request(null, { body: "not json" }), options())).status, 400);
  assert.equal((await handleApiRequest(request(null, { body: "a".repeat(90000) }), options())).status, 413);
});

test("methods, cross-origin calls, media types and unknown API routes fail explicitly", async () => {
  assert.equal((await handleApiRequest(request(null, { method: "GET", body: undefined }), options())).status, 405);
  assert.equal((await handleApiRequest(request(null, { headers: { "content-type": "text/plain" } }), options())).status, 415);
  assert.equal((await handleApiRequest(request(payload(), { headers: { "content-type": "application/json", origin: "https://unrelated.example" } }), options())).status, 403);
  const missing = await handleApiRequest(new Request("https://lab.example/api/unknown"), options());
  assert.equal(missing.status, 404);
  assert.match(missing.headers.get("content-type"), /json/);
});

test("unconfigured provider fails safely, never returns example output", async () => {
  const response = await handleApiRequest(request(), options({ env: {} }));
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.error.code, "NOT_CONFIGURED");
  assert.equal(body.markdown, undefined);
});

test("provider errors are actionable but do not expose provider bodies or credentials", async () => {
  for (const [providerStatus, expectedStatus, code] of [[401, 502, "PROVIDER_AUTH"], [429, 429, "PROVIDER_LIMIT"], [500, 502, "PROVIDER_ERROR"]]) {
    const response = await handleApiRequest(request(), options({
      fetchImpl: async () => Response.json({ error: { message: "secret-provider-details" } }, { status: providerStatus }),
    }));
    assert.equal(response.status, expectedStatus);
    const text = await response.text();
    assert.match(text, new RegExp(code));
    assert.doesNotMatch(text, /secret-provider-details|server-only-test-key/);
  }
});

test("refused, incomplete, empty and malformed completions never become successful drafts", async () => {
  for (const body of [
    { status: "incomplete", output: [{ type: "message", content: [{ type: "output_text", text: "Partial article" }] }] },
    { status: "completed", output: [{ type: "message", content: [{ type: "refusal", refusal: "Cannot comply" }] }] },
    { status: "completed", output: [] }, null,
  ]) {
    const response = await handleApiRequest(request(), options({ fetchImpl: async () => Response.json(body) }));
    assert.equal(response.status, 502);
    assert.equal((await response.json()).markdown, undefined);
  }
});

test("provider timeout is bounded and reported without retries that could duplicate spend", async (t) => {
  let calls = 0;
  const deadline = new AbortController();
  t.mock.method(AbortSignal, "timeout", () => deadline.signal);
  const response = await handleApiRequest(request(), options({ fetchImpl: async (_, { signal }) => {
    calls++;
    deadline.abort(new DOMException("Deadline reached", "TimeoutError"));
    signal.throwIfAborted();
  } }));
  assert.equal(response.status, 504);
  assert.equal(calls, 1);
});

test("client cancellation reaches the provider", async () => {
  const controller = new AbortController();
  const result = handleApiRequest(request(payload(), { signal: controller.signal }), options({
    fetchImpl: async (_, { signal }) => {
      controller.abort();
      signal.throwIfAborted();
    },
  }));
  assert.equal((await result).status, 499);
});

test("a stalled incoming body is cancelled at the request deadline", async () => {
  let cancelled = false;
  const body = new ReadableStream({ cancel() { cancelled = true; } });
  const keepAlive = setTimeout(() => {}, 500);
  try {
    const response = await handleApiRequest(request(null, { body, duplex: "half" }), options({ timeoutMs: 5 }));
    assert.equal(response.status, 504);
    assert.equal(cancelled, true);
  } finally { clearTimeout(keepAlive); }
});

test("instance-local limit returns Retry-After and expires", async () => {
  let now = 0;
  const limiter = createLimiter({ limit: 1, windowMs: 1000, now: () => now });
  const config = options({ limiter });
  assert.equal((await handleApiRequest(request(), config)).status, 200);
  const limited = await handleApiRequest(request(), config);
  assert.equal(limited.status, 429);
  assert.ok(limited.headers.get("retry-after"));
  now = 1001;
  assert.equal((await handleApiRequest(request(), config)).status, 200);
});

test("context is allowlisted, company-isolated, bounded and uses complete documents", async () => {
  for (const id of ["otera", "retell"]) {
    const context = await loadCompanyContext(id, getWritingScenario(id).brief.audiences);
    assert.ok(context.text.length <= 180000);
    assert.ok(context.sources.length >= 3);
    assert.ok(context.sources.every((source) => source.id.startsWith(`${id}.`)));
    assert.ok(context.sources.every((source) => source.cutoff));
    assert.match(context.text, /Company/);
  }
  await assert.rejects(() => loadCompanyContext("../../.env", []));
});
