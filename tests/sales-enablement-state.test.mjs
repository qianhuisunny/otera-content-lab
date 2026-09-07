import assert from "node:assert/strict";
import test from "node:test";
import {
  createSalesEnablementSession,
  latestActiveRunId,
  readRunIndex,
  rememberRun,
  salesEnablementReducer,
  RUN_INDEX_KEY,
} from "../src/data/salesEnablementSession.js";
import { SALES_ENABLEMENT_WORKFLOW } from "../src/data/salesEnablementWorkflow.js";
import { RETELL_SALES_ENABLEMENT_EXAMPLE_RUN } from "../src/data/salesEnablementExample.js";

const memoryStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

test("the browser workflow is loaded from the canonical JSON manifest", () => {
  assert.deepEqual(SALES_ENABLEMENT_WORKFLOW.stages.map(({ label }) => label), [
    "Define scope", "Gather evidence", "Build narrative", "Generate deck",
    "Validate readiness",
  ]);
  assert.equal(SALES_ENABLEMENT_WORKFLOW.workstreams.length, 7);
  assert.ok(SALES_ENABLEMENT_WORKFLOW.stages
    .every(({ sources }) => sources.length > 0));
});

test("the isolated reducer edits scope, selects steps, and swaps example/live state", (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  const initial = createSalesEnablementSession();
  const edited = salesEnablementReducer(initial, {
    type: "set-input", field: "buyerProblem", value: "Edited deal problem",
  });
  assert.equal(edited.input.buyerProblem, "Edited deal problem");
  assert.equal(edited.mode, "example");
  assert.equal(salesEnablementReducer(edited, {
    type: "select-step", stepId: "review",
  }).activeStepId, "review");
  const live = salesEnablementReducer(edited, {
    type: "live-started",
    run: { ...RETELL_SALES_ENABLEMENT_EXAMPLE_RUN,
      id: "resp_live1234", status: "queued", artifact: null },
  });
  assert.equal(live.mode, "live");
  assert.equal(live.run.id, "resp_live1234");
  const limited = salesEnablementReducer(live, {
    type: "request-failed",
    error: { code: "PROVIDER_LIMIT", message: "Wait.",
      retryable: true, retryAfterSeconds: 30 },
  });
  assert.equal(limited.retryBlocked, true);
  now += 30000;
  assert.equal(salesEnablementReducer(limited, {
    type: "retry-ready",
  }).retryBlocked, false);
});

test("cancellation settles only its current request and retains active metadata through Example", () => {
  const initial = createSalesEnablementSession();
  const creating = salesEnablementReducer(initial, { type: "live-starting", requestId: "request-1" });
  const interrupted = salesEnablementReducer(creating, { type: "request-cancelled", requestId: "request-1" });
  assert.equal(interrupted.requestStatus, "idle");
  assert.equal(interrupted.requestId, null);
  assert.match(interrupted.error.message, /interrupted/);
  const next = salesEnablementReducer(interrupted, { type: "live-starting", requestId: "request-2" });
  assert.equal(salesEnablementReducer(next, { type: "request-cancelled", requestId: "request-1" }), next);
  const polling = salesEnablementReducer(next, { type: "live-started", requestId: "request-2",
    run: { ...RETELL_SALES_ENABLEMENT_EXAMPLE_RUN, id: "resp_inmemory123", status: "queued", artifact: null } });
  const cancelled = salesEnablementReducer(polling, { type: "request-cancelled", requestId: "request-2" });
  const example = salesEnablementReducer(cancelled, { type: "show-example" });
  assert.equal(example.mode, "example");
  assert.equal(example.activeRun.id, "resp_inmemory123");
  assert.deepEqual(Object.keys(example.activeRun).sort(), ["companyId", "createdAt", "id", "inputSummary", "status", "workflowId"]);
  assert.equal(salesEnablementReducer(example, { type: "live-started", requestId: "request-2", run: polling.run }), example);
});

test("Example and stale timers cannot erase a provider cooldown deadline", (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  const creating = salesEnablementReducer(createSalesEnablementSession(), { type: "live-starting", requestId: "request-limit" });
  const limited = salesEnablementReducer(creating, { type: "request-failed", requestId: "request-limit",
    error: { code: "PROVIDER_LIMIT", message: "Wait.", retryable: true, retryAfterSeconds: 30 } });
  const example = salesEnablementReducer(limited, { type: "show-example" });
  assert.equal(example.mode, "example");
  assert.equal(example.error, null);
  assert.equal(example.retryBlocked, true);
  assert.deepEqual(example.cooldown, { until: 31000, requestId: "request-limit" });
  assert.equal(salesEnablementReducer(example, { type: "live-starting", requestId: "bypass" }), example);
  assert.equal(salesEnablementReducer(example, { type: "retry-ready", requestId: "request-limit" }), example);
  now = 31000;
  assert.equal(salesEnablementReducer(example, { type: "retry-ready", requestId: "stale-request" }), example);
  const ready = salesEnablementReducer(example, { type: "retry-ready", requestId: "request-limit" });
  assert.equal(ready.retryBlocked, false);
  assert.equal(ready.cooldown, null);
});

