import { SalesEnablementArtifactStage } from "./SalesEnablementArtifactStage.jsx";

const statusLabels = { queued: "Queued", running: "In progress", complete: "Complete", failed: "Needs attention" };

export function SalesEnablementResearchStep({ workflow, run }) {
  return (
    <SalesEnablementArtifactStage workflow={workflow} run={run} view="research">
      <div className="sales-workstreams">
        {workflow.workstreams.map((stream) => {
          const status = run?.workstreams.find(({ id }) => id === stream.id);
          const finding = run?.artifact?.research.find(({ id }) => id === stream.id);
          return (
            <details key={stream.id} data-sales-workstream={stream.id} open={status?.status === "failed"}>
              <summary>
                <span className={`sales-status-dot is-${status?.status ?? "queued"}`} aria-hidden="true" />
                <span className="sales-workstream-label"><strong>{stream.label}</strong><small>{stream.activity}</small></span>
                <span className="sales-workstream-status">{statusLabels[status?.status ?? "queued"]}<small>{status?.evidenceCount ?? 0} evidence</small></span>
              </summary>
              <div className="sales-workstream-detail">
                <p>{finding?.summary || status?.summary || "Waiting for a normalized finding summary."}</p>
                {finding?.evidence.map((item) => (
                  <article className="sales-evidence" key={item.id}>
                    <strong>{item.claim}</strong>
                    <p className="sales-meta">{item.evidenceClass.replaceAll("_", " ")} · {item.confidence} confidence</p>
                    <dl><dt>Buyer implication</dt><dd>{item.buyerImplication}</dd><dt>Safe use</dt><dd>{item.safeUse}</dd>
                      <dt>Sources</dt><dd>{item.sourceIds.join(" · ")}</dd></dl>
                  </article>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </SalesEnablementArtifactStage>
  );
}
