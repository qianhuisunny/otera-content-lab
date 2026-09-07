const checkLabels = { passed: "Passed", warning: "Warning", blocked: "Blocked" };

export function SalesEnablementReviewStep({ workflow, run }) {
  const review = run?.artifact?.review;
  return review ? <>
        <section aria-labelledby="sales-readiness-checks"><h3 id="sales-readiness-checks">Readiness checks</h3>
          <ul className="sales-review-checks">{review.checks.map((check) => (
            <li key={check.id}><div><strong>{check.label}</strong><span className={`sales-check is-${check.status}`}>{checkLabels[check.status]}</span></div><p>{check.detail}</p></li>
          ))}</ul>
        </section>
        {[["warnings", "Warnings"], ["blockingGaps", "Blocking gaps"], ["doNotOverclaim", "Do not overclaim"]].map(([key, label]) => (
          <section className={`sales-review-group is-${key}`} key={key} aria-labelledby={`sales-review-${key}`}>
            <h3 id={`sales-review-${key}`}>{label}</h3>
            {review[key].length ? <ul>{review[key].map((item, index) => <li key={index}>{item}</li>)}</ul> : <p>None identified in this run.</p>}
          </section>
        ))}
      </> : null;
}
