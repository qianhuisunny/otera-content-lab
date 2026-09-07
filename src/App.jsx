import { useCallback, useMemo, useReducer, useRef, useState } from "react";
import { Stack, Target } from "@phosphor-icons/react";
import { Button, SegmentedControl } from "@qianhui/ui";
import { AppSidebar } from "./components/AppSidebar";
import { ArtifactGrid } from "./components/ArtifactGrid";
import { CollectionHeader } from "./components/CollectionHeader";
import { EvidencePanel } from "./components/EvidencePanel";
import { WorkflowView } from "./components/WorkflowView";
import { SalesEnablementRuntime } from "./components/sales-enablement/SalesEnablementRuntime.jsx";
import { SalesEnablementTopbar } from "./components/sales-enablement/SalesEnablementTopbar.jsx";
import { WritingTopbar } from "./components/writing/WritingTopbar";
import { WritingRuntime } from "./components/writing/WritingRuntime";
import { filterArtifacts } from "./data/artifactUtils";
import { COMPANY_CATALOG, DEFAULT_COMPANY_ID } from "./data/companyCatalog";
import { getWritingScenario } from "./data/writingScenario";
import { createLiveWritingSession, writingReducer } from "./data/writingSession";
import { liveWritingScenario } from "./data/writingGeneration";
import { createSalesEnablementSession, salesEnablementReducer } from "./data/salesEnablementSession.js";

const companySwitcherItems = COMPANY_CATALOG.map(({ id, name }) => ({
  value: id,
  label: name,
}));

export function resetWritingEntryScroll(
  viewport = typeof window === "undefined" ? undefined : window,
) {
  if (typeof viewport?.scrollTo !== "function") return false;

  viewport.scrollTo({ behavior: "instant", left: 0, top: 0 });
  return true;
}

export function App({
  initialCompanyId = DEFAULT_COMPANY_ID,
  initialView = "context",
}) {
  const [activeCompanyId, setActiveCompanyId] = useState(
    initialView === "sales-enablement" ? "retell" : initialCompanyId,
  );
  const [activeView, setActiveView] = useState(initialView);
  const [filter, setFilter] = useState("all");
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const restoreSalesEntryFocus = useRef(false);
  const salesEnablementEntryRef = useCallback((node) => {
    if (node && restoreSalesEntryFocus.current) {
      restoreSalesEntryFocus.current = false;
      node.focus();
    }
  }, []);
  const [writingSession, dispatchWriting] = useReducer(
    writingReducer,
    initialCompanyId,
    createLiveWritingSession,
  );
  const [salesEnablementSession, dispatchSalesEnablement] = useReducer(
    salesEnablementReducer,
    undefined,
    createSalesEnablementSession,
  );
  const company = COMPANY_CATALOG.find(({ id }) => id === activeCompanyId) ?? COMPANY_CATALOG[0];
  const writingScenario = getWritingScenario(writingSession.companyId);

  const visibleArtifacts = useMemo(
    () => filterArtifacts(company.artifacts, "", filter),
    [company, filter],
  );

  const handleCompanyChange = (nextCompanyId) => {
    if (activeView === "sales-enablement" && nextCompanyId !== "retell") {
      setActiveView("workflow");
    }
    setActiveCompanyId(nextCompanyId);
    setFilter("all");
    setExpandedIds(new Set());
  };

  const toggleArtifact = (id) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetFilters = () => setFilter("all");
  const openLongFormWriter = () => {
    resetWritingEntryScroll();
    dispatchWriting({ type: "open-company", companyId: activeCompanyId });
    setActiveView("writing");
  };
  const handleOpenSalesEnablement = () => {
    setActiveCompanyId("retell");
    setActiveView("sales-enablement");
    resetWritingEntryScroll();
  };
  const handleExitSalesEnablement = () => {
    restoreSalesEntryFocus.current = true;
    setActiveView("workflow");
  };

  return (
    <div className="qh-ui content-lab">
      <a className="skip-link" href="#content-library">
        Skip to active content
      </a>

      {activeView === "writing" ? (
        <WritingTopbar
          onExit={() => setActiveView("workflow")}
          scenario={liveWritingScenario(writingScenario, writingSession)}
        />
      ) : activeView === "sales-enablement" ? (
        <SalesEnablementTopbar onExit={handleExitSalesEnablement} session={salesEnablementSession} />
      ) : (
        <header className="app-topbar">
          <div className="app-brand">
            <span className="app-mark" aria-hidden="true">
              <Stack size={17} weight="bold" />
            </span>
            <strong>Content Lab</strong>
            <span aria-hidden="true">/</span>
            <span>{company.topbarLabel}</span>
          </div>
          <SegmentedControl
            ariaLabel="Select company context"
            className="company-switcher"
            items={companySwitcherItems}
            value={activeCompanyId}
            onValueChange={handleCompanyChange}
          />
        </header>
      )}

      <div className="app-shell">
        <AppSidebar
          activeView={activeView}
          company={company}
          onViewChange={setActiveView}
          onWritingStepChange={(step) => dispatchWriting({ type: "go-to-step", step })}
          onSalesEnablementStepChange={(stepId) => dispatchSalesEnablement({ type: "select-step", stepId })}
          salesEnablementSession={salesEnablementSession}
          writingSession={writingSession}
        />

        <main
          className={`content-library${["writing", "sales-enablement"].includes(activeView) ? " writing-main" : ""}`}
          id="content-library"
          tabIndex={-1}
        >
          <div
            aria-labelledby={["writing", "sales-enablement"].includes(activeView) ? "workflow-tab" : `${activeView}-tab`}
            id="content-view-panel"
            role="tabpanel"
          >
            {activeView === "workflow" ? (
              <WorkflowView
                onOpenLongForm={openLongFormWriter}
                onOpenSalesEnablement={handleOpenSalesEnablement}
                salesEnablementEntryRef={salesEnablementEntryRef}
              />
            ) : activeView === "writing" ? (
              <WritingRuntime
                dispatch={dispatchWriting}
                scenario={writingScenario}
                session={writingSession}
              />
            ) : activeView === "sales-enablement" ? (
              <SalesEnablementRuntime
                session={salesEnablementSession}
                dispatch={dispatchSalesEnablement}
                onExit={handleExitSalesEnablement}
              />
            ) : (
              <>
                <CollectionHeader
                  company={company}
                  filter={filter}
                  onFilterChange={setFilter}
                  stats={company.stats}
                  visibleCount={visibleArtifacts.length}
                />
                {visibleArtifacts.length ? (
                  <div className="artifact-sections">
                    {company.sections.map((section) => (
                      <ArtifactGrid
                        {...section}
                        artifacts={visibleArtifacts.filter((artifact) =>
                          section.artifactIds.includes(artifact.id),
                        )}
                        expandedIds={expandedIds}
                        key={section.id}
                        onToggle={toggleArtifact}
                      />
                    ))}
                  </div>
                ) : (
                  <section className="empty-state" aria-live="polite">
                    <Target size={28} weight="regular" aria-hidden="true" />
                    <h2>No matching context</h2>
                    <p>Try a broader role, workflow, evidence type, or artifact category.</p>
                    <Button variant="secondary" size="sm" type="button" onClick={resetFilters}>
                      Reset filters
                    </Button>
                  </section>
                )}
                <EvidencePanel company={company} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
