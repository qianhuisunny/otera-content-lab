import { SALES_ENABLEMENT_WORKFLOW } from "../../data/salesEnablementWorkflow.js";
import { WorkflowSidebar } from "../writing/WorkflowSidebar.jsx";

const stageById = Object.fromEntries(SALES_ENABLEMENT_WORKFLOW.stages.map((stage) => [stage.id, stage]));
const SALES_ENABLEMENT_PHASES = [
  { number: "01", label: "BRIEF IT", steps: [stageById.scope] },
  { number: "02", label: "BUILD IT", steps: [stageById.research, stageById.narrative, stageById.asset] },
  { number: "03", label: "REVIEW IT", steps: [stageById.review] },
];

function getSalesStepState(session, step) {
  if (session.activeStepId === step.id) return "active";
  const run = session.requestStatus === "creating"
    || (session.mode === "live" && session.run?.id?.startsWith("example_")) ? null : session.run;
  const status = run?.stages?.find(({ id }) => id === step.id)?.status;
  if (status === "complete" || status === "completed") return "completed";
  if (status === "pending") return "locked";
  return "available";
}

export function SalesEnablementSidebar({ session, onStepChange }) {
  return (
    <WorkflowSidebar activeStepId={session.activeStepId} ariaLabel="Sales enablement workflow"
      getStepState={(step) => getSalesStepState(session, step)} idPrefix="sales-enablement"
      onStepChange={onStepChange} phases={SALES_ENABLEMENT_PHASES} />
  );
}
