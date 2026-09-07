import { useEffect, useRef } from "react";
import { Check, Circle } from "@phosphor-icons/react";

const stateLabels = {
  active: "Current step",
  available: "Available",
  completed: "Completed",
  disabled: "Not available",
  locked: "Locked",
};

export function scrollActiveWorkflowStepIntoView(
  activeStep,
  viewport = typeof window === "undefined" ? undefined : window,
) {
  if (
    typeof activeStep?.closest !== "function"
    || typeof viewport?.matchMedia !== "function"
    || !viewport.matchMedia("(max-width: 56rem)").matches
  ) return false;

  const navigator = activeStep.closest(".writing-sidebar");
  if (
    typeof navigator?.scrollTo !== "function"
    || typeof navigator?.getBoundingClientRect !== "function"
    || typeof activeStep.getBoundingClientRect !== "function"
  ) return false;

  const navigatorRect = navigator.getBoundingClientRect();
  const activeStepRect = activeStep.getBoundingClientRect();
  const centeredLeft = navigator.scrollLeft + activeStepRect.left - navigatorRect.left
    - ((navigatorRect.width - activeStepRect.width) / 2);
  navigator.scrollTo({ behavior: "smooth", left: Math.max(0, centeredLeft) });
  return true;
}

export function WorkflowSidebar({
  activeStepId,
  ariaLabel,
  getStepState,
  idPrefix,
  onStepChange,
  phases,
}) {
  const activeStepRef = useRef(null);

  useEffect(() => {
    scrollActiveWorkflowStepIntoView(activeStepRef.current);
  }, [activeStepId]);

  return (
    <nav aria-label={ariaLabel} className="writing-sidebar">
      {phases.map((phase) => {
        const headingId = `${idPrefix}-phase-${phase.number}`;
        return (
          <section aria-labelledby={headingId} className="writing-phase" key={phase.number}>
            <h2 aria-label={`${phase.number} ${phase.label}`}
              className="writing-phase__heading" id={headingId}>
              <span className="writing-phase__number">{phase.number}</span>
              <span>{phase.label}</span>
            </h2>
            <ol className="writing-steps">
              {phase.steps.map((step) => {
                const state = getStepState(step);
                const isActive = state === "active";
                const isCompleted = state === "completed";
                const isDisabled = state === "disabled" || state === "locked";
                return (
                  <li className="writing-step" data-state={state} key={step.id}>
                    <button
                      aria-current={isActive ? "step" : undefined}
                      disabled={isDisabled}
                      onClick={() => onStepChange(step.id)}
                      ref={isActive ? activeStepRef : undefined}
                      type="button"
                    >
                      <span className="writing-step__marker" aria-hidden="true">
                        {isCompleted ? <Check size={15} weight="bold" /> : null}
                        {isActive ? <Circle size={10} weight="fill" /> : null}
                      </span>
                      <span className="writing-step__copy">
                        <strong>{step.label}</strong>
                        <small>{step.description}</small>
                        <span className="visually-hidden">{stateLabels[state]}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </nav>
  );
}
