import { useEffect, useRef } from "react";
import { BriefStep } from "./BriefStep.jsx";
import { DraftStep } from "./DraftStep.jsx";
import { OutlineStep } from "./OutlineStep.jsx";
import { ReviewStep } from "./ReviewStep.jsx";
import { WritingInspector } from "./WritingInspector.jsx";
import { WRITING_SCENARIO } from "../../data/writingScenario.js";

export function focusWritingHeadingOnEntry(workspace) {
  if (!workspace) return false;

  const heading = workspace.querySelector("[data-writing-page-heading]");
  if (typeof heading?.focus !== "function") return false;

  heading.focus({ preventScroll: true });
  return true;
}

export function focusWritingHeadingAfterStepChange(previousStep, currentStep, workspace) {
  if (previousStep === currentStep || !workspace) return false;

  const heading = workspace.querySelector("[data-writing-page-heading]");
  if (typeof heading?.focus !== "function") return false;

  heading.focus();
  return true;
}

export function WritingWorkspace({ session, dispatch, scenario = WRITING_SCENARIO }) {
  const workspaceRef = useRef(null);
  const previousStepRef = useRef(session.currentStep);
  const advance = () => dispatch({ type: "advance-step" });
  const goTo = (step) => dispatch({ type: "go-to-step", step });
  const inspectorMode = session.currentStep === "outline"
    ? "outline"
    : session.currentStep === "review"
      ? "review"
      : null;

  useEffect(() => {
    focusWritingHeadingAfterStepChange(
      previousStepRef.current,
      session.currentStep,
      workspaceRef.current,
    );
    previousStepRef.current = session.currentStep;
  }, [session.currentStep]);

  useEffect(() => {
    focusWritingHeadingOnEntry(workspaceRef.current);
  }, []);

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
    screen = <DraftStep onAdvance={advance} scenario={scenario} />;
  } else if (session.currentStep === "review") {
    screen = (
      <ReviewStep
        articleHtml={session.articleHtml}
        dispatch={dispatch}
      />
    );
  } else {
    screen = (
      <BriefStep
        audienceOptions={scenario.brief.audiences}
        brief={session.brief}
        dispatch={dispatch}
        onAdvance={advance}
      />
    );
  }

  return (
    <div
      className="writing-workspace writing-shell"
      data-has-inspector={Boolean(inspectorMode)}
      ref={workspaceRef}
    >
      <div className="writing-detail">{screen}</div>
      {inspectorMode ? (
        <WritingInspector items={scenario.coverageItems} mode={inspectorMode} />
      ) : null}
    </div>
  );
}
