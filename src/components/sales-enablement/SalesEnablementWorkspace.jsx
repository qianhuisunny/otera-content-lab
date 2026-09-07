import { useEffect, useRef } from "react";
import { SALES_ENABLEMENT_WORKFLOW } from "../../data/salesEnablementWorkflow.js";
import { WritingPageHeader } from "../writing/WritingPageHeader.jsx";
import {
  focusWritingHeadingAfterStepChange,
  focusWritingHeadingOnEntry,
} from "../writing/WritingWorkspace.jsx";
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

export function SalesEnablementWorkspace({ session, dispatch, onRunLive }) {
  const workspaceRef = useRef(null);
  const previousStepRef = useRef(session.activeStepId);
  const stage = SALES_ENABLEMENT_WORKFLOW.stages.find(({ id }) => id === session.activeStepId);
  const StageView = stageViews[stage.view];
  // The previous artifact remains in session while a create request is pending.
  const run = session.requestStatus === "creating" || (session.mode === "live" && session.run.id.startsWith("example_")) ? null : session.run;
  const hasInspector = Boolean(run?.artifact && ["research", "review"].includes(stage.id));
  const retrySeconds = session.cooldown ? Math.max(0, Math.ceil((session.cooldown.until - Date.now()) / 1000)) :
    session.retryBlocked ? session.error?.retryAfterSeconds : 0;
  const retryBlocked = session.retryBlocked || retrySeconds > 0;
  const busy = ["creating", "polling"].includes(session.requestStatus);

  useEffect(() => {
    focusWritingHeadingAfterStepChange(
      previousStepRef.current,
      session.activeStepId,
      workspaceRef.current,
    );
    previousStepRef.current = session.activeStepId;
  }, [session.activeStepId]);

  useEffect(() => {
    focusWritingHeadingOnEntry(workspaceRef.current);
  }, []);

  const stageContent = stage.view === "scope" ? (
    <StageView dispatch={dispatch} input={session.input} mode={session.mode}
      onRunLive={onRunLive} provider={session.provider} requestStatus={session.requestStatus}
      retryBlocked={retryBlocked} />
  ) : (
    <>
      {!run?.artifact ? <p className="sales-empty">This view will populate after the run completes.</p> : null}
      <StageView workflow={SALES_ENABLEMENT_WORKFLOW} run={run} />
    </>
  );

  return (
    <section className="sales-enablement-shell" data-sales-enablement-workspace>
      <SalesEnablementRunStatus run={run} mode={session.mode} error={session.error}
        provider={session.provider} requestStatus={session.requestStatus}
        retryBlocked={retryBlocked} retrySeconds={retrySeconds} />
      <div aria-busy={busy} inert={busy ? true : undefined}>
        <div className="writing-workspace" ref={workspaceRef}>
          <section className="writing-page">
            <WritingPageHeader description={stage.description} id={`sales-stage-${stage.id}`}
              meta={stage.view === "research" ? `${SALES_ENABLEMENT_WORKFLOW.workstreams.length} parallel specialists` : stage.view === "scope" ? "Brief" : "Working draft"}
              title={stage.label} />
            {hasInspector ? (
              <div className="review-layout">
                <div className="sales-enablement-main">{stageContent}</div>
                <SalesEnablementInspector artifact={run.artifact} activeStepId={stage.id} />
              </div>
            ) : stageContent}
          </section>
        </div>
      </div>
    </section>
  );
}
