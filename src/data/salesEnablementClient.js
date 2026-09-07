import {
  TERMINAL_RUN_STATUSES,
  validatePublicSalesEnablementRun,
} from "./salesEnablementContract.js";

const delays = [1000, 2000, 4000, 8000];

function retryAfterSeconds(response, body) {
  const bodyValue = body?.error?.retryAfterSeconds;
  if (Number.isInteger(bodyValue) && bodyValue >= 0) return bodyValue;
  const headerValue = Number(response.headers.get("retry-after"));
  return Number.isFinite(headerValue) && headerValue >= 0 ? Math.floor(headerValue) : null;
}

function requestError(response, body) {
  const serverError = body?.error;
  return {
    code: typeof serverError?.code === "string" ? serverError.code : "REQUEST_FAILED",
    message: typeof serverError?.message === "string" ? serverError.message : "The request failed.",
    retryable: typeof serverError?.retryable === "boolean" ? serverError.retryable : response.status >= 429,
    retryAfterSeconds: retryAfterSeconds(response, body),
  };
}

async function responseJson(response) {
  let body;
  try { body = await response.json(); }
  catch {
    throw { code: "NETWORK_RESPONSE", message: "The server returned unreadable data.",
      retryable: true, retryAfterSeconds: null };
  }
  if (!response.ok) throw requestError(response, body);
  return body;
}

function throwIfAborted(signal) {
  if (!signal?.aborted) return;
  throw signal.reason ?? new DOMException("The request was cancelled.", "AbortError");
}

const defaultSleep = (milliseconds, signal) => new Promise((resolve, reject) => {
  throwIfAborted(signal);
  const timer = setTimeout(resolve, milliseconds);
  signal?.addEventListener("abort", () => {
    clearTimeout(timer);
    reject(signal.reason ?? new DOMException("The request was cancelled.", "AbortError"));
  }, { once: true });
});

export async function fetchSalesEnablementHealth({ fetchImpl = fetch, signal } = {}) {
  const body = await responseJson(await fetchImpl("/api/health", { signal }));
  const feature = body?.features?.salesEnablement;
  return {
    configured: feature?.configured === true,
    model: typeof feature?.model === "string" ? feature.model : "gpt-5.6-sol",
  };
}

export async function createSalesEnablementRun(input, { fetchImpl = fetch, signal } = {}) {
  return validatePublicSalesEnablementRun(await responseJson(await fetchImpl(
    "/api/sales-enablement/runs", {
      method: "POST", signal, headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    })));
}

export async function retrieveSalesEnablementRun(id, { fetchImpl = fetch, signal } = {}) {
  if (!/^resp_[A-Za-z0-9_-]{8,200}$/.test(id)) {
    throw new TypeError("Invalid sales enablement run ID.");
  }
  return validatePublicSalesEnablementRun(await responseJson(await fetchImpl(
    "/api/sales-enablement/runs/" + encodeURIComponent(id), { signal })));
}

export async function pollSalesEnablementRun(id, {
  fetchImpl = fetch, signal, onUpdate = () => {}, sleep = defaultSleep,
} = {}) {
  let attempt = 0;
  while (true) {
    throwIfAborted(signal);
    let run;
    try {
      run = await retrieveSalesEnablementRun(id, { fetchImpl, signal });
    } catch (error) {
      if (!error?.retryable || !Number.isInteger(error.retryAfterSeconds) ||
          error.retryAfterSeconds <= 0) throw error;
      await sleep(error.retryAfterSeconds * 1000, signal);
      continue;
    }
    onUpdate(run);
    if (TERMINAL_RUN_STATUSES.includes(run.status)) return run;
    await sleep(delays[Math.min(attempt, delays.length - 1)], signal);
    attempt += 1;
  }
}
