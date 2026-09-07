export function SalesEnablementNarrativeStep({ workflow, run }) {
  const artifact = run?.artifact;
  return artifact ? <>
        <div className="sales-narrative-arc">
          {[["situation", "Situation"], ["complication", "Complication"], ["resolution", "Resolution"]].map(([key, label], index) => (
            <article key={key}><span className="eyebrow">0{index + 1}</span><h3>{label}</h3><p>{artifact.narrative[key]}</p></article>
          ))}
        </div>
        <h3 className="sales-section-title">Slide-by-slide rationale</h3>
        <ol className="sales-rationale-list">
          {artifact.narrative.slideRationale.map((item) => {
            const slide = artifact.slides.find(({ id }) => id === item.slideId);
            return <li key={item.slideId} data-sales-rationale={item.slideId}>
              <strong>{slide?.headline ?? item.slideId}</strong><p>{item.rationale}</p>
            </li>;
          })}
        </ol>
      </> : null;
}
