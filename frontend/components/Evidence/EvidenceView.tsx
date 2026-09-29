"use client";

const evidenceItems = [
  {
    id: "mem-102",
    channel: "#bugs",
    date: "Sep 18, 2026",
    content:
      "Several players report that authentication fails after the latest update.",
    relevance: "High",
  },
  {
    id: "mem-118",
    channel: "#gameplay-help",
    date: "Sep 19, 2026",
    content:
      "Community members ask how to resolve authentication failures following the update.",
    relevance: "High",
  },
  {
    id: "mem-145",
    channel: "#bugs",
    date: "Sep 21, 2026",
    content:
      "Additional reports describe the same authentication problem.",
    relevance: "High",
  },
  {
    id: "mem-201",
    channel: "#gameplay-help",
    date: "Sep 23, 2026",
    content:
      "A user asks whether the existing authentication troubleshooting steps still apply.",
    relevance: "Medium",
  },
];

export default function EvidenceView() {
  return (
    <div className="evidence-page">

      <div className="evidence-header">

        <div>
          <p className="eyebrow">
            COMMUNITY MEMORY
          </p>

          <h1>Evidence</h1>

          <p className="page-description">
            Review the historical memories supporting
            community insights and FAQ decisions.
          </p>
        </div>

        <span className="evidence-count">
          {evidenceItems.length} memories
        </span>

      </div>

      <section className="evidence-card">

        <div className="evidence-card-header">

          <div>
            <p className="section-label">
              SUPPORTING MEMORIES
            </p>

            <h2>
              Authentication issue evidence
            </h2>
          </div>

        </div>

        <div className="evidence-list">

          {evidenceItems.map((item) => (
            <article
              key={item.id}
              className="evidence-item"
            >

              <div className="evidence-item-top">

                <strong>
                  {item.id}
                </strong>

                <span className="evidence-relevance">
                  {item.relevance} relevance
                </span>

              </div>

              <p className="evidence-content">
                {item.content}
              </p>

              <div className="evidence-meta">

                <span>
                  {item.channel}
                </span>

                <span>
                  {item.date}
                </span>

              </div>

            </article>
          ))}

        </div>

      </section>

    </div>
  );
}