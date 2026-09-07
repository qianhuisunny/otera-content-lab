import { CaretLeft } from "@phosphor-icons/react";
import { Button } from "@qianhui/ui";

export function WorkflowTopbar({ eyebrow, title, itemId, status, onExit }) {
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
        <span>{eyebrow}</span>
        <strong title={title}>{title}</strong>
      </div>
      <div className="writing-topbar__meta">
        <span className="writing-topbar__id">{itemId}</span>
        <span className="writing-topbar__status">STATUS: {status}</span>
      </div>
    </header>
  );
}
