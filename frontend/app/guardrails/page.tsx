"use client";

import {
  LoadingState,
  EmptyState,
  ErrorState,
  InsufficientEvidence,
  ConflictingEvidence,
  UncertainClaim,
  NoOutcomeData,
} from "@/components/States/StatusStates";

export default function GuardrailsPage() {
  return (
    <div className="trends-page">
      <div className="trends-header">
        <div>
          <p className="eyebrow">SYSTEM SAFETY</p>

          <h1>Error States & Guardrails</h1>

          <p className="page-description">
            Examples of how the interface handles uncertainty,
            incomplete evidence, and unavailable data.
          </p>
        </div>
      </div>

      <section className="trend-card">
        <div className="trend-card-header">
          <div>
            <p className="section-label">LOADING</p>
            <h2>Loading State</h2>
          </div>
        </div>

        <LoadingState message="Loading community memories..." />
      </section>

      <section className="trend-card">
        <div className="trend-card-header">
          <div>
            <p className="section-label">EMPTY</p>
            <h2>Empty State</h2>
          </div>
        </div>

        <EmptyState
          title="No recurring questions found"
          message="No question has appeared often enough to be surfaced as a recurring question."
        />
      </section>

      <section className="trend-card">
        <div className="trend-card-header">
          <div>
            <p className="section-label">ERROR</p>
            <h2>Error State</h2>
          </div>
        </div>

        <ErrorState
          title="Unable to load insights"
          message="The community intelligence service could not be reached."
          onAction={() => alert("Retry requested")}
        />
      </section>

      <section className="trend-card">
        <div className="trend-card-header">
          <div>
            <p className="section-label">EVIDENCE</p>
            <h2>Evidence Guardrails</h2>
          </div>
        </div>

        <InsufficientEvidence
          onAction={() => alert("Broaden investigation")}
        />

        <ConflictingEvidence />

        <UncertainClaim />
      </section>

      <section className="trend-card">
        <div className="trend-card-header">
          <div>
            <p className="section-label">OUTCOME</p>
            <h2>Missing Outcome Data</h2>
          </div>
        </div>

        <NoOutcomeData />
      </section>
    </div>
  );
}