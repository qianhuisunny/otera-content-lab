import assert from "node:assert/strict";
import { getEventListeners } from "node:events";
import test from "node:test";
import {
  createSalesEnablementRun,
  fetchSalesEnablementHealth,
  pollSalesEnablementRun,
  retrieveSalesEnablementRun,
} from "../src/data/salesEnablementClient.js";
import { RETELL_SALES_ENABLEMENT_EXAMPLE_RUN } from "../src/data/salesEnablementExample.js";
import { RETELL_SALES_ENABLEMENT_INPUT } from "../src/data/salesEnablementScenario.js";

test("the client reads feature health and uses the two same-origin operations", async () => {
  const urls = [];
  const fetchImpl = async (url, init = {}) => {
    urls.push([url, init.method ?? "GET"]);
    if (url === "/api/health") return Response.json({
      features: { salesEnablement: { configured: true, model: "gpt-5.6-sol" } },
    });
    return Response.json(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN,
      { status: init.method === "POST" ? 202 : 200 });
  };
  assert.equal((await fetchSalesEnablementHealth({ fetchImpl })).configured, true);
  await createSalesEnablementRun(RETELL_SALES_ENABLEMENT_INPUT, { fetchImpl });
  await retrieveSalesEnablementRun("resp_status123", { fetchImpl });
  assert.deepEqual(urls, [
    ["/api/health", "GET"],
    ["/api/sales-enablement/runs", "POST"],
    ["/api/sales-enablement/runs/resp_status123", "GET"],
  ]);
});

test("polling uses bounded backoff and stops at a terminal run", async () => {
  const statuses = ["queued", "in_progress", "completed"];
  const waits = [];
  const updates = [];
  const result = await pollSalesEnablementRun("resp_status123", {
    fetchImpl: async () => Response.json({
      ...RETELL_SALES_ENABLEMENT_EXAMPLE_RUN,
      status: statuses.shift(),
      artifact: statuses.length ? null : RETELL_SALES_ENABLEMENT_EXAMPLE_RUN.artifact,
    }),
    sleep: async (milliseconds) => waits.push(milliseconds),
    onUpdate: (run) => updates.push(run.status),
  });
  assert.equal(result.status, "completed");
  assert.deepEqual(updates, ["queued", "in_progress", "completed"]);
  assert.deepEqual(waits, [1000, 2000]);
});

test("the client preserves retry-after metadata and polling propagates cancellation", async () => {
  await assert.rejects(
    createSalesEnablementRun(RETELL_SALES_ENABLEMENT_INPUT, {
      fetchImpl: async () => Response.json({ error: {
        code: "RATE_LIMITED", message: "Wait.", retryable: true, retryAfterSeconds: 7,
      } }, { status: 429, headers: { "Retry-After": "7" } }),
    }),
    (error) => error.code === "RATE_LIMITED" && error.retryAfterSeconds === 7,
  );

  const controller = new AbortController();
  controller.abort(new DOMException("cancelled", "AbortError"));
  await assert.rejects(
    pollSalesEnablementRun("resp_status123", { signal: controller.signal }),
    (error) => error.name === "AbortError",
  );
});

test("polling does not publish a terminal run after cancellation during retrieval", async () => {
  const controller = new AbortController();
  const updates = [];
  let resolveResponse;
  const polling = pollSalesEnablementRun("resp_status123", {
    signal: controller.signal,
    fetchImpl: () => new Promise((resolve) => { resolveResponse = resolve; }),
    onUpdate: (run) => updates.push(run),
  });
  controller.abort(new DOMException("cancelled", "AbortError"));
  resolveResponse(Response.json(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN));
  await assert.rejects(polling, (error) => error.name === "AbortError");
  assert.deepEqual(updates, []);
});

