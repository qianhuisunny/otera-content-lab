import assert from "node:assert/strict";
import test from "node:test";
import { handleSalesEnablementApiRequest } from "../server/sales-enablement-api.js";
import { RETELL_SALES_ENABLEMENT_INPUT } from "../src/data/salesEnablementScenario.js";
import { RETELL_SALES_ENABLEMENT_EXAMPLE_RUN } from "../src/data/salesEnablementExample.js";
import { retrieveSalesEnablementRun } from "../src/data/salesEnablementClient.js";

const createRequest = (body = RETELL_SALES_ENABLEMENT_INPUT, options = {}) =>
  new Request("https://lab.example/api/sales-enablement/runs", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://lab.example" },
    body: JSON.stringify(body),
    ...options,
  });
const gate = () => ({ acquire: () => () => {} });
const workflow = {
  id: "sales-enablement", companyId: "retell",
  stages: ["scope", "research", "narrative", "asset", "review"].map((id) => ({ id })),
  workstreams: ["company_positioning", "product_technical", "executive_buyer",
    "technical_buyer", "market_alternatives", "proof_claims", "skeptical_review"]
    .map((id) => ({ id })),
};
const publicRun = (id, status = "queued") => ({
  id, workflowId: "sales-enablement", companyId: "retell", status,
  stageId: status === "queued" ? "scope" : "research",
  stages: workflow.stages.map(({ id }, index) =>
    ({ id, status: index === 0 ? "active" : "pending" })),
  createdAt: "2026-09-06T00:00:00.000Z",
  updatedAt: "2026-09-06T00:00:00.000Z",
  workstreams: workflow.workstreams.map(({ id }) =>
    ({ id, status: "queued", evidenceCount: 0, summary: "" })),
  artifact: null, error: null,
});

const spawnItems = (id) => [{
  type: "multi_agent_call", id: "mac_" + id, call_id: "call_" + id,
  action: "spawn_agent", arguments: JSON.stringify({ task_name: id, fork_turns: "none", message: "PRIVATE_PACKET" }),
  agent: { agent_name: "/root" },
}, {
  type: "multi_agent_call_output", id: "maco_" + id, call_id: "call_" + id,
  action: "spawn_agent", agent: { agent_name: "/root" },
  output: [{ type: "output_text", text: JSON.stringify({ task_name: "/root/" + id }), annotations: [], logprobs: [] }],
}];

