import { useEffect, useRef } from "react";
import { BriefStep } from "./BriefStep.jsx";
import { DraftStep } from "./DraftStep.jsx";
import { OutlineStep } from "./OutlineStep.jsx";
import { ReviewStep } from "./ReviewStep.jsx";

export function focusWritingHeadingAfterStepChange(previousStep, currentStep, workspace) {
  if (previousStep === currentStep || !workspace) return false;

  const heading = workspace.querySelector("[data-writing-page-heading]");
  if (typeof heading?.focus !== "function") return false;

  heading.focus();
  return true;
}

export function WritingWorkspace({ session, dispatch }) {
  const workspaceRef = useRef(null);
  const previousStepRef = useRef(session.currentStep);
  const advance = () => dispatch({ type: "advance-step" });
  const goTo = (step) => dispatch({ type: "go-to-step", step });

  useEffect(() => {
    focusWritingHeadingAfterStepChange(
      previousStepRef.current,
      session.currentStep,
      workspaceRef.current,
    );
    previousStepRef.current = session.currentStep;
  }, [session.currentStep]);

  let screen;

  if (session.currentStep === "outline") {
    screen = (
      <OutlineStep
        dispatch={dispatch}
        onAdvance={advance}
        onBack={() => goTo("brief")}
        outline={session.outline}
      />
    );
  } else if (session.currentStep === "draft") {
    screen = <DraftStep onAdvance={advance} />;
  } else if (session.currentStep === "review") {
    screen = <ReviewStep articleHtml={session.articleHtml} dispatch={dispatch} />;
  } else {
    screen = <BriefStep brief={session.brief} dispatch={dispatch} onAdvance={advance} />;
  }

  return (
    <div className="writing-workspace" ref={workspaceRef}>
      {screen}
    </div>
  );
}
