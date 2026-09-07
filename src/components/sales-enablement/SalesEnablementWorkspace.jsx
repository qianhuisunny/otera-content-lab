import { Button } from "@qianhui/ui";
import { SALES_ENABLEMENT_WORKFLOW } from "../../data/salesEnablementWorkflow.js";
import { SalesEnablementStepNavigator } from "./SalesEnablementStepNavigator.jsx";
import { SalesEnablementScopeStep } from "./SalesEnablementScopeStep.jsx";
import { SalesEnablementRunStatus } from "./SalesEnablementRunStatus.jsx";
import { SalesEnablementResearchStep } from "./SalesEnablementResearchStep.jsx";
import { SalesEnablementNarrativeStep } from "./SalesEnablementNarrativeStep.jsx";
import { SalesEnablementDeckPreview } from "./SalesEnablementDeckPreview.jsx";
import { SalesEnablementReviewStep } from "./SalesEnablementReviewStep.jsx";
import { SalesEnablementInspector } from "./SalesEnablementInspector.jsx";

const stageViews = {
  scope: SalesEnablementScopeStep, research: SalesEnablementResearchStep,
  narrative: SalesEnablementNarrativeStep, deck: SalesEnablementDeckPreview, review: SalesEnablementReviewStep,
};

export function SalesEnablementWorkspace({ session, dispatch, onExit, onRunLive }) {
  const stage = SALES_ENABLEMENT_WORKFLOW.stages.find(({ id }) => id === session.activeStepId);
  const StageView = stageViews[stage.view];
  // The previous artifact remains in session while a create request is pending.
  const run = session.requestStatus === "creating" || (session.mode === "live" && session.run.id.startsWith("example_")) ? null : session.run;
  const hasInspector = Boolean(run?.artifact && ["research", "review"].includes(stage.id));
  const retrySeconds = session.cooldown ? Math.max(0, Math.ceil((session.cooldown.until - Date.now()) / 1000)) :
    session.retryBlocked ? session.error?.retryAfterSeconds : 0;
  const retryBlocked = session.retryBlocked || retrySeconds > 0;

  return (
    <section className="sales-enablement-shell" data-sales-enablement-workspace>
      <header className="sales-enablement-header">
        <Button variant="secondary" type="button" onClick={onExit}>Back to Workflow</Button>
        <div>
          <span className="eyebrow">Retell AI · Skill-powered workflow</span>
          <h1>{SALES_ENABLEMENT_WORKFLOW.title}</h1>
        </div>
        <div className="sales-mode-actions">
          <Button variant={session.mode === "example" ? "primary" : "secondary"}
            type="button" onClick={() => dispatch({ type: "show-example" })}>Example run</Button>
          <Button type="button" disabled={!session.provider.configured ||
              session.requestStatus !== "idle" || retryBlocked}
            onClick={onRunLive}>Run live</Button>
          {session.provider.checked && !session.provider.configured ? (
            <small>Live execution is not configured. Example run stays available.</small>
          ) : null}
        </div>
      </header>
      <SalesEnablementStepNavigator
        stages={SALES_ENABLEMENT_WORKFLOW.stages}
        activeStepId={session.activeStepId}
        onSelect={(stepId) => dispatch({ type: "select-step", stepId })}
      />
      <SalesEnablementRunStatus run={run} mode={session.mode} error={session.error}
        requestStatus={session.requestStatus} retryBlocked={retryBlocked} retrySeconds={retrySeconds} />
      <div className={`sales-enablement-body${hasInspector ? "" : " is-wide"}`}>
        <div className="sales-enablement-main">
          {stage.view === "scope" ? <StageView input={session.input} dispatch={dispatch} /> :
            <StageView workflow={SALES_ENABLEMENT_WORKFLOW} run={run} />}
        </div>
        <SalesEnablementInspector artifact={run?.artifact} activeStepId={stage.id} />
      </div>
    </section>
  );
}
