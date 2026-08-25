import { useMemo, useState } from "react";
import {
  ArrowsInSimple,
  ArrowsOutSimple,
  Stack,
  Target,
} from "@phosphor-icons/react";
import { Button } from "@qianhui/ui";
import { AppSidebar } from "./components/AppSidebar";
import { ArtifactGrid } from "./components/ArtifactGrid";
import { CollectionHeader } from "./components/CollectionHeader";
import { EvidencePanel } from "./components/EvidencePanel";
import { filterArtifacts } from "./data/artifactUtils";
import { COLLECTION_STATS, OTERA_ARTIFACTS } from "./data/oteraArtifacts";

const sectionDefinitions = [
  {
    id: "company",
    title: "Company & market",
    description: "What Otera is, where it fits, who should buy, and what should disqualify an opportunity.",
    artifactIds: ["company-overview", "icp-context"],
  },
  {
    id: "personas",
    title: "Audience & buying committee",
    description: "The committee map plus seven role-level dossiers with jobs, incentives, objections, evidence needs, and messaging guidance.",
    artifactIds: [
      "persona-index",
      "economic-buyer",
      "executive-champion",
      "functional-champion",
      "technical-evaluator",
      "risk-approval-gate",
      "operational-user",
      "transformation-partner",
    ],
  },
];

export function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const visibleArtifacts = useMemo(
    () => filterArtifacts(OTERA_ARTIFACTS, query, filter),
    [filter, query],
  );
  const visibleIdSet = useMemo(
    () => new Set(visibleArtifacts.map((artifact) => artifact.id)),
    [visibleArtifacts],
  );

  const toggleArtifact = (id) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandVisible = () => {
    setExpandedIds((current) => new Set([...current, ...visibleIdSet]));
  };

  const collapseAll = () => setExpandedIds(new Set());

  const resetFilters = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <div className="qh-ui content-lab">
      <a className="skip-link" href="#content-library">
        Skip to context library
      </a>

      <header className="app-topbar">
        <div className="app-brand">
          <span className="app-mark" aria-hidden="true">
            <Stack size={17} weight="bold" />
          </span>
          <strong>Content Lab</strong>
          <span aria-hidden="true">/</span>
          <span>Otera context library</span>
        </div>
        <div className="topbar-actions">
          <span className="snapshot-count">{COLLECTION_STATS.artifacts} local artifacts</span>
          <Button variant="secondary" size="sm" type="button" onClick={expandVisible}>
            <ArrowsOutSimple size={15} aria-hidden="true" />
            Expand all
          </Button>
          <Button variant="secondary" size="sm" type="button" onClick={collapseAll}>
            <ArrowsInSimple size={15} aria-hidden="true" />
            Collapse all
          </Button>
        </div>
      </header>

      <div className="app-shell">
        <AppSidebar researchCutoff={COLLECTION_STATS.researchCutoff} />

        <main className="content-library" id="content-library">
          <CollectionHeader
            filter={filter}
            onFilterChange={setFilter}
            onQueryChange={setQuery}
            query={query}
            stats={COLLECTION_STATS}
            visibleCount={visibleArtifacts.length}
          />

          {visibleArtifacts.length ? (
            <div className="artifact-sections">
              {sectionDefinitions.map((section) => (
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

          <EvidencePanel researchCutoff={COLLECTION_STATS.researchCutoff} />
        </main>
      </div>
    </div>
  );
}

export default App;
