import { CalendarBlank, CheckCircle, ShieldCheck } from "@phosphor-icons/react";

export function EvidencePanel({ company }) {
  const evidenceRules = [
    {
      icon: CheckCircle,
      title: "Attribute outcome claims",
      description: "Keep customer results attached to their named public source.",
    },
    {
      icon: ShieldCheck,
      title: "Label researcher inference",
      description: `Do not present synthesized role or market conclusions as ${company.name} claims.`,
    },
    {
      icon: CalendarBlank,
      title: "Reverify time-sensitive facts",
      description: "Recheck funding, leadership, product, and market facts before publishing.",
    },
  ];

  return (
    <section className="evidence-panel" id="evidence" aria-labelledby="evidence-title">
      <div className="evidence-panel__intro">
        <p className="section-kicker">Writing guardrails</p>
        <h2 id="evidence-title">Evidence posture</h2>
        <p>{company.evidenceDescription}</p>
        <small>Research cutoff {company.stats.researchCutoff}</small>
      </div>
      <div className="evidence-rules">
        {evidenceRules.map(({ description, icon: Icon, title }) => (
          <div className="evidence-rule" key={title}>
            <Icon size={20} weight="regular" aria-hidden="true" />
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
