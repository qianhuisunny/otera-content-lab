import { useEffect, useRef } from "react";
import { WritingSidebar } from "./writing/WritingSidebar.jsx";

const viewItems = [
  { id: "context", label: "Context" },
  { id: "workflow", label: "Workflow" },
  { id: "writing", label: "Writing" },
];

export function focusDestinationTabAfterWriting(previousView, currentView, tabNodes) {
  if (previousView !== "writing" || currentView === "writing") return false;

  const currentIndex = viewItems.findIndex((item) => item.id === currentView);
  const destinationTab = currentIndex >= 0 ? tabNodes?.[currentIndex] : null;
  if (typeof destinationTab?.focus !== "function") return false;

  destinationTab.focus();
  return true;
}

export function AppSidebar({
  activeView,
  onViewChange,
  onWritingStepChange,
  researchCutoff,
  writingSession,
}) {
  const tabRefs = useRef([]);
  const previousActiveViewRef = useRef(activeView);

  useEffect(() => {
    focusDestinationTabAfterWriting(
      previousActiveViewRef.current,
      activeView,
      tabRefs.current,
    );
    previousActiveViewRef.current = activeView;
  }, [activeView]);

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

      {activeView === "writing" && writingSession ? (
        <WritingSidebar onStepChange={onWritingStepChange} session={writingSession} />
      ) : null}

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
