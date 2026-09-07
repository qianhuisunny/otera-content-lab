import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  createSalesEnablementRun, fetchSalesEnablementHealth,
  pollSalesEnablementRun, retrieveSalesEnablementRun,
} from "../../data/salesEnablementClient.js";
import { latestActiveRunId, rememberRun } from "../../data/salesEnablementSession.js";
import { SALES_ENABLEMENT_RESPONSE_ID } from "../../data/salesEnablementContract.js";

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
export function createSalesEnablementLifecycle({ dispatch, storage, fetchImpl, sleep, getSession }) {
  let controller = null;
  let pendingRequestId = null;
  let resumedId = null;
  let deferredResume = null;
  let autoResumeSuppressed = false;
  const coolingDown = () => (getSession().cooldown?.until ?? 0) > Date.now();
  const abort = () => {
    controller?.abort();
    controller = null;
    resumedId = null;
    deferredResume = null;
    if (pendingRequestId) dispatch({ type: "request-cancelled", requestId: pendingRequestId });
    pendingRequestId = null;
  };
  const execute = async (input, resumeId = null) => {
    abort();
    resumedId = resumeId;
    const current = new AbortController();
    controller = current;
    const id = requestId();
    pendingRequestId = id;
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
    } finally {
      if (controller === current) pendingRequestId = null;
    }
  };
  return {
    abort,
    showExample() {
      autoResumeSuppressed = true;
      abort();
      dispatch({ type: "show-example" });
    },
    runLive: (input) => coolingDown() ? Promise.resolve() : execute(input),
    releaseCooldown(cooldown) {
      const current = getSession().cooldown;
      if (!current || current.until !== cooldown.until || current.requestId !== cooldown.requestId || coolingDown()) return;
      dispatch({ type: "retry-ready", requestId: cooldown.requestId });
      const deferred = deferredResume;
      deferredResume = null;
      if (!deferred || autoResumeSuppressed || pendingRequestId || getSession().requestStatus !== "idle") return;
      return execute(deferred.input, deferred.id);
    },
    resume(input) {
      if (autoResumeSuppressed || pendingRequestId) return Promise.resolve();
      const retained = getSession().activeRun;
      const retainedId = retained && active(retained) && SALES_ENABLEMENT_RESPONSE_ID.test(retained.id) &&
        retained.workflowId === "sales-enablement" && retained.companyId === "retell" ? retained.id : null;
      const id = retainedId ?? latestActiveRunId(storage);
      if (!id) return Promise.resolve();
      if (coolingDown()) {
        deferredResume = { id, input };
        return Promise.resolve();
      }
      if (id === resumedId) return Promise.resolve();
      return execute(input, id);
    },
  };
}

function browserStorage() {
  try { return globalThis.localStorage; }
  catch { return undefined; }
}

export function useSalesEnablementRuntime({ session, dispatch, storage = browserStorage() }) {
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const lifecycle = useMemo(() => createSalesEnablementLifecycle({ dispatch, storage,
    getSession: () => sessionRef.current }), [dispatch, storage]);

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
    if (!session.cooldown) return undefined;
    const timer = setTimeout(() => lifecycle.releaseCooldown(session.cooldown),
      Math.max(0, session.cooldown.until - Date.now()));
    return () => clearTimeout(timer);
  }, [lifecycle, session.cooldown]);

  useEffect(() => {
    if (!session.provider.checked || !session.provider.configured) return undefined;
    lifecycle.resume(sessionRef.current.input);
    // Reset the resume guard when React remounts effects, allowing an aborted GET
    // to resume safely without ever replaying a create request.
    return lifecycle.abort;
  }, [lifecycle, session.provider.checked, session.provider.configured]);

  useEffect(() => lifecycle.abort, [lifecycle]);
  const runLive = useCallback(() => {
    const current = sessionRef.current;
    if (!current.provider.configured || current.requestStatus !== "idle" || current.retryBlocked) return;
    return lifecycle.runLive(current.input);
  }, [lifecycle]);
  return { runLive, abort: lifecycle.abort, showExample: lifecycle.showExample };
}
