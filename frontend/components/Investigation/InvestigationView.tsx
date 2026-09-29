"use client";

import { FormEvent, useState } from "react";
import { investigate } from "@/lib/api";
import type { Evidence, Investigation } from "@/lib/types";

export default function InvestigationView() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Investigation | null>(null);
  const [selectedEvidence, setSelectedEvidence] =
    useState<Evidence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleInvestigate(event: FormEvent) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setSelectedEvidence(null);

    try {
      const investigation = await investigate(query.trim());
      setResult(investigation);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to investigate this issue."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="investigation-page">
        <section className="investigation-header">
            <div>
                <p className="eyebrow">HISTORICAL INVESTIGATION</p>

                <h1>Investigate a Problem</h1>

                <p className="page-description">
      Reconstruct what happened across the community using historical
      conversations, events, and evidence.
                </p>
            </div>
        </section>

      <form
        className="investigation-search"
        onSubmit={handleInvestigate}
      >
        <div className="search-input-wrapper">
          <label htmlFor="investigation-query">
            What do you want to understand?
          </label>

          <input
            id="investigation-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Why have authentication complaints increased?"
          />
        </div>

        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? "Investigating..." : "Investigate"}
        </button>
      </form>

      {error && (
        <div className="investigation-error">
          <strong>Investigation unavailable</strong>
          <p>{error}</p>
        </div>
      )}

      {!result && !loading && !error && (
        <section className="investigation-empty">
          <div className="empty-icon">?</div>

          <h2>Start an investigation</h2>

          <p>
            Ask a question about something happening in your community.
            Historical evidence will be used to reconstruct the issue.
          </p>
        </section>
      )}

      {loading && (
        <section className="investigation-loading">
          <div className="loading-spinner" />

          <h2>Searching community memory...</h2>

          <p>
            Retrieving historical conversations and connecting related
            events.
          </p>
        </section>
      )}

      {result && !loading && (
        <>
          <InvestigationResult
            result={result}
            onEvidenceSelect={setSelectedEvidence}
          />

          {selectedEvidence && (
            <EvidenceDrawer
              evidence={selectedEvidence}
              onClose={() => setSelectedEvidence(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

function InvestigationResult({
  result,
  onEvidenceSelect,
}: {
  result: Investigation;
  onEvidenceSelect: (evidence: Evidence) => void;
}) {
  return (
    <section className="investigation-results">
      <div className="result-summary">
        <div>
          <p className="panel-eyebrow">INVESTIGATION RESULT</p>

          <h2>{result.title}</h2>

          <p>{result.summary}</p>
        </div>

        {result.issue_id && (
          <span className="issue-id">
            Issue #{result.issue_id}
          </span>
        )}
      </div>

      <div className="investigation-grid">
        <section className="investigation-panel timeline-panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">CHRONOLOGY</p>
              <h3>Historical Timeline</h3>
            </div>
          </div>

          {result.timeline.length === 0 ? (
            <div className="no-data">
              No timeline events were returned.
            </div>
          ) : (
            <div className="timeline">
              {result.timeline.map((item) => (
                <article className="timeline-item" key={item.id}>
                  <div className="timeline-marker" />

                  <div className="timeline-content">
                    <span className="timeline-date">
                      {item.timestamp}
                    </span>

                    <h4>{item.title}</h4>

                    {item.description && (
                      <p>{item.description}</p>
                    )}

                    {item.source_memory_ids &&
                      item.source_memory_ids.length > 0 && (
                        <div className="source-tags">
                          {item.source_memory_ids.map((id) => (
                            <span key={id}>Source {id}</span>
                          ))}
                        </div>
                      )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="investigation-panel evidence-panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">SOURCE MATERIAL</p>
              <h3>Evidence</h3>
            </div>

            <span className="evidence-count">
              {result.evidence.length} sources
            </span>
          </div>

          {result.evidence.length === 0 ? (
            <div className="no-data">
              No relevant evidence was returned.
            </div>
          ) : (
            <div className="evidence-list">
              {result.evidence.map((item) => (
                <button
                  className="evidence-item evidence-button"
                  key={item.memory_id}
                  onClick={() => onEvidenceSelect(item)}
                >
                  <div className="evidence-meta">
                    <span>{item.memory_id}</span>

                    {item.timestamp && (
                      <span>{item.timestamp}</span>
                    )}
                  </div>

                  <p>{item.content}</p>

                  {item.channel && (
                    <span className="channel-tag">
                      #{item.channel}
                    </span>
                  )}

                  <span className="evidence-open">
                    View source →
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="analysis-grid">
        {result.changes && result.changes.length > 0 && (
          <AnalysisCard
            title="What changed?"
            items={result.changes}
          />
        )}

        {result.interpretation &&
          result.interpretation.length > 0 && (
            <AnalysisCard
              title="Interpretation"
              items={result.interpretation}
            />
          )}

        {result.uncertainty &&
          result.uncertainty.length > 0 && (
            <AnalysisCard
              title="Uncertainty"
              items={result.uncertainty}
            />
          )}
      </section>
    </section>
  );
}

function AnalysisCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="analysis-card">
      <h3>{title}</h3>

      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function EvidenceDrawer({
  evidence,
  onClose,
}: {
  evidence: Evidence;
  onClose: () => void;
}) {
  return (
    <div className="evidence-overlay" onClick={onClose}>
      <aside
        className="evidence-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <p className="panel-eyebrow">SOURCE MEMORY</p>
            <h2>{evidence.memory_id}</h2>
          </div>

          <button
            className="drawer-close"
            onClick={onClose}
            aria-label="Close evidence"
          >
            ×
          </button>
        </div>

        <div className="drawer-content">
          <div className="drawer-meta">
            {evidence.timestamp && (
              <div>
                <span>Timestamp</span>
                <strong>{evidence.timestamp}</strong>
              </div>
            )}

            {evidence.channel && (
              <div>
                <span>Channel</span>
                <strong>#{evidence.channel}</strong>
              </div>
            )}

            {evidence.relevance && (
              <div>
                <span>Relevance</span>
                <strong>{evidence.relevance}</strong>
              </div>
            )}
          </div>

          <div className="source-message">
            <p>{evidence.content}</p>
          </div>

          <div className="evidence-note">
            <strong>Why this matters</strong>

            <p>
              This source was retrieved as evidence for the current
              investigation. The moderator should evaluate it alongside
              the other historical sources.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}