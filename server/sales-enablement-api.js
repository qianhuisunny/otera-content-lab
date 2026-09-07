import { readFile } from "node:fs/promises";
import { validateSalesEnablementInput } from "../src/data/salesEnablementContract.js";
import { createLimiter } from "./writing-api.js";
import { loadSalesEnablementBundle } from "./sales-enablement-context.js";
import {
  createSalesEnablementResponse,
  normalizeSalesEnablementResponse,
  retrieveSalesEnablementResponse,
  SalesEnablementProviderError,
} from "./sales-enablement-provider.js";

const createInstanceGate = createLimiter({ limit: 3, windowMs: 60000, maxConcurrent: 2 });
const statusInstanceGate = createLimiter({ limit: 60, windowMs: 60000, maxConcurrent: 10 });
const RUN_PATH = /^\/api\/sales-enablement\/runs\/(resp_[A-Za-z0-9_-]{8,200})$/;

const json = (body, status = 200, headers = {}) => Response.json(body, {
  status,
  headers: {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  },
});
const fail = (status, code, message, retryAfterSeconds = null, headers = {}) =>
  json({ error: { code, message, retryable: status >= 429, retryAfterSeconds } },
    status, { ...headers, ...(retryAfterSeconds ?
      { "Retry-After": String(retryAfterSeconds) } : {}) });

async function readBoundedJson(request, signal) {
  if (Number(request.headers.get("content-length")) > 32000) {
    throw Object.assign(new Error("The sales brief is too large."), {
      status: 413, code: "TOO_LARGE",
    });
  }
  const reader = request.body?.getReader();
  if (!reader) throw Object.assign(new Error("A JSON request body is required."), {
    status: 400, code: "INVALID_INPUT",
  });
  const chunks = [];
  let bytes = 0;
  const cancel = () => { void reader.cancel(signal.reason).catch(() => {}); };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    while (true) {
      signal.throwIfAborted();
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 32000) {
        void reader.cancel();
        throw Object.assign(new Error("The sales brief is too large."), {
          status: 413, code: "TOO_LARGE",
        });
      }
      chunks.push(value);
    }
    const buffer = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    }
    try { return JSON.parse(new TextDecoder().decode(buffer)); }
    catch {
      throw Object.assign(new Error("Send a valid JSON request."), {
        status: 400, code: "INVALID_JSON",
      });
    }
  } finally {
    signal.removeEventListener("abort", cancel);
    reader.releaseLock();
  }
}

export async function readSalesEnablementWorkflow() {
  return JSON.parse(await readFile(
    new URL("../skills/sales-enablement/workflow.json", import.meta.url), "utf8"));
}

export async function handleSalesEnablementApiRequest(request, {
  env = process.env,
  fetchImpl = fetch,
  createGate = createInstanceGate,
  statusGate = statusInstanceGate,
  loadBundle = loadSalesEnablementBundle,
  readWorkflow = readSalesEnablementWorkflow,
  createProvider = createSalesEnablementResponse,
  retrieveProvider = retrieveSalesEnablementResponse,
  normalizeProvider = normalizeSalesEnablementResponse,
  timeoutMs = 240000,
} = {}) {
  const url = new URL(request.url);
  const isCreate = url.pathname === "/api/sales-enablement/runs";
  const itemMatch = url.pathname.match(RUN_PATH);
  if (!isCreate && !itemMatch) {
    return fail(404, "NOT_FOUND", "This API endpoint does not exist.");
  }
  const allowedMethod = isCreate ? "POST" : "GET";
  if (request.method !== allowedMethod) {
    return fail(405, "METHOD_NOT_ALLOWED", "Use " + allowedMethod + ".",
      null, { Allow: allowedMethod });
  }
  if (request.headers.get("origin") &&
      request.headers.get("origin") !== url.origin) {
    return fail(403, "ORIGIN_NOT_ALLOWED",
      "Use the Content Lab workspace on this site.");
  }

  const timeout = AbortSignal.timeout(timeoutMs);
  const signal = AbortSignal.any([timeout, request.signal]);
  let input = null;
  if (isCreate) {
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
        "application/json") {
      return fail(415, "UNSUPPORTED_MEDIA_TYPE", "Send application/json.");
    }
    try {
      input = validateSalesEnablementInput(await readBoundedJson(request, signal));
    } catch (error) {
      return fail(error.status ?? 400, error.code ?? "INVALID_INPUT", error.message);
    }
  }
  if (!env.OPENAI_API_KEY?.trim()) {
    return fail(503, "NOT_CONFIGURED",
      "Live Sales Enablement is not configured. Example run stays available.");
  }
  const client = env.VERCEL ?
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
      "unknown" : "local";
  const gate = isCreate ? createGate : statusGate;
  const release = gate.acquire(client);
  if (!release) {
    return fail(429, "RATE_LIMITED",
      "Too many requests. Please wait and retry.", 60);
  }
  try {
    if (isCreate) {
      const bundle = await loadBundle();
      signal.throwIfAborted();
      const provider = await createProvider({
        env, bundle, input, fetchImpl, signal,
      });
      return json(normalizeProvider(provider, bundle.workflow), 202);
    }
    const workflow = await readWorkflow();
    signal.throwIfAborted();
    const provider = await retrieveProvider({
      env, responseId: itemMatch[1], fetchImpl, signal,
    });
    return json(normalizeProvider(provider, workflow));
  } catch (error) {
    if (request.signal.aborted) {
      return fail(499, "CANCELLED", "The request was cancelled.");
    }
    if (timeout.aborted) {
      return fail(504, "TIMEOUT", "The provider request timed out.");
    }
    if (error instanceof SalesEnablementProviderError) {
      return fail(error.status, error.code, error.message,
        error.retryAfterSeconds);
    }
    return fail(502, "RUN_FAILED",
      "The sales enablement run could not be processed.");
  } finally {
    release();
  }
}
