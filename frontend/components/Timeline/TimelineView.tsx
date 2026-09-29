"use client";

const timelineItems = [
  {
    id: "timeline-001",
    type: "MESSAGE",
    date: "Sep 18, 2026",
    title: "Authentication complaints begin appearing",
    description:
      "Community members begin reporting authentication failures after the latest update.",
    source: "mem-102",
  },
  {
    id: "timeline-002",
    type: "EVENT",
    date: "Sep 20, 2026",
    title: "Latest game update released",
    description:
      "A new update was released and authentication-related conversations increased afterward.",
    source: "event-014",
  },
  {
    id: "timeline-003",
    type: "INSIGHT",
    date: "Sep 22, 2026",
    title: "Recurring authentication question detected",
    description:
      "Similar authentication questions are appearing repeatedly across community conversations.",
    source: "insight-007",
  },
  {
    id: "timeline-004",
    type: "INTERVENTION",
    date: "Sep 24, 2026",
    title: "Authentication FAQ published",
    description:
      "A moderator-approved troubleshooting FAQ was published to the gameplay-help channel.",
    source: "intervention-001",
  },
  {
    id: "timeline-005",
    type: "OUTCOME",
    date: "Sep 28, 2026",
    title: "Post-intervention activity evaluated",
    description:
      "Recurring authentication questions decreased in the observed period after publication.",
    source: "outcome-001",
  },
];

export default function TimelineView() {
  return (
    <div className="timeline-page">

      <div className="timeline-header">
        <div>
          <p className="eyebrow">
            COMMUNITY MEMORY
          </p>

          <h1>Timeline</h1>

          <p className="page-description">
            Follow important conversations, events,
            insights, and interventions across time.
          </p>
        </div>
      </div>

      <section className="timeline-card">

        <div className="timeline-list">

          {timelineItems.map((item) => (
            <div
              key={item.id}
              className="timeline-row"
            >
              <div className="timeline-marker" />

              <div className="timeline-content">

                <div className="timeline-item-header">

                  <span className="timeline-type">
                    {item.type}
                  </span>

                  <span className="timeline-date">
                    {item.date}
                  </span>

                </div>

                <h2>
                  {item.title}
                </h2>

                <p>
                  {item.description}
                </p>

                <span className="timeline-source">
                  Source: {item.source}
                </span>

              </div>
            </div>
          ))}

        </div>

      </section>

    </div>
  );
}