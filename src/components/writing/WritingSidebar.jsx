import { WRITING_PHASES, WRITING_STEP_ORDER } from "../../data/writingScenario.js";
import { canVisitWritingStep } from "../../data/writingSession.js";
import { WorkflowSidebar, scrollActiveWorkflowStepIntoView } from "./WorkflowSidebar.jsx";

function getStepState(session, step) {
  const stepIndex = WRITING_STEP_ORDER.indexOf(step.id);
  const isActive = session.currentStep === step.id;

  if (isActive) return "active";
  if (step.disabled) return "disabled";
  if (stepIndex >= 0 && stepIndex < session.furthestStepIndex) return "completed";
  if (!canVisitWritingStep(session, step.id)) return "locked";
  return "available";
}

export function scrollActiveWritingStepIntoView(
  activeStep,
  viewport = typeof window === "undefined" ? undefined : window,
) {
  return scrollActiveWorkflowStepIntoView(activeStep, viewport);
}

export function WritingSidebar({ session, onStepChange }) {
  return (
    <WorkflowSidebar activeStepId={session.currentStep} ariaLabel="Writing workflow"
      getStepState={(step) => getStepState(session, step)} idPrefix="writing"
      onStepChange={onStepChange} phases={WRITING_PHASES} />
  );
}