test("polling cooldown accepts only the current request and run identity", (t) => {
  t.mock.method(Date, "now", () => 1000);
  const creating = salesEnablementReducer(createSalesEnablementSession(), { type: "live-starting", requestId: "request-poll" });
  const polling = salesEnablementReducer(creating, { type: "live-started", requestId: "request-poll",
    run: { ...RETELL_SALES_ENABLEMENT_EXAMPLE_RUN, id: "resp_current123", status: "queued", artifact: null } });
  const action = { type: "polling-wait", requestId: "request-poll", runId: "resp_current123", retryAfterSeconds: 10 };
  const waiting = salesEnablementReducer(polling, action);
  assert.deepEqual(waiting.cooldown, { until: 11000, requestId: "request-poll" });
  assert.equal(waiting.requestStatus, "polling");
  assert.equal(waiting.run, polling.run);
  for (const patch of [{ requestId: "stale-request" }, { runId: "resp_other123" }]) {
    assert.equal(salesEnablementReducer(polling, { ...action, ...patch }), polling);
  }
  const example = salesEnablementReducer(waiting, { type: "show-example" });
  assert.equal(salesEnablementReducer(example, action), example);
});

test("late live updates cannot replace example mode or a newer run", () => {
  const firstRun = { ...RETELL_SALES_ENABLEMENT_EXAMPLE_RUN,
    id: "resp_first123", status: "queued", artifact: null };
  const newerRun = { ...firstRun, id: "resp_newer123", stageId: "research" };
  const initial = createSalesEnablementSession();
  const live = salesEnablementReducer(initial, { type: "live-started", run: firstRun });
  const example = salesEnablementReducer(live, { type: "show-example" });
  assert.equal(salesEnablementReducer(example, {
    type: "live-updated", run: firstRun,
  }).mode, "example");
  assert.equal(salesEnablementReducer(live, {
    type: "live-updated", run: newerRun,
  }).run.id, firstRun.id);
});

test("request identities prevent stale starts and updates from winning", () => {
  const firstRun = { ...RETELL_SALES_ENABLEMENT_EXAMPLE_RUN,
    id: "resp_first123", status: "queued", artifact: null };
  const newerRun = { ...firstRun, id: "resp_newer123", stageId: "research" };
  const initial = createSalesEnablementSession();
  const firstRequest = salesEnablementReducer(initial, {
    type: "live-starting", requestId: "request-1",
  });
  const newerRequest = salesEnablementReducer(firstRequest, {
    type: "live-starting", requestId: "request-2",
  });
  assert.equal(salesEnablementReducer(newerRequest, {
    type: "live-started", requestId: "request-1", run: firstRun,
  }), newerRequest);
  const live = salesEnablementReducer(newerRequest, {
    type: "live-started", requestId: "request-2", run: newerRun,
  });
  assert.equal(salesEnablementReducer(live, {
    type: "live-updated", requestId: "request-1", run: firstRun,
  }).run.id, newerRun.id);
});

test("the versioned run index persists only six safe fields and resumes active runs", () => {
  const storage = memoryStorage();
  rememberRun(storage, {
    ...RETELL_SALES_ENABLEMENT_EXAMPLE_RUN,
    id: "resp_live1234", status: "in_progress",
    prompts: "must-not-persist", artifact: { secret: true },
  }, { buyerProblem: "A bounded input summary" });
  const raw = storage.getItem(RUN_INDEX_KEY);
  assert.doesNotMatch(raw, /must-not-persist|artifact|secret/);
  assert.deepEqual(Object.keys(JSON.parse(raw).runs[0]).sort(), [
    "companyId", "createdAt", "id", "inputSummary", "status", "workflowId",
  ]);
  assert.equal(readRunIndex(storage).runs[0].id, "resp_live1234");
  assert.equal(latestActiveRunId(storage), "resp_live1234");
  storage.setItem(RUN_INDEX_KEY, JSON.stringify({
    version: 1,
    runs: [{ id: "../../.env", workflowId: "sales-enablement",
      companyId: "retell", createdAt: "bad", inputSummary: "x", status: "queued" }],
  }));
  assert.deepEqual(readRunIndex(storage).runs, []);
  storage.setItem(RUN_INDEX_KEY, JSON.stringify({
    version: 1,
    runs: [{ id: "resp_1234567", workflowId: "sales-enablement",
      companyId: "retell", createdAt: "2026-09-06T00:00:00.000Z",
      inputSummary: "Sales enablement deck", status: "queued" }],
  }));
  assert.deepEqual(readRunIndex(storage).runs, []);
});

test("the index ignores corrupt values and retains only the newest ten valid runs", () => {
  const storage = memoryStorage();
  storage.setItem(RUN_INDEX_KEY, "not-json");
  assert.deepEqual(readRunIndex(storage).runs, []);

  for (let index = 0; index < 11; index += 1) {
    rememberRun(storage, {
      id: `resp_valid${String(index).padStart(3, "0")}`,
      workflowId: "sales-enablement", companyId: "retell", status: "completed",
      createdAt: `2026-09-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
    }, { buyerProblem: "x".repeat(200) });
  }
  const runs = readRunIndex(storage).runs;
  assert.equal(runs.length, 10);
  assert.equal(runs[0].id, "resp_valid010");
  assert.equal(runs[0].inputSummary, "Sales enablement deck");
});

test("the run index summary never stores input prose", () => {
  const storage = memoryStorage();
  rememberRun(storage, {
    id: "resp_summary123", workflowId: "sales-enablement", companyId: "retell",
    status: "queued", createdAt: "2026-09-06T00:00:00.000Z",
  }, {
    assetType: "executive_champion_deck", salesStage: "evaluation",
    buyerProblem: "private buyer problem sentinel", desiredNextStep: "private next step sentinel",
  });
  const raw = storage.getItem(RUN_INDEX_KEY);
  assert.doesNotMatch(raw, /private buyer problem sentinel|private next step sentinel/);
  assert.equal(readRunIndex(storage).runs[0].inputSummary, "Sales enablement deck");
});
