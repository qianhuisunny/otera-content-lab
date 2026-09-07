import { useRef } from "react";

export function getNextSalesStepIndex(key, index, count) {
  if (["ArrowRight", "ArrowDown"].includes(key)) return (index + 1) % count;
  if (["ArrowLeft", "ArrowUp"].includes(key)) return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}

export function SalesEnablementStepNavigator({ stages, activeStepId, onSelect }) {
  const refs = useRef([]);
  const onKeyDown = (event, index) => {
    const next = getNextSalesStepIndex(event.key, index, stages.length);
    if (next === null) return;
    event.preventDefault();
    onSelect(stages[next].id);
    refs.current[next]?.focus();
  };

  return (
    <ol className="sales-steps" aria-label="Sales enablement stages">
      {stages.map((stage, index) => (
        <li key={stage.id}>
          <button
            ref={(node) => { refs.current[index] = node; }}
            type="button"
            aria-current={stage.id === activeStepId ? "step" : undefined}
            tabIndex={stage.id === activeStepId ? 0 : -1}
            onClick={() => onSelect(stage.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span>{index + 1}</span>
            {stage.label}
          </button>
        </li>
      ))}
    </ol>
  );
}
