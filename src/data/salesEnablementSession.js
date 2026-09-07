import { RETELL_SALES_ENABLEMENT_EXAMPLE_RUN } from "./salesEnablementExample.js";
import { RETELL_SALES_ENABLEMENT_INPUT } from "./salesEnablementScenario.js";
import { STAGE_IDS } from "./salesEnablementContract.js";

export const RUN_INDEX_KEY = "content-lab:sales-enablement-runs:v1";

const INDEX_VERSION = 1;
const RUN_LIMIT = 10;
const RUN_ID = /^resp_[A-Za-z0-9_-]{7,200}$/;
const RUN_STATUSES = new Set(["queued", "in_progress", "completed", "failed"]);

const isIsoTimestamp = (value) => typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
  !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;

function parseRecord(value) {
  if (!value || Array.isArray(value) || typeof value !== "object") return null;
  const keys = Object.keys(value);
  const expected = ["id", "workflowId", "companyId", "createdAt", "inputSummary", "status"];
  if (keys.length !== expected.length || keys.some((key) => !expected.includes(key))) return null;
  if (!RUN_ID.test(value.id) || value.workflowId !== "sales-enablement" ||
      value.companyId !== "retell" || !isIsoTimestamp(value.createdAt) ||
      !RUN_STATUSES.has(value.status) || typeof value.inputSummary !== "string" ||
      value.inputSummary.length > 160) return null;
  return {
    id: value.id,
    workflowId: "sales-enablement",
    companyId: "retell",
    createdAt: value.createdAt,
    inputSummary: value.inputSummary,
    status: value.status,
  };
}

export function readRunIndex(storage) {
  let value;
  try { value = JSON.parse(storage?.getItem(RUN_INDEX_KEY) ?? ""); }
  catch { return { version: INDEX_VERSION, runs: [] }; }
  if (!value || Array.isArray(value) || typeof value !== "object" || value.version !== INDEX_VERSION ||
      !Array.isArray(value.runs)) return { version: INDEX_VERSION, runs: [] };
  return {
    version: INDEX_VERSION,
    runs: value.runs.map(parseRecord).filter(Boolean).slice(0, RUN_LIMIT),
  };
}

export function rememberRun(storage, run, input) {
  const record = parseRecord({
    id: run?.id,
    workflowId: run?.workflowId,
    companyId: run?.companyId,
    createdAt: run?.createdAt,
    inputSummary: "Sales enablement deck",
    status: run?.status,
  });
  if (!record) return readRunIndex(storage);
  const existing = readRunIndex(storage).runs.filter(({ id }) => id !== record.id);
  const index = { version: INDEX_VERSION, runs: [record, ...existing].slice(0, RUN_LIMIT) };
  try { storage?.setItem(RUN_INDEX_KEY, JSON.stringify(index)); }
  catch { /* Browser storage can be unavailable; retaining a run is best-effort. */ }
  return index;
}

export function latestActiveRunId(storage) {
  return readRunIndex(storage).runs.find(({ status }) =>
    status === "queued" || status === "in_progress")?.id ?? null;
}

export function createSalesEnablementSession() {
  return {
    mode: "example",
    activeStepId: "scope",
    input: structuredClone(RETELL_SALES_ENABLEMENT_INPUT),
    run: RETELL_SALES_ENABLEMENT_EXAMPLE_RUN,
    provider: { checked: false, configured: false, model: "gpt-5.6-sol" },
    requestStatus: "idle",
    retryBlocked: false,
    error: null,
  };
}

export function salesEnablementReducer(state, action) {
  if (action.type === "set-input") {
    if (!Object.hasOwn(state.input, action.field)) return state;
    return { ...state, input: { ...state.input, [action.field]: action.value } };
  }
  if (action.type === "select-step" && STAGE_IDS.includes(action.stepId)) {
    return { ...state, activeStepId: action.stepId };
  }
  if (action.type === "provider-health") {
    return { ...state, provider: { checked: true, ...action.provider } };
  }
  if (action.type === "show-example") {
    return { ...state, mode: "example", run: RETELL_SALES_ENABLEMENT_EXAMPLE_RUN,
      requestStatus: "idle", retryBlocked: false, error: null };
  }
  if (action.type === "live-starting") {
    return { ...state, mode: "live", requestStatus: "creating",
      retryBlocked: false, error: null };
  }
  if (action.type === "live-started" || action.type === "live-updated") {
    return { ...state, mode: "live", run: action.run,
      activeStepId: action.run.stageId,
      requestStatus: ["queued", "in_progress"].includes(action.run.status) ? "polling" : "idle",
      retryBlocked: Number(action.run.error?.retryAfterSeconds) > 0,
      error: action.run.error };
  }
  if (action.type === "request-failed") {
    return { ...state, requestStatus: "idle", error: action.error,
      retryBlocked: Number(action.error?.retryAfterSeconds) > 0 };
  }
  if (action.type === "retry-ready") return { ...state, retryBlocked: false };
  return state;
}
