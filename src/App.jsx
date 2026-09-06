import { useMemo, useState } from "react";
import { Stack, Target } from "@phosphor-icons/react";
import { Button, SegmentedControl } from "@qianhui/ui";
import { AppSidebar } from "./components/AppSidebar";
import { ArtifactGrid } from "./components/ArtifactGrid";
import { CollectionHeader } from "./components/CollectionHeader";
import { EvidencePanel } from "./components/EvidencePanel";
import { WorkflowView } from "./components/WorkflowView";
import { filterArtifacts } from "./data/artifactUtils";
import { COMPANY_CATALOG, DEFAULT_COMPANY_ID } from "./data/companyCatalog";

const companySwitcherItems = COMPANY_CATALOG.map(({ id, name }) => ({
  value: id,
  label: name,
}));

export function App() {
  const [activeCompanyId, setActiveCompanyId] = useState(DEFAULT_COMPANY_ID);
  const [activeView, setActiveView] = useState("context");
  const [filter, setFilter] = useState("all");
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const company = COMPANY_CATALOG.find(({ id }) => id === activeCompanyId) ?? COMPANY_CATALOG[0];

  const visibleArtifacts = useMemo(
    () => filterArtifacts(company.artifacts, "", filter),
    [company, filter],
  );

  const handleCompanyChange = (nextCompanyId) => {
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

  return (
    <div className="qh-ui content-lab">
      <a className="skip-link" href="#content-library">
        Skip to active content
      </a>

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

      <div className="app-shell">
        <AppSidebar
          activeView={activeView}
          company={company}
          onViewChange={setActiveView}
        />

        <main className="content-library" id="content-library" tabIndex={-1}>
          <div
            aria-labelledby={`${activeView}-tab`}
            id="content-view-panel"
            role="tabpanel"
          >
            {activeView === "workflow" ? (
              <WorkflowView />
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
