const statusCopy = {
  completed: "Ready to inspect",
  queued: "Queued",
  in_progress: "Research in progress",
  failed: "Needs attention",
};

export function SalesEnablementRunStatus({ run, mode, error, requestStatus, retryBlocked, retrySeconds }) {
  const failure = error ?? run?.error;
  const status = failure ? "failed" : run?.status ?? "queued";
  return (
    <section className="sales-run-status" aria-live="polite">
      <div>
        <span className={`sales-status-dot is-${status}`} aria-hidden="true" />
        <strong>{mode === "example" ? "Example run" : "Live run"}</strong>
        <span>{requestStatus === "creating" ? "Starting live run" : statusCopy[status]}</span>
      </div>
      {failure ? <p role="alert">{failure.message}</p> : null}
      {retryBlocked && retrySeconds > 0 ? <p>Try again after {retrySeconds} seconds. Run live will become available when the wait ends.</p> : null}
    </section>
  );
}