test("raw provider execution evidence survives API normalization and client validation truthfully", async (t) => {
  const cases = [
    ["root artifact only", () => [], "failed", "queued"],
    ["missing call outputs", (id) => spawnItems(id).slice(0, 1), "failed", "queued"],
    ["pending call outputs", (id) => {
      const items = spawnItems(id); items[1].status = "in_progress"; return items;
    }, "failed", "queued"],
    ["failed spawn outputs", (id) => {
      const items = spawnItems(id); items[1].status = "failed"; return items;
    }, "failed", "queued"],
    ["spawn output error", (id) => {
      const items = spawnItems(id);
      items[1].output[0].text = JSON.stringify({ error: "PRIVATE_SPAWN_ERROR" });
      return items;
    }, "failed", "queued"],
    ["mismatched call IDs", (id) => {
      const items = spawnItems(id); items[1].call_id += "_other"; return items;
    }, "failed", "queued"],
    ["mismatched child path", (id) => {
      const items = spawnItems(id);
      items[1].output[0].text = JSON.stringify({ task_name: "/root/other/" + id });
      return items;
    }, "failed", "queued"],
    ["root message to child is not child activity", (id) => [{
      type: "agent_message", id: "amsg_" + id, author: "/root", recipient: "/root/" + id,
      agent: { agent_name: "/root/" + id }, content: [{ type: "encrypted_content", encrypted_content: "PRIVATE_MESSAGE" }],
    }], "failed", "queued"],
    ["successful spawn results do not certify lane completion", spawnItems, "completed", "running"],
    ["child-authored encrypted activity", (id) => [{
      type: "agent_message", id: "amsg_" + id, author: "/root/" + id, recipient: "/root",
      agent: { agent_name: "/root" }, content: [{ type: "encrypted_content", encrypted_content: "PRIVATE_MESSAGE" }],
    }], "completed", "running"],
    ["actual completed children", (id) => [{
      type: "message", phase: "final_answer", status: "completed", agent: { agent_name: "/root/" + id },
      content: [{ type: "output_text", text: "PRIVATE_RESEARCH" }],
    }], "completed", "complete"],
    ["actual failed children retain gaps", (id) => [{
      type: "message", phase: "final_answer", status: "incomplete", agent: { agent_name: "/root/" + id },
      content: [{ type: "output_text", text: "PRIVATE_FAILED_RESEARCH" }],
    }], "completed", "failed"],
  ];
  for (const [name, childItems, status, laneStatus] of cases) await t.test(name, async () => {
    const raw = {
      id: "resp_evidence123", status: "completed", created_at: 1788652800,
      output: [...workflow.workstreams.flatMap(({ id }) => childItems(id)), {
        type: "message", phase: "final_answer", status: "completed", role: "assistant",
        agent: { agent_name: "/root" }, content: [{ type: "output_text",
          text: JSON.stringify(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN.artifact) }],
      }],
    };
    const run = await retrieveSalesEnablementRun(raw.id, {
      fetchImpl: (path) => handleSalesEnablementApiRequest(new Request("https://lab.example" + path), {
        env: { OPENAI_API_KEY: "PRIVATE_KEY" }, createGate: gate(), statusGate: gate(),
        readWorkflow: async () => workflow,
        fetchImpl: async () => Response.json(raw),
      }),
    });
    assert.equal(run.status, status);
    assert.ok(run.workstreams.every((lane) => lane.status === laneStatus));
    if (status === "failed") {
      assert.equal(run.error.code, "MULTI_AGENT_INCOMPLETE");
      assert.equal(run.artifact, null);
    } else {
      assert.equal(run.artifact.slides.length, 11);
      assert.deepEqual(run.artifact.review.blockingGaps, RETELL_SALES_ENABLEMENT_EXAMPLE_RUN.artifact.review.blockingGaps);
    }
    assert.doesNotMatch(JSON.stringify(run), /PRIVATE_|call_id|multi_agent_call|agent_message|agent_name/);
  });
});

test("create starts one provider run and returns only the normalized public run", async () => {
  let calls = 0;
  const response = await handleSalesEnablementApiRequest(createRequest(), {
    env: { OPENAI_API_KEY: "secret", OPENAI_SALES_ENABLEMENT_MODEL: "gpt-5.6-sol" },
    createGate: gate(), statusGate: gate(),
    loadBundle: async () => ({ workflow }),
    createProvider: async () => {
      calls += 1;
      return { id: "resp_create123", status: "queued", created_at: 1788652800, output: [] };
    },
    normalizeProvider: (provider) => publicRun(provider.id),
  });
  assert.equal(response.status, 202);
  assert.equal(calls, 1);
  const text = await response.text();
  assert.match(text, /resp_create123/);
  assert.doesNotMatch(text, /secret|instructions|lanePackets|provider/);
});

test("retrieve accepts a bounded Response ID and returns normalized status", async () => {
  const response = await handleSalesEnablementApiRequest(
    new Request("https://lab.example/api/sales-enablement/runs/resp_status123"),
    {
      env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate(),
      readWorkflow: async () => workflow,
      retrieveProvider: async ({ responseId }) =>
        ({ id: responseId, status: "in_progress", created_at: 1788652800, output: [] }),
      normalizeProvider: (provider) => publicRun(provider.id, "in_progress"),
    },
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).id, "resp_status123");
  const bad = await handleSalesEnablementApiRequest(
    new Request("https://lab.example/api/sales-enablement/runs/not-a-response"),
    { env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate() },
  );
  assert.equal(bad.status, 404);
});

