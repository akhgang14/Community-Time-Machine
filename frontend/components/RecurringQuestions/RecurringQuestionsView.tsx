"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RecurringQuestion } from "@/lib/types";
import {
  createFAQDraft,
  getRecurringQuestions,
} from "@/lib/api";
import { updateWorkflow } from "@/lib/workflow";

export default function RecurringQuestionsView() {
  const [questions, setQuestions] = useState<RecurringQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    setLoading(true);

    try {
      const data = await getRecurringQuestions();
      setQuestions(data);
    } catch (error) {
      console.error(
        "Unable to load recurring questions:",
        error
      );
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleIgnore(id: string) {
    setQuestions((currentQuestions) =>
      currentQuestions.filter(
        (question) => question.id !== id
      )
    );
  }


  async function handleAddFAQ(question: RecurringQuestion) {

    try {
      const faq = await createFAQDraft(question.question);

      console.log("CREATE FAQ RESPONSE:", faq);
      console.log("FAQ ID:", faq.id);
      console.log("FAQ STATUS:", faq.status);

      if (!faq.id) {

        throw new Error(
          "FAQ draft was created, but the backend did not return an FAQ ID."
        );
      }

      updateWorkflow({

        selectedQuestion: question.question,
        selectedIssueId: question.related_issue_id ?? null,
        faqId: faq.id,
        faqStatus: faq.status,
      });

      console.log("WORKFLOW AFTER UPDATE:", {

        faqId: faq.id,
        faqStatus: faq.status,
      });

      router.push("/faq-review");
    } catch (error) {
      console.error("Unable to create FAQ draft:", error);

      alert(

        error instanceof Error
        ? error.message
        : "Unable to create FAQ draft."
      );
    }
  }


  function handleViewEvidence(
    question: RecurringQuestion
  ) {
    alert(
      `Evidence for this question:\n\n${question.source_memory_ids.join(
        "\n"
      )}`
    );
  }

  return (
    <div className="recurring-questions-page">
      <div className="recurring-questions-header">
        <div>
          <p className="eyebrow">COMMUNITY PATTERNS</p>

          <h1>Recurring Questions</h1>

          <p className="page-description">
            Questions that appear repeatedly across the
            community.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadQuestions}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {!loading && (
        <div className="recurring-count">
          {questions.length} recurring questions detected
        </div>
      )}

      {loading && (
        <div className="empty-state">
          <p>Finding recurring questions...</p>
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="empty-state">
          <h2>No recurring questions detected</h2>

          <p>
            When repeated questions are detected, they will
            appear here.
          </p>
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="recurring-list">
          {questions.map((question) => (
            <div
              className="recurring-card"
              key={question.id}
            >
              <div className="recurring-card-main">
                <div className="recurring-card-top">
                  <span className="recurring-label">
                    RECURRING QUESTION
                  </span>

                  {question.confidence && (
                    <span className="confidence-badge">
                      {question.confidence} confidence
                    </span>
                  )}
                </div>

                <h2>{question.question}</h2>

                <div className="recurring-stats">
                  <div>
                    <span className="stat-label">
                      Occurrences
                    </span>

                    <strong>
                      {question.occurrence_count}
                    </strong>
                  </div>

                  <div>
                    <span className="stat-label">
                      First seen
                    </span>

                    <strong>
                      {formatDate(question.first_seen)}
                    </strong>
                  </div>

                  <div>
                    <span className="stat-label">
                      Last seen
                    </span>

                    <strong>
                      {formatDate(question.last_seen)}
                    </strong>
                  </div>

                  <div>
                    <span className="stat-label">
                      Evidence
                    </span>

                    <strong>
                      {question.source_memory_ids.length}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="recurring-card-actions">
                <button
                  className="secondary-button"
                  onClick={() =>
                    handleViewEvidence(question)
                  }
                >
                  View Evidence
                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    handleIgnore(question.id)
                  }
                >
                  Ignore
                </button>

                <button
                  className="primary-button"
                  onClick={() =>
                    handleAddFAQ(question)
                  }
                >
                  Add FAQ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleDateString();
}