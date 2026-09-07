import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  createSalesEnablementRun, fetchSalesEnablementHealth,
  pollSalesEnablementRun, retrieveSalesEnablementRun,
} from "../../data/salesEnablementClient.js";
import { latestActiveRunId, rememberRun } from "../../data/salesEnablementSession.js";

let requestSequence = 0;
const active = (run) => ["queued", "in_progress"].includes(run.status);
const requestId = () => globalThis.crypto?.randomUUID?.() ?? `sales-${Date.now()}-${++requestSequence}`;

function publicRequestError(error) {
  if (typeof error?.code === "string" && typeof error.message === "string" &&
      typeof error.retryable === "boolean") {
    return { code: error.code, message: error.message, retryable: error.retryable,
      retryAfterSeconds: Number.isInteger(error.retryAfterSeconds) ? error.retryAfterSeconds : null };
  }
  return { code: "REQUEST_FAILED", message: "The live run could not be reached. Please try again.",
    retryable: true, retryAfterSeconds: null };
}

// One owner for a create/resume and its polling. Every dispatch and storage write
// belongs to that request, even if a transport completes after it was aborted.
export function createSalesEnablementLifecycle({ dispatch, storage, fetchImpl, sleep }) {
  let controller = null;
  let resumedId = null;
  const abort = () => {
    controller?.abort();
    controller = null;
    resumedId = null;
  };
  const execute = async (input, resumeId = null) => {
    abort();
    resumedId = resumeId;
    const current = new AbortController();
    controller = current;
    const id = requestId();
    const options = { fetchImpl, signal: current.signal };
    const isCurrent = () => controller === current && !current.signal.aborted;
    const publish = (type, run) => {
      if (!isCurrent()) return;
      dispatch({ type, run, requestId: id });
      if (isCurrent()) rememberRun(storage, run, input);
    };
    dispatch({ type: "live-starting", requestId: id });
    try {
      const run = resumeId ? await retrieveSalesEnablementRun(resumeId, options) :
        await createSalesEnablementRun(input, options);
      if (!isCurrent()) return;
      if (resumeId && run.id !== resumeId) throw new Error("Run identity mismatch.");
      publish("live-started", run);
      if (active(run)) await pollSalesEnablementRun(run.id, {
        ...options, sleep, onUpdate: (update) => {
          if (update.id !== run.id) throw new Error("Run identity mismatch.");
          publish("live-updated", update);
        },
      });
    } catch (error) {
      if (isCurrent()) dispatch({ type: "request-failed", requestId: id, error: publicRequestError(error) });
    }
  };
  return {
    abort,
    runLive: (input) => execute(input),
    resume(input) {
      const id = latestActiveRunId(storage);
      if (!id || id === resumedId) return Promise.resolve();
      return execute(input, id);
    },
  };
}

function browserStorage() {
  try { return globalThis.localStorage; }
  catch { return undefined; }
}

export function useSalesEnablementRuntime({ session, dispatch, storage = browserStorage() }) {
  const inputRef = useRef(session.input);
  inputRef.current = session.input;
  const lifecycle = useMemo(() => createSalesEnablementLifecycle({ dispatch, storage }), [dispatch, storage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchSalesEnablementHealth({ signal: controller.signal })
      .then((provider) => {
        if (!controller.signal.aborted) dispatch({ type: "provider-health", provider });
      })
      .catch(() => {
        if (!controller.signal.aborted) dispatch({ type: "provider-health",
          provider: { configured: false, model: "gpt-5.6-sol" } });
      });
    return () => controller.abort();
  }, [dispatch]);

  useEffect(() => {
    const seconds = Number(session.error?.retryAfterSeconds);
    if (!session.retryBlocked || !Number.isFinite(seconds) || seconds <= 0) return undefined;
    const timer = setTimeout(() => dispatch({ type: "retry-ready" }), seconds * 1000);
    return () => clearTimeout(timer);
  }, [dispatch, session.error, session.retryBlocked]);

  useEffect(() => {
    if (!session.provider.checked || !session.provider.configured) return undefined;
    lifecycle.resume(inputRef.current);
    // Reset the resume guard when React remounts effects, allowing an aborted GET
    // to resume safely without ever replaying a create request.
    return lifecycle.abort;
  }, [lifecycle, session.provider.checked, session.provider.configured]);

  useEffect(() => lifecycle.abort, [lifecycle]);
  const runLive = useCallback(() => {
    if (!session.provider.configured || session.requestStatus !== "idle" || session.retryBlocked) return;
    return lifecycle.runLive(inputRef.current);
  }, [lifecycle, session.provider.configured, session.requestStatus, session.retryBlocked]);
  return { runLive, abort: lifecycle.abort };
}