test("polling honors server retry-after before retrying a status request", async () => {
  let calls = 0;
  const waits = [];
  const result = await pollSalesEnablementRun("resp_status123", {
    fetchImpl: async () => {
      calls += 1;
      if (calls === 1) return Response.json({ error: {
        code: "RATE_LIMITED", message: "Wait.", retryable: true, retryAfterSeconds: null,
      } }, { status: 429, headers: { "Retry-After": "4" } });
      return Response.json(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN);
    },
    sleep: async (milliseconds) => waits.push(milliseconds),
  });
  assert.equal(result.status, "completed");
  assert.equal(calls, 2);
  assert.deepEqual(waits, [4000]);
});

test("polling publishes only retry delay metadata before waiting", async () => {
  let calls = 0;
  const events = [];
  await pollSalesEnablementRun("resp_status123", {
    fetchImpl: async () => ++calls === 1 ? Response.json({ error: {
      code: "RATE_LIMITED", message: "PRIVATE_DETAIL", retryable: true, retryAfterSeconds: 4,
    } }, { status: 429 }) : Response.json(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN),
    onRetry: (metadata) => events.push(metadata),
    sleep: async (milliseconds) => events.push(milliseconds),
  });
  assert.deepEqual(events, [{ retryAfterSeconds: 4 }, 4000]);
});

test("a late polling limit after cancellation cannot publish retry metadata", async () => {
  const controller = new AbortController();
  let resolveResponse;
  const events = [];
  const pending = pollSalesEnablementRun("resp_status123", {
    signal: controller.signal,
    fetchImpl: () => new Promise((resolve) => { resolveResponse = resolve; }),
    onRetry: (metadata) => events.push(metadata),
    sleep: async () => events.push("wait"),
  });
  controller.abort();
  resolveResponse(Response.json({ error: {
    code: "RATE_LIMITED", message: "Wait.", retryable: true, retryAfterSeconds: 4,
  } }, { status: 429 }));
  await assert.rejects(pending, { name: "AbortError" });
  assert.deepEqual(events, []);
});

test("default polling waits balance abort listener cleanup on resolution and cancellation", async (t) => {
  for (const outcome of ["timer", "abort"]) await t.test(outcome, async (t) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const removed = [];
    const removeListener = signal.removeEventListener.bind(signal);
    t.mock.method(signal, "removeEventListener", (type, listener) => {
      removed.push([type, listener]);
      removeListener(type, listener);
    });
    let finishTimer;
    let timerStarted;
    const waiting = new Promise((resolve) => { timerStarted = resolve; });
    const timer = {};
    t.mock.method(globalThis, "setTimeout", (callback, milliseconds) => {
      assert.equal(milliseconds, 1000);
      finishTimer = callback;
      timerStarted();
      return timer;
    });
    const cleared = [];
    t.mock.method(globalThis, "clearTimeout", (value) => cleared.push(value));
    let requests = 0;
    const pending = pollSalesEnablementRun("resp_status123", {
      signal,
      fetchImpl: async () => Response.json(++requests === 1 ? {
        ...RETELL_SALES_ENABLEMENT_EXAMPLE_RUN, status: "queued", artifact: null,
      } : RETELL_SALES_ENABLEMENT_EXAMPLE_RUN),
    });
    await waiting;
    const listeners = getEventListeners(signal, "abort");
    assert.equal(listeners.length, 1);
    if (outcome === "timer") {
      finishTimer();
      assert.equal((await pending).status, "completed");
      assert.equal(requests, 2);
    } else {
      controller.abort();
      await assert.rejects(pending, { name: "AbortError" });
      assert.equal(requests, 1);
      assert.deepEqual(cleared, [timer]);
    }
    assert.deepEqual(getEventListeners(signal, "abort"), []);
    assert.deepEqual(removed, [["abort", listeners[0]]]);
  });
});

test("the client rejects malformed IDs and unvalidated server runs", async () => {
  await assert.rejects(retrieveSalesEnablementRun("../../.env"), /Invalid sales enablement run ID/);
  await assert.rejects(
    createSalesEnablementRun(RETELL_SALES_ENABLEMENT_INPUT, {
      fetchImpl: async () => Response.json({ id: "resp_bad123" }),
    }),
    /public sales enablement run/i,
  );
});
