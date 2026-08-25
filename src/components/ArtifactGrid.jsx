import { ArtifactCard } from "./ArtifactCard";

export function ArtifactGrid({
  artifacts,
  description,
  expandedIds,
  id,
  onToggle,
  title,
}) {
  if (artifacts.length === 0) return null;

  return (
    <section className="artifact-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="artifact-section__heading">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="artifact-grid">
        {artifacts.map((artifact) => (
          <ArtifactCard
            artifact={artifact}
            expanded={expandedIds.has(artifact.id)}
            key={artifact.id}
            onToggle={() => onToggle(artifact.id)}
          />
        ))}
      </div>
    </section>
  );
}
