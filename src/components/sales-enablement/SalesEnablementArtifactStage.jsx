export const proofLabels = {
  verified: "Verified", company_claim: "Company claim", inference: "Inference", unresolved: "Needs evidence",
};

export function SalesEnablementArtifactStage({ workflow, view, run, children }) {
  const stage = workflow.stages.find((item) => item.view === view);
  return (
    <section aria-labelledby={`sales-stage-${stage.id}`}>
      <div className="sales-stage-heading">
        <span className="eyebrow">{view === "research" ? `${workflow.workstreams.length} parallel specialists` : "Working draft"}</span>
        <h2 id={`sales-stage-${stage.id}`}>{stage.label}</h2>
        <p>{stage.description}</p>
      </div>
      {!run?.artifact ? <p className="sales-empty">This view will populate after the run completes.</p> : null}
      {children}
    </section>
  );
}
