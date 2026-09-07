const statusCopy = {
  completed: "Ready to inspect",
  queued: "Queued",
  in_progress: "Research in progress",
  failed: "Needs attention",
};

export function SalesEnablementRunStatus({ run, mode }) {
  return (
    <section className="sales-run-status" aria-live="polite">
      <div>
        <span className={`sales-status-dot is-${run.status}`} aria-hidden="true" />
        <strong>{mode === "example" ? "Example run" : "Live run"}</strong>
        <span>{statusCopy[run.status]}</span>
      </div>
      {run.error ? <p role="alert">{run.error.message}</p> : null}
    </section>
  );
}
