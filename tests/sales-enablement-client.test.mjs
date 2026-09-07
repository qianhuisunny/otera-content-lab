import assert from "node:assert/strict";
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

test("the client rejects malformed IDs and unvalidated server runs", async () => {
  await assert.rejects(retrieveSalesEnablementRun("../../.env"), /Invalid sales enablement run ID/);
  await assert.rejects(
    createSalesEnablementRun(RETELL_SALES_ENABLEMENT_INPUT, {
      fetchImpl: async () => Response.json({ id: "resp_bad123" }),
    }),
    /public sales enablement run/i,
  );
});
