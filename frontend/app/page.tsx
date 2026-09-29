import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />

      <div className="dashboard-page">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">COMMUNITY OVERVIEW</p>

            <h1>What&apos;s happening in your community?</h1>

            <p className="page-description">
              Explore recent activity, emerging issues, recurring questions,
              and historical community patterns.
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Emerging Issues</span>
            <strong>3</strong>
            <p>Issues showing increased activity</p>
          </div>

          <div className="stat-card">
            <span>Recurring Questions</span>
            <strong>7</strong>
            <p>Questions appearing repeatedly</p>
          </div>

          <div className="stat-card">
            <span>Recent Insights</span>
            <strong>12</strong>
            <p>New community observations</p>
          </div>

          <div className="stat-card">
            <span>Pending FAQs</span>
            <strong>2</strong>
            <p>Drafts waiting for review</p>
          </div>
        </section>

        <section className="overview-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">RECENT ACTIVITY</p>
                <h3>Community signals</h3>
              </div>

              <span className="panel-badge">LIVE</span>
            </div>

            <div className="activity-item">
              <div className="activity-icon">!</div>

              <div>
                <h4>Authentication questions increasing</h4>
                <p>
                  Similar questions have appeared across multiple
                  conversations.
                </p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">?</div>

              <div>
                <h4>Recurring gameplay question detected</h4>
                <p>
                  A question is appearing repeatedly in the help channel.
                </p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">↗</div>

              <div>
                <h4>Bug discussion activity changed</h4>
                <p>Recent activity differs from the previous period.</p>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">QUICK ACTIONS</p>
                <h3>Investigate</h3>
              </div>
            </div>

            <div className="quick-actions">
              <a href="/investigate">Investigate a problem</a>

              <a href="/recurring-questions">
                Review recurring questions
              </a>

              <a href="/faq-review">Review FAQ drafts</a>

              <a href="/timeline">Explore community timeline</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}