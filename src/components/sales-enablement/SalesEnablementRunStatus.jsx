import "../../writing-generation.css";

const statusCopy = {
  completed: "Ready to inspect",
  queued: "Queued",
  in_progress: "Research in progress",
  failed: "Needs attention",
};

export function getSalesEnablementStatus(session) {
  if (session.error ?? session.run?.error) return statusCopy.failed;
  if (session.requestStatus === "creating") return "Starting live run";
  return statusCopy[session.run?.status] ?? statusCopy.queued;
}

export function SalesEnablementRunStatus({ run, mode, error, provider, requestStatus, retryBlocked, retrySeconds }) {
  const failure = error ?? run?.error;
  const status = failure ? "failed" : run?.status ?? "queued";
  return (
    <section className="writing-generation-notice sales-run-notice" aria-live="polite">
      <div>
        <span className={`sales-status-dot is-${status}`} aria-hidden="true" />
        <strong>{mode === "example" ? "Example run" : "Live run"}</strong>
        <span>{requestStatus === "creating" ? "Starting live run" : statusCopy[status]}</span>
      </div>
      {provider?.checked && !provider.configured ? (
        <p>Live execution is not configured. Example run stays available.</p>
      ) : null}
      {failure ? <p role="alert">{failure.message}</p> : null}
      {retryBlocked && retrySeconds > 0 ? <p>Try again after {retrySeconds} seconds. Run live will become available when the wait ends.</p> : null}
    </section>
  );
}
