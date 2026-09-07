import { Button } from "@qianhui/ui";
import { SALES_ENABLEMENT_WORKFLOW } from "../../data/salesEnablementWorkflow.js";
import { SalesEnablementStepNavigator } from "./SalesEnablementStepNavigator.jsx";
import { SalesEnablementScopeStep } from "./SalesEnablementScopeStep.jsx";
import { SalesEnablementRunStatus } from "./SalesEnablementRunStatus.jsx";

export function SalesEnablementWorkspace({ session, dispatch, onExit, onRunLive }) {
  const stage = SALES_ENABLEMENT_WORKFLOW.stages.find(({ id }) => id === session.activeStepId);

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
              session.requestStatus !== "idle" || session.retryBlocked}
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
      <div className="sales-enablement-body">
        <section aria-labelledby={`sales-stage-${stage.id}`}>
          {stage.id === "scope" ? (
            <SalesEnablementScopeStep input={session.input} dispatch={dispatch} />
          ) : (
            <section>
              <h2 id={`sales-stage-${stage.id}`}>{stage.label}</h2>
              <p>{stage.description}</p>
            </section>
          )}
        </section>
        <SalesEnablementRunStatus run={session.run} mode={session.mode} />
      </div>
    </section>
  );
}