test("create rejects hostile, malformed, oversized, unconfigured, and limited requests", async () => {
  const cases = [
    [createRequest(undefined, {
      headers: { "content-type": "application/json", origin: "https://evil.example" },
    }), 403, "ORIGIN_NOT_ALLOWED"],
    [createRequest(undefined, {
      headers: { "content-type": "text/plain", origin: "https://lab.example" },
    }), 415, "UNSUPPORTED_MEDIA_TYPE"],
    [createRequest({
      ...RETELL_SALES_ENABLEMENT_INPUT, buyerProblem: "x".repeat(4001),
    }), 400, "INVALID_INPUT"],
  ];
  for (const [request, status, code] of cases) {
    const response = await handleSalesEnablementApiRequest(request, {
      env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate(),
    });
    assert.equal(response.status, status);
    assert.equal((await response.json()).error.code, code);
  }

  const unconfigured = await handleSalesEnablementApiRequest(createRequest(), {
    env: {}, createGate: gate(), statusGate: gate(),
  });
  assert.equal(unconfigured.status, 503);
  assert.equal((await unconfigured.json()).error.code, "NOT_CONFIGURED");

  const limited = await handleSalesEnablementApiRequest(createRequest(), {
    env: { OPENAI_API_KEY: "secret" },
    createGate: { acquire: () => null }, statusGate: gate(),
  });
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).error.code, "RATE_LIMITED");
  assert.equal(limited.headers.get("retry-after"), "60");

  const tooLarge = await handleSalesEnablementApiRequest(createRequest(undefined, {
    body: "x".repeat(32001),
  }), { env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate() });
  assert.equal(tooLarge.status, 413);
  assert.equal((await tooLarge.json()).error.code, "TOO_LARGE");
});

test("the run endpoints advertise the only allowed method", async () => {
  const create = await handleSalesEnablementApiRequest(
    new Request("https://lab.example/api/sales-enablement/runs"),
    { env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate() },
  );
  assert.equal(create.status, 405);
  assert.equal(create.headers.get("allow"), "POST");
  const status = await handleSalesEnablementApiRequest(
    new Request("https://lab.example/api/sales-enablement/runs/resp_status123", { method: "POST" }),
    { env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate() },
  );
  assert.equal(status.status, 405);
  assert.equal(status.headers.get("allow"), "GET");
});

test("body ingestion honors pre-aborted and pending-read cancellation signals", async () => {
  const preAborted = new AbortController();
  preAborted.abort(new DOMException("abort-secret-sentinel", "AbortError"));
  const beforeRead = await handleSalesEnablementApiRequest(createRequest(undefined, {
    signal: preAborted.signal,
  }), { env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate() });
  assert.equal(beforeRead.status, 499);
  assert.equal((await beforeRead.json()).error.code, "CANCELLED");

  let readStarted;
  let cancelled = false;
  const requestController = new AbortController();
  const pendingBody = new ReadableStream({
    pull() {
      readStarted();
      return new Promise(() => {});
    },
    cancel() { cancelled = true; },
  });
  const readStartedPromise = new Promise((resolve) => { readStarted = resolve; });
  const result = handleSalesEnablementApiRequest(createRequest(undefined, {
    body: pendingBody, duplex: "half", signal: requestController.signal,
  }), { env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate() });
  await readStartedPromise;
  requestController.abort(new DOMException("abort-secret-sentinel", "AbortError"));
  const duringRead = await result;
  assert.equal(duringRead.status, 499);
  assert.equal((await duringRead.json()).error.code, "CANCELLED");
  assert.equal(cancelled, true);
});

test("body ingestion reports a pending-read deadline as timeout", async (t) => {
  const deadline = new AbortController();
  t.mock.method(AbortSignal, "timeout", () => deadline.signal);
  let startRead;
  let cancelled = false;
  const readStarted = new Promise((resolve) => { startRead = resolve; });
  const pendingBody = new ReadableStream({
    pull() {
      startRead();
      return new Promise(() => {});
    },
    cancel() { cancelled = true; },
  });
  const result = handleSalesEnablementApiRequest(createRequest(undefined, {
    body: pendingBody, duplex: "half",
  }), {
    env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate(), timeoutMs: 5,
  });
  await readStarted;
  deadline.abort(new DOMException("deadline-secret-sentinel", "TimeoutError"));
  const response = await result;
  assert.equal(response.status, 504);
  assert.equal((await response.json()).error.code, "TIMEOUT");
  assert.equal(cancelled, true);
});

test("stream faults never expose their error details", async () => {
  const response = await handleSalesEnablementApiRequest(createRequest(undefined, {
    body: new ReadableStream({
      start(controller) { controller.error(new Error("stream-secret-sentinel")); },
    }),
    duplex: "half",
  }), { env: { OPENAI_API_KEY: "secret" }, createGate: gate(), statusGate: gate() });
  assert.equal(response.status, 502);
  const text = await response.text();
  assert.match(text, /RUN_FAILED/);
  assert.doesNotMatch(text, /stream-secret-sentinel/);
});
