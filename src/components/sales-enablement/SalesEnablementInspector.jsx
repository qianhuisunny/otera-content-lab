export function SalesEnablementInspector({ artifact, activeStepId }) {
  if (!artifact || !["research", "review"].includes(activeStepId)) return null;
  const evidence = artifact.research.flatMap((finding) => finding.evidence);
  return (
    <aside className="sales-enablement-inspector" aria-label="Sources and evidence">
      <span className="eyebrow">Context bank</span>
      <h2>Sources &amp; evidence</h2>
      <p className="sales-meta">{artifact.sources.length} sources · {evidence.length} evidence units</p>
      <p className="sales-meta">{artifact.context.evidencePosture}</p>
      <ul className="sales-source-list">
        {artifact.sources.map((source) => (
          <li key={source.id}>
            <details><summary><strong>{source.title}</strong><span className="sales-meta">{source.sourceClass.replaceAll("_", " ")}</span></summary>
              <dl><dt>Source ID</dt><dd>{source.id}</dd><dt>Reference</dt><dd>{source.locator}</dd><dt>As of</dt><dd><time dateTime={source.asOf}>{source.asOf}</time></dd></dl>
              {evidence.filter((item) => item.sourceIds.includes(source.id)).map((item) => (
                <div className="sales-source-evidence" key={item.id}><strong>{item.id}</strong><p>{item.claim}</p><small>{item.evidenceClass.replaceAll("_", " ")} · {item.confidence} confidence</small></div>
              ))}
            </details>
          </li>
        ))}
      </ul>
    </aside>
  );
}
