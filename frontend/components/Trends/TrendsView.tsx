"use client";

import { useState } from "react";

type TrendPoint = {
  label: string;
  questions: number;
};

type Topic = {
  name: string;
  count: number;
  change: number;
};

type Channel = {
  name: string;
  messages: number;
  percentage: number;
};

const trendData: TrendPoint[] = [
  { label: "Sep 1", questions: 4 },
  { label: "Sep 4", questions: 6 },
  { label: "Sep 7", questions: 5 },
  { label: "Sep 10", questions: 9 },
  { label: "Sep 13", questions: 11 },
  { label: "Sep 16", questions: 15 },
  { label: "Sep 19", questions: 18 },
  { label: "Sep 22", questions: 13 },
  { label: "Sep 25", questions: 9 },
  { label: "Sep 28", questions: 7 },
];

const topics: Topic[] = [
  {
    name: "Authentication",
    count: 42,
    change: 18,
  },
  {
    name: "Deployment",
    count: 31,
    change: 9,
  },
  {
    name: "Matchmaking",
    count: 24,
    change: -6,
  },
  {
    name: "Game Updates",
    count: 19,
    change: 4,
  },
  {
    name: "Server Configuration",
    count: 15,
    change: -3,
  },
];

const channels: Channel[] = [
  {
    name: "#gameplay-help",
    messages: 128,
    percentage: 34,
  },
  {
    name: "#bugs",
    messages: 94,
    percentage: 25,
  },
  {
    name: "#general",
    messages: 76,
    percentage: 20,
  },
  {
    name: "#suggestions",
    messages: 51,
    percentage: 14,
  },
  {
    name: "#lfg",
    messages: 27,
    percentage: 7,
  },
];

const emergingIssues = [
  {
    title: "Authentication failures after latest update",
    activity: "18 recurring questions",
    change: "+42%",
    status: "Increasing",
  },
  {
    title: "Deployment configuration questions",
    activity: "12 recurring questions",
    change: "+24%",
    status: "Increasing",
  },
  {
    title: "Matchmaking disconnections",
    activity: "9 recurring questions",
    change: "-18%",
    status: "Declining",
  },
];

export default function TrendsView() {
  const [range, setRange] = useState("4 weeks");

  const maxQuestions = Math.max(
    ...trendData.map((point) => point.questions)
  );

  const totalQuestions = trendData.reduce(
    (sum, point) => sum + point.questions,
    0
  );

  return (
    <div className="trends-page">
      {/* Header */}
      <div className="trends-header">
        <div>
          <p className="eyebrow">COMMUNITY INTELLIGENCE</p>

          <h1>Community Trends</h1>

          <p className="page-description">
            Understand how topics and recurring questions are changing
            over time.
          </p>
        </div>

        <select
          className="range-select"
          value={range}
          onChange={(event) => setRange(event.target.value)}
        >
          <option>7 days</option>
          <option>4 weeks</option>
          <option>3 months</option>
        </select>
      </div>

      {/* Summary cards */}
      <section className="trend-summary-grid">
        <div className="trend-summary-card">
          <span>Recurring questions</span>

          <strong>42</strong>

          <small>Across tracked issues</small>
        </div>

        <div className="trend-summary-card">
          <span>Active topics</span>

          <strong>18</strong>

          <small>Currently observed</small>
        </div>

        <div className="trend-summary-card">
          <span>Questions this period</span>

          <strong>{totalQuestions}</strong>

          <small>Observed activity</small>
        </div>

        <div className="trend-summary-card">
          <span>Emerging issues</span>

          <strong>3</strong>

          <small>Require attention</small>
        </div>
      </section>

      {/* Main trend */}
      <section className="trend-card">
        <div className="trend-card-header">
          <div>
            <p className="section-label">ACTIVITY OVER TIME</p>
            <h2>Recurring Question Activity</h2>
          </div>

          <span className="trend-period">{range}</span>
        </div>

        <div className="chart">
          <div className="chart-y-axis">
            <span>{maxQuestions}</span>
            <span>{Math.round(maxQuestions * 0.75)}</span>
            <span>{Math.round(maxQuestions * 0.5)}</span>
            <span>{Math.round(maxQuestions * 0.25)}</span>
            <span>0</span>
          </div>

          <div className="chart-area">
            <div className="chart-grid-line line-one" />
            <div className="chart-grid-line line-two" />
            <div className="chart-grid-line line-three" />
            <div className="chart-grid-line line-four" />

            <div className="chart-bars">
              {trendData.map((point) => {
                const height =
                  (point.questions / maxQuestions) * 100;

                return (
                  <div className="chart-column" key={point.label}>
                    <div className="chart-value">
                      {point.questions}
                    </div>

                    <div
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                    />

                    <span>{point.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="chart-note">
          Activity peaked around September 19 and has decreased in the
          most recent observations.
        </div>
      </section>

      {/* Two-column section */}
      <div className="trend-two-column">
        {/* Topics */}
        <section className="trend-card">
          <div className="trend-card-header">
            <div>
              <p className="section-label">TOPICS</p>
              <h2>Topic Activity</h2>
            </div>
          </div>

          <div className="topic-list">
            {topics.map((topic) => (
              <div className="topic-row" key={topic.name}>
                <div className="topic-info">
                  <strong>{topic.name}</strong>

                  <span>{topic.count} questions</span>
                </div>

                <span
                  className={
                    topic.change >= 0
                      ? "topic-change increase"
                      : "topic-change decrease"
                  }
                >
                  {topic.change >= 0 ? "+" : ""}
                  {topic.change}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Channels */}
        <section className="trend-card">
          <div className="trend-card-header">
            <div>
              <p className="section-label">CHANNELS</p>
              <h2>Message Activity</h2>
            </div>
          </div>

          <div className="channel-list">
            {channels.map((channel) => (
              <div className="channel-row" key={channel.name}>
                <div className="channel-row-header">
                  <strong>{channel.name}</strong>

                  <span>{channel.messages}</span>
                </div>

                <div className="channel-progress">
                  <div
                    className="channel-progress-fill"
                    style={{
                      width: `${channel.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Emerging issues */}
      <section className="trend-card">
        <div className="trend-card-header">
          <div>
            <p className="section-label">ISSUES</p>
            <h2>Emerging Issues</h2>
          </div>
        </div>

        <div className="issue-list">
          {emergingIssues.map((issue) => (
            <div className="trend-issue" key={issue.title}>
              <div className="issue-main">
                <h3>{issue.title}</h3>

                <p>{issue.activity}</p>
              </div>

              <div className="issue-trend">
                <strong>{issue.change}</strong>

                <span
                  className={
                    issue.status === "Increasing"
                      ? "issue-status increasing"
                      : "issue-status declining"
                  }
                >
                  {issue.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interpretation */}
      <section className="trend-observation">
        <div className="observation-icon">i</div>

        <div>
          <h3>Observed pattern</h3>

          <p>
            Authentication and deployment questions have increased
            during the selected period, while matchmaking questions have
            decreased. These are observed activity patterns and do not
            by themselves establish why the changes occurred.
          </p>
        </div>
      </section>
    </div>
  );
}