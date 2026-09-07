import { SALES_ENABLEMENT_WORKFLOW } from "../../data/salesEnablementWorkflow.js";
import { WorkflowTopbar } from "../writing/WorkflowTopbar.jsx";
import { getSalesEnablementStatus } from "./SalesEnablementRunStatus.jsx";

export function SalesEnablementTopbar({ session, onExit }) {
  const runId = session.mode === "example" || session.run?.id?.startsWith("example_")
    ? session.mode === "example" ? "Example run" : "Live run"
    : session.run?.id ?? "Live run";
  return (
    <WorkflowTopbar eyebrow="CREATING DECK FOR" itemId={runId} onExit={onExit}
      status={getSalesEnablementStatus(session)} title={SALES_ENABLEMENT_WORKFLOW.title} />
  );
}
