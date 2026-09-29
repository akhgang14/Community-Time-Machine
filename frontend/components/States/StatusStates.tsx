"use client";

type StatusStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function LoadingState({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="status-state loading-state">
      <div className="loading-spinner" />

      <div>
        <h3>{message}</h3>
        <p>Please wait while the community data is being loaded.</p>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: StatusStateProps) {
  return (
    <div className="status-state empty-state">
      <div className="status-icon">○</div>

      <div>
        <h3>{title}</h3>
        <p>{message}</p>

        {actionLabel && onAction && (
          <button className="status-action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  actionLabel = "Try Again",
  onAction,
}: StatusStateProps) {
  return (
    <div className="status-state error-state">
      <div className="status-icon">!</div>

      <div>
        <h3>{title}</h3>
        <p>{message}</p>

        {onAction && (
          <button className="status-action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function InsufficientEvidence({
  onAction,
}: {
  onAction?: () => void;
}) {
  return (
    <div className="guardrail-card warning">
      <div className="guardrail-icon">!</div>

      <div>
        <h3>Insufficient evidence</h3>

        <p>
          There are not enough relevant memories to support a reliable
          conclusion about this issue.
        </p>

        {onAction && (
          <button className="status-action" onClick={onAction}>
            Broaden Investigation
          </button>
        )}
      </div>
    </div>
  );
}

export function ConflictingEvidence() {
  return (
    <div className="guardrail-card conflict">
      <div className="guardrail-icon">!</div>

      <div>
        <h3>Conflicting evidence</h3>

        <p>
          Retrieved memories contain different or inconsistent
          information. Review the source evidence before taking action.
        </p>
      </div>
    </div>
  );
}

export function UncertainClaim() {
  return (
    <div className="guardrail-card uncertainty">
      <div className="guardrail-icon">?</div>

      <div>
        <h3>Claim requires verification</h3>

        <p>
          This statement is not sufficiently supported by the available
          community evidence. Review or edit the answer before approval.
        </p>
      </div>
    </div>
  );
}

export function NoOutcomeData() {
  return (
    <div className="guardrail-card neutral">
      <div className="guardrail-icon">i</div>

      <div>
        <h3>Outcome cannot yet be evaluated</h3>

        <p>
          There is not enough post-intervention data to compare the
          community activity.
        </p>
      </div>
    </div>
  );
}