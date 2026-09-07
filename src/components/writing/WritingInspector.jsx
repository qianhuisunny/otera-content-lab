import { CheckCircle, Circle, Scales } from "@phosphor-icons/react";
import { CoveragePanel } from "./CoveragePanel.jsx";

const OUTLINE_CRITERIA = [
  {
    label: "Evidence-aware",
    description: "Each section gives the draft a clear evidence posture.",
  },
  {
    label: "Worth differentiating",
    description: "The angle creates a useful point of view for the audience.",
  },
  {
    label: "Operational depth",
    description: "The outline makes room for practical detail and decisions.",
  },
];

export function WritingInspector({ mode, items }) {
  const titleId = mode === "review"
    ? "coverage-title"
    : "writing-outline-inspector-title";

  return (
    <aside
      aria-labelledby={titleId}
      className="writing-inspector"
      data-writing-inspector=""
    >
      {mode === "review" ? (
        <CoveragePanel items={items} />
      ) : (
        <>
          <div className="writing-inspector__header">
            <Scales aria-hidden="true" size={22} weight="duotone" />
            <div>
              <p className="writing-inspector__eyebrow">Inspector</p>
              <h2 id={titleId}>LLM as a Judge</h2>
            </div>
          </div>
          <p className="writing-inspector__summary">
            A read-only evaluation of the current outline before drafting begins.
          </p>
          <ul aria-label="Outline evaluation criteria" className="writing-inspector__criteria">
            {OUTLINE_CRITERIA.map((criterion) => (
              <li key={criterion.label}>
                <CheckCircle aria-hidden="true" size={18} weight="fill" />
                <span>
                  <strong>{criterion.label}</strong>
                  <small>{criterion.description}</small>
                </span>
              </li>
            ))}
          </ul>
          <p className="writing-inspector__status">
            <Circle aria-hidden="true" size={12} weight="fill" />
            Outline ready for drafting
          </p>
        </>
      )}
    </aside>
  );
}
