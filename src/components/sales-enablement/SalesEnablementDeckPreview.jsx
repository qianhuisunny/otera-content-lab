const proofLabels = {
  verified: "Verified",
  company_claim: "Company claim",
  inference: "Inference",
  unresolved: "Needs evidence",
};

export function SalesEnablementDeckPreview({ workflow, run }) {
  return run?.artifact ? <ol className="sales-slide-list">
        {run.artifact.slides.map((slide) => (
          <li key={slide.id} data-sales-slide={slide.id}>
            <article className="sales-slide-card" aria-labelledby={`sales-${slide.id}`}>
              <header><span className="eyebrow">{String(slide.number).padStart(2, "0")} / {run.artifact.slides.length} · {slide.purpose.replaceAll("_", " ")}</span>
                <span className={`sales-proof is-${slide.proofState}`}>{proofLabels[slide.proofState]}</span></header>
              <h3 id={`sales-${slide.id}`}>{slide.headline}</h3>
              <ul>{slide.bodyBullets.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
              <footer><span className="sales-meta">Evidence: {slide.evidenceIds.length ? slide.evidenceIds.join(" · ") : "No supporting evidence attached"}</span>
                <details><summary>Speaker notes</summary><p>{slide.speakerNotes}</p></details></footer>
            </article>
          </li>
        ))}
      </ol> : null;
}
