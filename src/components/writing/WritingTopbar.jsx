import { CaretLeft } from "@phosphor-icons/react";
import { Button } from "@qianhui/ui";
import { WRITING_SCENARIO } from "../../data/writingScenario.js";

export function WritingTopbar({ onExit }) {
  return (
    <header className="writing-topbar">
      <Button
        className="writing-topbar__exit"
        onClick={onExit}
        size="sm"
        type="button"
        variant="secondary"
      >
        <CaretLeft aria-hidden="true" size={15} weight="bold" />
        Exit
      </Button>
      <div className="writing-topbar__title">
        <span>CREATING PAGE FOR</span>
        <strong title={WRITING_SCENARIO.title}>{WRITING_SCENARIO.title}</strong>
      </div>
      <div className="writing-topbar__meta">
        <span className="writing-topbar__id">{WRITING_SCENARIO.articleId}</span>
        <span className="writing-topbar__status">STATUS: {WRITING_SCENARIO.status}</span>
      </div>
    </header>
  );
}
