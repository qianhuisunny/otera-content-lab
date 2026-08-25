import { useRef } from "react";

const viewItems = [
  { id: "context", label: "Context" },
  { id: "workflow", label: "Workflow" },
];

export function AppSidebar({ activeView, onViewChange, researchCutoff }) {
  const tabRefs = useRef([]);

  const handleTabKeyDown = (event, index) => {
    let nextIndex = null;

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + viewItems.length) % viewItems.length;
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % viewItems.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = viewItems.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    onViewChange(viewItems[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <aside className="app-sidebar" aria-label="Otera content navigation">
      <div className="workspace-identity">
        <span className="workspace-avatar" aria-hidden="true">
          OT
        </span>
        <span>
          <strong>Otera</strong>
          <small>Company context</small>
        </span>
      </div>

      <nav aria-label="Content Lab views">
        <div aria-label="Content Lab views" className="sidebar-nav" role="tablist">
          {viewItems.map((item, index) => {
            const selected = activeView === item.id;
            return (
              <button
                aria-controls="content-library"
                aria-selected={selected}
                id={`${item.id}-tab`}
                key={item.id}
                onClick={() => onViewChange(item.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-status">
          <span aria-hidden="true" />
          Local snapshot
        </span>
        <small>Research cutoff {researchCutoff}</small>
      </div>
    </aside>
  );
}
