import { useEffect, useRef } from "react";
import { WritingSidebar } from "./writing/WritingSidebar.jsx";
import { SalesEnablementSidebar } from "./sales-enablement/SalesEnablementSidebar.jsx";

const viewItems = [
  { id: "context", label: "Context" },
  { id: "workflow", label: "Workflow" },
];

export function getNextViewIndex(key, index) {
  if (key === "ArrowLeft" || key === "ArrowUp") {
    return (index - 1 + viewItems.length) % viewItems.length;
  }

  if (key === "ArrowRight" || key === "ArrowDown") {
    return (index + 1) % viewItems.length;
  }

  if (key === "Home") return 0;
  if (key === "End") return viewItems.length - 1;

  return null;
}

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
  company,
  onViewChange,
  onWritingStepChange,
  onSalesEnablementStepChange,
  salesEnablementSession,
  writingSession,
}) {
  const tabRefs = useRef([]);
  const previousActiveViewRef = useRef(activeView);
  const workflowSelected = ["workflow", "writing", "sales-enablement"].includes(activeView);

  useEffect(() => {
    focusDestinationTabAfterWriting(
      previousActiveViewRef.current,
      activeView,
      tabRefs.current,
    );
    previousActiveViewRef.current = activeView;
  }, [activeView]);

  const handleTabKeyDown = (event, index) => {
    const nextIndex = getNextViewIndex(event.key, index);

    if (nextIndex === null) return;
    event.preventDefault();
    onViewChange(viewItems[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <aside className="app-sidebar" aria-label={`${company.name} content navigation`}>
      <div className="workspace-identity">
        <span className="workspace-avatar" aria-hidden="true">
          {company.initials}
        </span>
        <span>
          <strong>{company.name}</strong>
          <small>{company.sidebarSubtitle}</small>
        </span>
      </div>

      <nav aria-label="Content Lab views">
        <div aria-label="Content Lab views" className="sidebar-nav" role="tablist">
          {viewItems.map((item, index) => {
            const selected = item.id === "workflow" ? workflowSelected : activeView === item.id;
            return (
              <button
                aria-controls="content-view-panel"
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

      {activeView === "sales-enablement" && salesEnablementSession ? (
        <SalesEnablementSidebar onStepChange={onSalesEnablementStepChange}
          session={salesEnablementSession} />
      ) : null}

      <div className="sidebar-footer">
        <span className="sidebar-status">
          <span aria-hidden="true" />
          Local snapshot
        </span>
        <small>Research cutoff {company.stats.researchCutoff}</small>
      </div>
    </aside>
  );
}
