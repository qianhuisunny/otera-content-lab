import { useEffect, useRef, useState } from "react";
import { Button } from "@qianhui/ui";
import { WritingWorkspace } from "./WritingWorkspace.jsx";
import { generateWriting, liveWritingScenario } from "../../data/writingGeneration.js";
import { markdownToEditorHtml } from "../../data/markdownToEditorHtml.js";
import "../../writing-generation.css";

export function WritingRuntime({ dispatch, scenario, session }) {
  const pending = useRef(null);
  const notice = useRef(null);
  const [configuration, setConfiguration] = useState(null);
  const busy = session.generation?.status === "generating";

  useEffect(() => {
    if (!session.generation) return;
    notice.current?.focus({ preventScroll: true });
    notice.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [session.generation?.id, session.generation?.status]);

  useEffect(() => {
    const health = new AbortController();
    fetch("/api/health", { signal: health.signal, cache: "no-store" })
      .then(async (response) => response.ok && response.headers.get("content-type")?.includes("application/json") ? response.json() : null)
      .then((result) => { if (!health.signal.aborted) setConfiguration(result?.provider === "openai" ? result : { unavailable: true }); })
      .catch(() => { if (!health.signal.aborted) setConfiguration({ unavailable: true }); });
    return () => {
      health.abort();
      const active = pending.current;
      if (active) {
        pending.current = null;
        active.controller.abort();
        dispatch({ type: "generation-cancel", companyId: session.companyId, id: active.id });
      }
    };
  }, [dispatch, session.companyId]);

  const cancel = () => {
    const active = pending.current;
    if (!active) return;
    pending.current = null;
    active.controller.abort();
    dispatch({ type: "generation-cancel", companyId: session.companyId, id: active.id });
  };

  const generate = async (stage) => {
    if (pending.current) return;
    const active = { id: crypto.randomUUID(), controller: new AbortController() };
    pending.current = active;
    dispatch({ type: "generation-start", stage, id: active.id, companyId: session.companyId });
    try {
      const result = await generateWriting(session, stage, { signal: active.controller.signal });
      if (pending.current !== active) return;
      const articleHtml = stage === "draft" ? markdownToEditorHtml(result.markdown) : undefined;
      dispatch({ type: "generation-success", id: active.id, companyId: session.companyId, result, articleHtml });
      setConfiguration((previous) => ({ ...previous, configured: true, unavailable: false }));
    } catch (error) {
      if (pending.current !== active || active.controller.signal.aborted) return;
      dispatch({ type: "generation-failure", id: active.id, companyId: session.companyId, message: error.message });
    } finally { if (pending.current === active) pending.current = null; }
  };

  const handleAction = (action) => {
    if (pending.current) return;
    if (action.type === "reset-outline" || (action.type === "advance-step" && session.currentStep === "brief")) { void generate("outline"); return; }
    if (action.type === "advance-step" && session.currentStep === "outline") { void generate("draft"); return; }
    dispatch(action);
  };

  return (
    <div className="writing-runtime">
      <div className="writing-generation-notice" ref={notice} tabIndex={-1}>
        <p>Drafts stay in this tab only. Saved context is used; live research and editorial checks are not automated.</p>
        {configuration?.unavailable ? <p>This preview has no writing backend. Generation is available on the configured Vercel site or local preview.</p>
          : configuration?.configured === false ? <p>Setup needed: add OPENAI_API_KEY to Vercel and redeploy, or to .env.local for local preview. Never put it in a VITE_ variable.</p> : null}
        <div aria-live="polite" role="status">
          {busy ? <p>Generating {session.generation.stage === "outline" ? "your outline" : "your article"}… This may take a few minutes. <Button type="button" size="sm" variant="secondary" onClick={cancel}>Cancel</Button></p> : null}
        </div>
        {session.generation?.status === "error" ? <div role="alert"><p>{session.generation.message}</p><Button type="button" size="sm" variant="secondary" onClick={() => generate(session.generation.stage)}>Try again</Button></div> : null}
      </div>
      <div aria-busy={busy} inert={busy ? true : undefined}>
        <WritingWorkspace dispatch={handleAction} scenario={liveWritingScenario(scenario, session)} session={session} />
      </div>
    </div>
  );
}
