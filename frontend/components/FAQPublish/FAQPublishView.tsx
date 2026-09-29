"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  publishFAQ,
  getFAQ,
} from "@/lib/api";

import type { FAQ } from "@/lib/types";

import {
  getWorkflow,
  updateWorkflow,
} from "@/lib/workflow";

const channels = [
  "#general",
  "#gameplay-help",
  "#bugs",
  "#suggestions",
];

export default function FAQPublishView() {
  const router = useRouter();

  const [faq, setFAQ] = useState<FAQ | null>(null);

  const [selectedChannel, setSelectedChannel] =
    useState("#gameplay-help");

  const [loading, setLoading] = useState(true);

  const [publishing, setPublishing] =
    useState(false);

  const [published, setPublished] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ============================================
  // Load approved FAQ
  // ============================================

  useEffect(() => {
    async function loadFAQ() {
      const workflow = getWorkflow();

      if (!workflow.faqId) {
        setError(
          "No FAQ was found in the workflow. Please return to FAQ Review."
        );
        setLoading(false);
        return;
      }

      if (workflow.publishedChannel) {
        setSelectedChannel(
          workflow.publishedChannel
        );
      }

      try {
        const loadedFAQ = await getFAQ(
          workflow.faqId
        );

        setFAQ(loadedFAQ);

        /*
         * If the FAQ has already been published,
         * restore the published state.
         */
        if (loadedFAQ.status === "PUBLISHED") {
          setPublished(true);
        }
      } catch (error) {
        console.error(
          "Failed to load FAQ:",
          error
        );

        setError(
          "Failed to load the FAQ from the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFAQ();
  }, []);

  // ============================================
  // Publish FAQ
  // ============================================

  const handlePublish = async () => {
    if (!faq) {
      return;
    }

    if (faq.status !== "APPROVED") {
      return;
    }

    setPublishing(true);
    setError(null);

    try {
      const publishedFAQ = await publishFAQ(
        faq.id,
        selectedChannel
      );

      setFAQ(publishedFAQ);
      setPublished(true);

      /*
       * Save the real published FAQ state
       * into the workflow.
       */
      updateWorkflow({
        faqId: publishedFAQ.id,
        faqStatus: publishedFAQ.status,
        publishedChannel: selectedChannel,

        /*
         * The backend publish endpoint should
         * eventually provide the real intervention ID.
         *
         * For now we preserve the existing workflow
         * convention so the next screen can continue.
         */
        interventionId: `intervention-${publishedFAQ.id}`,
      });
    } catch (error) {
      console.error(
        "Failed to publish FAQ:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to publish FAQ."
      );
    } finally {
      setPublishing(false);
    }
  };

  // ============================================
  // Continue to intervention tracking
  // ============================================

  const handleContinueToIntervention = () => {
    router.push("/interventions");
  };

  // ============================================
  // Loading
  // ============================================

  if (loading) {
    return (
      <div className="faq-publish-page">
        <div className="faq-publish-card">
          <p>
            Loading publishing workflow...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // Error / missing FAQ
  // ============================================

  if (!faq) {
    return (
      <div className="faq-publish-page">
        <div className="faq-publish-card">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-publish-page">

      {/* Header */}

      <div className="faq-publish-header">
        <div>
          <p className="eyebrow">
            MODERATOR INTELLIGENCE
          </p>

          <h1>Publish FAQ</h1>

          <p className="page-description">
            Choose where the approved FAQ should be
            published in the community.
          </p>
        </div>

        <span
          className={`faq-status ${faq.status.toLowerCase()}`}
        >
          {faq.status}
        </span>
      </div>

      {/* Error */}

      {error && (
        <div className="approval-blocked">
          <strong>
            Publishing failed
          </strong>

          <p>{error}</p>
        </div>
      )}

      {/* FAQ Preview */}

      <section className="faq-publish-card">

        <p className="section-label">
          FAQ PREVIEW
        </p>

        <h2>
          {faq.question}
        </h2>

        <p className="faq-publish-answer">
          {faq.answer}
        </p>

      </section>

      {/* Channel Selection */}

      {!published && (
        <section className="faq-publish-card">

          <p className="section-label">
            PUBLISH CHANNEL
          </p>

          <h2>
            Choose a community channel
          </h2>

          <div className="channel-selection">

            {channels.map((channel) => (
              <button
                key={channel}
                className={
                  selectedChannel === channel
                    ? "channel-option selected"
                    : "channel-option"
                }
                onClick={() =>
                  setSelectedChannel(channel)
                }
                disabled={publishing}
              >
                {channel}
              </button>
            ))}

          </div>

        </section>
      )}

      {/* Publishing Summary */}

      {!published && (
        <section className="faq-publish-card">

          <p className="section-label">
            PUBLISHING SUMMARY
          </p>

          <div className="publish-summary">

            <div>
              <span>FAQ</span>

              <strong>
                {faq.id}
              </strong>
            </div>

            <div>
              <span>Channel</span>

              <strong>
                {selectedChannel}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong>
                {faq.status}
              </strong>
            </div>

          </div>

        </section>
      )}

      {/* Actions */}

      <section className="faq-publish-actions">

        {!published && (
          <button
            className="primary-button"
            onClick={handlePublish}
            disabled={
              faq.status !== "APPROVED" ||
              publishing
            }
          >
            {publishing
              ? "Publishing..."
              : "Publish FAQ"}
          </button>
        )}

        {published && (
          <div className="publish-success">

            <strong>
              FAQ published successfully
            </strong>

            <span>
              Published to {selectedChannel}.
            </span>

            <button
              className="primary-button"
              onClick={
                handleContinueToIntervention
              }
            >
              Continue to Intervention
            </button>

          </div>
        )}

      </section>

    </div>
  );
}