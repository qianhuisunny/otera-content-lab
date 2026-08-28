import { BriefStep } from "./BriefStep.jsx";
import { DraftStep } from "./DraftStep.jsx";
import { OutlineStep } from "./OutlineStep.jsx";
import { ReviewStep } from "./ReviewStep.jsx";

export function WritingWorkspace({ session, dispatch }) {
  const advance = () => dispatch({ type: "advance-step" });
  const goTo = (step) => dispatch({ type: "go-to-step", step });

  if (session.currentStep === "outline") {
    return (
      <OutlineStep
        dispatch={dispatch}
        onAdvance={advance}
        onBack={() => goTo("brief")}
        outline={session.outline}
      />
    );
  }

  if (session.currentStep === "draft") {
    return <DraftStep onAdvance={advance} />;
  }

  if (session.currentStep === "review") {
    return <ReviewStep articleHtml={session.articleHtml} dispatch={dispatch} />;
  }

  return <BriefStep brief={session.brief} dispatch={dispatch} onAdvance={advance} />;
}
