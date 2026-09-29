"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getFAQ,
  measureInterventionOutcome,
} from "@/lib/api";

import {
  getWorkflow,
  clearWorkflow,
} from "@/lib/workflow";

import type { WorkflowState } from "@/lib/workflow";
import type { FAQ, Outcome } from "@/lib/types";

type Intervention = {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  faqId: string;
  channel: string;
  sourceMemoryIds: string[];
};

export default function InterventionView() {
  const router = useRouter();

  const [workflow, setWorkflow] =
    useState<WorkflowState | null>(null);

  const [faq, setFAQ] = useState<FAQ | null>(null);

  const [intervention, setIntervention] =
    useState<Intervention | null>(null);

  const [outcome, setOutcome] =
    useState<Outcome | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [measuring, setMeasuring] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Load the completed workflow.
   */
  useEffect(() => {
    async function loadWorkflow() {
      const currentWorkflow = getWorkflow();

      setWorkflow(currentWorkflow);

      if (!currentWorkflow.faqId) {
        setError(
          "No FAQ was found in the current workflow. Please start again from Recurring Questions."
        );

        setLoading(false);
        return;
      }

      try {
        /*
         * Load the real FAQ from the backend.
         */
        const loadedFAQ = await getFAQ(
          currentWorkflow.faqId
        );

        setFAQ(loadedFAQ);

        /*
         * Build the intervention from actual workflow
         * and FAQ information.
         */
        setIntervention({
          id:
            currentWorkflow.interventionId ??
            `intervention-${loadedFAQ.id}`,

          type: "FAQ Published",

          description:
            `Published a community-grounded FAQ for the recurring question: "${loadedFAQ.question}"`,

          timestamp:
            new Date().toISOString(),

          faqId: loadedFAQ.id,

          channel:
            currentWorkflow.publishedChannel ??
            "#gameplay-help",

          sourceMemoryIds:
            loadedFAQ.source_memory_ids,
        });

        /*
         * Try to load an already-measured outcome.
         *
         * A newly published intervention may not have
         * an outcome yet, so failure here is not fatal.
         */
        if (currentWorkflow.interventionId) {
          try {
            const existingOutcome =
              await fetchOutcome(
                currentWorkflow.interventionId
              );

            setOutcome(existingOutcome);
          } catch {
            /*
             * No outcome has been measured yet.
             */
          }
        }
      } catch (loadError) {
        console.error(
          "Failed to load intervention workflow:",
          loadError
        );

        setError(
          "Failed to load the FAQ from the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkflow();
  }, []);

  /*
   * Get an existing outcome.
   */
  async function fetchOutcome(
    interventionId: string
  ): Promise<Outcome> {
    const response = await fetch(
      `http://localhost:8000/interventions/${interventionId}/outcome`
    );

    if (!response.ok) {
      throw new Error(
        "Outcome has not been measured yet."
      );
    }

    return response.json();
  }

  /*
   * Measure the intervention outcome.
   */
  const handleMeasureOutcome = async () => {
    if (!intervention || !faq) {
      return;
    }

    setMeasuring(true);
    setError(null);

    try {
      const measuredOutcome =
        await measureInterventionOutcome(
          intervention.id,
          faq.question,
          7
        );

      setOutcome(measuredOutcome);
    } catch (measurementError) {
      console.error(
        "Failed to measure intervention outcome:",
        measurementError
      );

      setError(
        measurementError instanceof Error
          ? measurementError.message
          : "Failed to measure intervention outcome."
      );
    } finally {
      setMeasuring(false);
    }
  };

  /*
   * Start a new workflow.
   */
  const handleStartNewWorkflow = () => {
    clearWorkflow();

    router.push("/recurring-questions");
  };

  if (loading) {
    return (
      <div className="intervention-page">
        <div className="intervention-card">
          <p>
            Loading intervention workflow...
          </p>
        </div>
      </div>
    );
  }

  if (!intervention || !faq) {
    return (
      <div className="intervention-page">
        <div className="intervention-card">
          <p>
            {error ??
              "No intervention workflow was found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="intervention-page">

      {/* Header */}

      <div className="intervention-header">

        <div>
          <p className="eyebrow">
            MODERATOR INTELLIGENCE
          </p>

          <h1>
            Interventions & Outcomes
          </h1>

          <p className="page-description">
            Track moderator actions and observe what
            changed afterward.
          </p>
        </div>

        <span className="intervention-status">
          REMEMBERED
        </span>

      </div>

      {/* Error */}

      {error && (
        <section className="intervention-card">
          <div className="outcome-note">
            <strong>
              Measurement notice
            </strong>

            <p>
              {error}
            </p>
          </div>
        </section>
      )}

      {/* Workflow */}

      <section className="intervention-card">

        <div className="intervention-card-header">

          <div>
            <p className="section-label">
              WORKFLOW
            </p>

            <h2>
              Published FAQ intervention
            </h2>
          </div>

          <span className="intervention-id">
            {intervention.id}
          </span>

        </div>

        <div className="intervention-meta-grid">

          <div>
            <span>FAQ</span>

            <strong>
              {intervention.faqId}
            </strong>
          </div>

          <div>
            <span>Channel</span>

            <strong>
              {intervention.channel}
            </strong>
          </div>

          <div>
            <span>Status</span>

            <strong>
              {workflow?.faqStatus ??
                faq.status}
            </strong>
          </div>

        </div>

      </section>

      {/* Intervention */}

      <section className="intervention-card">

        <p className="section-label">
          INTERVENTION
        </p>

        <h2>
          {intervention.type}
        </h2>

        <p className="intervention-description">
          {intervention.description}
        </p>

        <div className="intervention-details">

          <div>
            <span>
              Published channel
            </span>

            <strong>
              {intervention.channel}
            </strong>
          </div>

          <div>
            <span>
              Published at
            </span>

            <strong>
              {new Date(
                intervention.timestamp
              ).toLocaleString()}
            </strong>
          </div>

        </div>

      </section>

      {/* FAQ */}

      <section className="intervention-card">

        <p className="section-label">
          PUBLISHED FAQ
        </p>

        <h2>
          {faq.question}
        </h2>

        <p className="intervention-description">
          {faq.answer}
        </p>

      </section>

      {/* Source Memories */}

      <section className="intervention-card">

        <p className="section-label">
          SOURCE MEMORIES
        </p>

        <h2>
          Evidence used for the intervention
        </h2>

        {intervention.sourceMemoryIds.length >
        0 ? (
          <div className="intervention-memory-list">

            {intervention.sourceMemoryIds.map(
              (memoryId) => (
                <div
                  key={memoryId}
                  className="intervention-memory-item"
                >
                  <span>
                    Source memory
                  </span>

                  <strong>
                    {memoryId}
                  </strong>
                </div>
              )
            )}

          </div>
        ) : (
          <p>
            No source memories were attached to
            this FAQ.
          </p>
        )}

      </section>

      {/* Outcome */}

      <section className="intervention-card">

        <p className="section-label">
          OUTCOME
        </p>

        <h2>
          Observed change after publication
        </h2>

        {!outcome ? (
          <div className="outcome-note">

            <strong>
              Outcome not measured yet
            </strong>

            <p>
              Measure the last 7 days of community
              activity against this intervention to
              observe what changed after publication.
            </p>

            <button
              className="primary-button"
              onClick={handleMeasureOutcome}
              disabled={measuring}
            >
              {measuring
                ? "Measuring..."
                : "Measure Outcome"}
            </button>

          </div>
        ) : (
          <>
            <div className="outcome-grid">

              <div className="outcome-card">

                <span>
                  Recurring questions
                </span>

                <strong>
                  {outcome.before_count ??
                    "—"}
                  {" → "}
                  {outcome.after_count ??
                    "—"}
                </strong>

                <small>
                  Before → After
                </small>

              </div>

              <div className="outcome-card">

                <span>
                  Unique users
                </span>

                <strong>
                  {outcome.unique_users_before ??
                    "—"}
                  {" → "}
                  {outcome.unique_users_after ??
                    "—"}
                </strong>

                <small>
                  Before → After
                </small>

              </div>

              <div className="outcome-card">

                <span>
                  Resolution time
                </span>

                <strong>
                  {outcome.time_to_resolution_before ??
                    "—"}
                  {" → "}
                  {outcome.time_to_resolution_after ??
                    "—"}
                  {" min"}
                </strong>

                <small>
                  Before → After
                </small>

              </div>

            </div>

            <div className="outcome-note">

              <strong>
                Observed association
              </strong>

              <p>
                {outcome.notes ??
                  "The observed before/after difference is an association and does not by itself establish causation."}
              </p>

              {outcome.evaluated_at && (
                <small>
                  Evaluated{" "}
                  {new Date(
                    outcome.evaluated_at
                  ).toLocaleString()}
                </small>
              )}

            </div>

            <button
              className="secondary-button"
              onClick={handleMeasureOutcome}
              disabled={measuring}
            >
              {measuring
                ? "Measuring..."
                : "Re-measure Outcome"}
            </button>
          </>
        )}

      </section>

      {/* Timeline */}

      <section className="intervention-card">

        <p className="section-label">
          TIMELINE
        </p>

        <h2>
          Intervention history
        </h2>

        <div className="intervention-timeline">

          <div className="timeline-item">

            <span className="timeline-dot" />

            <div>
              <strong>
                FAQ published
              </strong>

              <p>
                {intervention.channel}
              </p>

              <small>
                {new Date(
                  intervention.timestamp
                ).toLocaleString()}
              </small>
            </div>

          </div>

          {outcome && (
            <div className="timeline-item">

              <span className="timeline-dot" />

              <div>
                <strong>
                  Outcome evaluated
                </strong>

                <p>
                  Before/after community activity
                  comparison completed.
                </p>

                <small>
                  {outcome.evaluated_at
                    ? new Date(
                        outcome.evaluated_at
                      ).toLocaleString()
                    : "Recently"}
                </small>
              </div>

            </div>
          )}

        </div>

      </section>

      {/* Start New Workflow */}

      <section className="intervention-actions">

        <button
          className="secondary-button"
          onClick={handleStartNewWorkflow}
        >
          Start New Workflow
        </button>

      </section>

    </div>
  );
}