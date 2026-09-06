import { CaretLeft } from "@phosphor-icons/react";
import { Button } from "@qianhui/ui";
import { WRITING_SCENARIO } from "../../data/writingScenario.js";

export function WritingTopbar({ onExit, scenario = WRITING_SCENARIO }) {
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
        <strong title={scenario.title}>{scenario.title}</strong>
      </div>
      <div className="writing-topbar__meta">
        <span className="writing-topbar__id">{scenario.articleId}</span>
        <span className="writing-topbar__status">STATUS: {scenario.status}</span>
      </div>
    </header>
  );
}
