"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getFAQ, approveFAQ } from "@/lib/api";
import type { FAQ } from "@/lib/types";

import {
  ConflictingEvidence,
  UncertainClaim,
} from "@/components/States/StatusStates";

import {
  getWorkflow,
  updateWorkflow,
} from "@/lib/workflow";

export default function FAQReviewView() {
  const router = useRouter();

  const [workflowQuestion, setWorkflowQuestion] =
    useState<string | null>(null);

  const [faq, setFAQ] = useState<FAQ | null>(null);

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [hasConflict, setHasConflict] = useState(false);

  const [hasUnsupportedClaim, setHasUnsupportedClaim] =
    useState(false);

  const [showEvidence, setShowEvidence] = useState(false);

  // ============================================
  // Load FAQ from backend
  // ============================================

  useEffect(() => {
    async function loadFAQ() {
      const workflow = getWorkflow();

      setWorkflowQuestion(workflow.selectedQuestion);

      if (!workflow.faqId) {
        console.warn("No FAQ ID found in workflow. Redirecting to recurring questions.");
        router.push("/recurring-questions");
        return;
      }

      try {
        const loadedFAQ = await getFAQ(workflow.faqId);

        setFAQ(loadedFAQ);
        setAnswer(loadedFAQ.answer);
      } catch (error) {
        console.error("Failed to load FAQ:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFAQ();
  }, []);

  // ============================================
  // Loading state
  // ============================================

  if (loading) {
    return (
      <div className="faq-review-page">
        <p>Loading FAQ draft...</p>
      </div>
    );
  }

  // ============================================
  // No FAQ state
  // ============================================

  if (!faq) {
    return (
      <div className="faq-review-page">
        <p>
          No FAQ draft was found. Please return to
          Recurring Questions and select a question again.
        </p>
      </div>
    );
  }

  const approvalBlocked =
    hasConflict || hasUnsupportedClaim;

  // ============================================
  // Save edited answer
  // ============================================

  const handleSave = () => {
    setFAQ((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        answer,
      };
    });

    setEditing(false);

    setHasUnsupportedClaim(false);
  };

  // ============================================
  // Approve FAQ
  // ============================================

  const handleApprove = async () => {
    if (approvalBlocked) {
      return;
    }

    try {
      const approvedFAQ = await approveFAQ(faq.id);

      setFAQ(approvedFAQ);
      setAnswer(approvedFAQ.answer);

      updateWorkflow({
        faqId: approvedFAQ.id,
        faqStatus: approvedFAQ.status,
      });
    } catch (error) {
      console.error("Failed to approve FAQ:", error);
    }
  };

  // ============================================
  // Reject FAQ
  // ============================================

  const handleReject = () => {
    setFAQ((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        status: "REJECTED",
      };
    });

    updateWorkflow({
      faqId: faq.id,
      faqStatus: "REJECTED",
    });
  };

  // ============================================
  // Continue to publishing
  // ============================================

  const handleContinueToPublish = () => {
    router.push("/faq-publish");
  };

  return (
    <div className="faq-review-page">

      {/* Header */}

      <div className="faq-review-header">
        <div>
          <p className="eyebrow">
            MODERATOR INTELLIGENCE
          </p>

          <h1>FAQ Review</h1>

          <p className="page-description">
            Review the community-grounded answer and
            supporting evidence before approval.
          </p>
        </div>

        <span
          className={`faq-status ${faq.status.toLowerCase()}`}
        >
          {faq.status}
        </span>
      </div>

      {/* Guardrails */}

      {hasConflict && (
        <ConflictingEvidence />
      )}

      {hasUnsupportedClaim && (
        <UncertainClaim />
      )}

      {approvalBlocked && (
        <div className="approval-blocked">
          <strong>Approval blocked</strong>

          <p>
            Resolve the evidence issues above before
            approving this FAQ.
          </p>
        </div>
      )}

      {/* Question */}

      <section className="faq-review-card">
        <p className="section-label">
          RECURRING QUESTION
        </p>

        <h2>
          {workflowQuestion || faq.question}
        </h2>

        <div className="faq-meta-row">
          <span>Related issue</span>

          <strong>
            {faq.related_issue_id || "Not specified"}
          </strong>
        </div>
      </section>

      {/* Answer */}

      <section className="faq-review-card">
        <div className="faq-card-header">
          <div>
            <p className="section-label">
              DRAFT ANSWER
            </p>

            <h2>
              Community-grounded response
            </h2>
          </div>

          {!editing && faq.status === "DRAFT" && (
            <button
              className="secondary-button"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <>
            <textarea
              className="faq-answer-editor"
              value={answer}
              onChange={(event) =>
                setAnswer(event.target.value)
              }
              rows={8}
            />

            <div className="faq-edit-actions">
              <button
                className="secondary-button"
                onClick={() => {
                  setAnswer(faq.answer);
                  setEditing(false);
                }}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <p className="faq-answer">
            {faq.answer}
          </p>
        )}
      </section>

      {/* Evidence */}

      <section className="faq-review-card">
        <div className="faq-card-header">
          <div>
            <p className="section-label">
              EVIDENCE
            </p>

            <h2>
              Supporting memories
            </h2>
          </div>

          <button
            className="secondary-button"
            onClick={() =>
              setShowEvidence(!showEvidence)
            }
          >
            {showEvidence
              ? "Hide Evidence"
              : "View Evidence"}
          </button>
        </div>

        <p className="evidence-summary">
          {faq.evidence_summary}
        </p>

        {showEvidence && (
          <div className="faq-memory-list">
            {faq.source_memory_ids.map(
              (memoryId) => (
                <div
                  className="faq-memory-item"
                  key={memoryId}
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
        )}
      </section>

      {/* Confidence */}

      <section className="faq-review-card">
        <p className="section-label">
          CONFIDENCE & LIMITATIONS
        </p>

        <h2>
          What the evidence supports
        </h2>

        <p className="confidence-notes">
          {faq.confidence_notes ||
            "No additional confidence notes were provided."}
        </p>
      </section>

      {/* Demo guardrail controls */}

      {faq.status === "DRAFT" && (
        <section className="faq-review-card guardrail-controls">
          <div>
            <p className="section-label">
              REVIEW SIMULATION
            </p>

            <h2>
              Test evidence guardrails
            </h2>

            <p>
              These controls simulate conditions that
              the backend may return later.
            </p>
          </div>

          <div className="guardrail-buttons">

            <button
              className="secondary-button"
              onClick={() =>
                setHasConflict(!hasConflict)
              }
            >
              {hasConflict
                ? "Clear Conflict"
                : "Simulate Conflict"}
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                setHasUnsupportedClaim(
                  !hasUnsupportedClaim
                )
              }
            >
              {hasUnsupportedClaim
                ? "Clear Unsupported Claim"
                : "Simulate Unsupported Claim"}
            </button>

          </div>
        </section>
      )}

      {/* Actions */}

      <section className="faq-actions">

        {faq.status === "DRAFT" && (
          <>
            <button
              className="reject-button"
              onClick={handleReject}
            >
              Reject
            </button>

            <button
              className="approve-button"
              disabled={approvalBlocked}
              onClick={handleApprove}
            >
              {approvalBlocked
                ? "Approval Blocked"
                : "Approve"}
            </button>
          </>
        )}

        {faq.status === "APPROVED" && (
          <div className="approved-message">

            <strong>
              FAQ approved
            </strong>

            <span>
              This FAQ is ready for the publishing
              workflow.
            </span>

            <button
              className="primary-button"
              onClick={handleContinueToPublish}
            >
              Continue to Publish
            </button>

          </div>
        )}

        {faq.status === "REJECTED" && (
          <div className="rejected-message">

            <strong>
              FAQ rejected
            </strong>

            <span>
              This draft will not be published.
            </span>

          </div>
        )}

      </section>

    </div>
  );
}