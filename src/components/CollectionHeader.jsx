import { SegmentedControl, StatCard } from "@qianhui/ui";

const filterItems = [
  { value: "all", label: "All" },
  { value: "company_context", label: "Company" },
  { value: "icp_context", label: "ICP" },
  { value: "personas", label: "Personas" },
];

export function CollectionHeader({
  filter,
  onFilterChange,
  stats,
  visibleCount,
}) {
  return (
    <header className="collection-header" id="overview">
      <div className="collection-heading">
        <div>
          <p className="section-kicker">Company research library</p>
          <h1>Otera context artifacts</h1>
          <p className="collection-intro">
            A writing-ready source of truth for company narrative, ideal customer profile,
            buying committee, and role-level persona depth.
          </p>
        </div>
      </div>

      <div className="collection-stats" aria-label="Collection summary">
        <StatCard
          className="collection-stat"
          eyebrow="Artifacts"
          value={String(stats.artifacts)}
          description="Complete local files"
        />
        <StatCard
          className="collection-stat"
          eyebrow="Source depth"
          value={stats.lines.toLocaleString("en-US")}
          description="Lines of context"
        />
        <StatCard
          className="collection-stat"
          eyebrow="Personas"
          value={String(stats.personas)}
          description="Role-level dossiers"
        />
      </div>

      <div className="collection-toolbar" aria-label="Artifact filters">
        <SegmentedControl
          ariaLabel="Filter context artifact type"
          className="artifact-filter"
          items={filterItems}
          value={filter}
          onValueChange={onFilterChange}
        />
        <p className="result-count" aria-live="polite">
          {visibleCount} shown
        </p>
      </div>
    </header>
  );
}
