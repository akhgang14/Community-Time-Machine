"use client";

import { useState } from "react";

const channels = [
  { name: "general", unread: 3 },
  { name: "gameplay-help", unread: 7 },
  { name: "bugs", unread: 2 },
  { name: "suggestions", unread: 0 },
  { name: "lfg", unread: 0 },
];

const messages = [
  {
    user: "Alex",
    time: "10:42 AM",
    avatar: "A",
    text: "Has anyone else been having trouble logging in after the latest update?",
  },
  {
    user: "Jordan",
    time: "10:45 AM",
    avatar: "J",
    text: "Yes, I got the authentication error twice this morning.",
  },
  {
    user: "Maya",
    time: "10:48 AM",
    avatar: "M",
    text: "Same here. Restarting the game fixed it for me once.",
  },
  {
    user: "Alex",
    time: "10:51 AM",
    avatar: "A",
    text: "Interesting. Is this related to the new release?",
  },
  {
    user: "Jordan",
    time: "10:53 AM",
    avatar: "J",
    text: "I think so. I didn't see this before the update.",
  },
];

export default function CommunityView() {
  const [activeChannel, setActiveChannel] = useState("gameplay-help");

  return (
    <div className="community-view">
      <aside className="community-sidebar">
        <div className="community-title">
          <span className="community-icon">CT</span>

          <div>
            <strong>Community</strong>
            <span>Time Machine</span>
          </div>
        </div>

        <div className="channel-section">
          <p>CHANNELS</p>

          {channels.map((channel) => (
            <button
              key={channel.name}
              className={`channel-item ${
                activeChannel === channel.name ? "active" : ""
              }`}
              onClick={() => setActiveChannel(channel.name)}
            >
              <span>#</span>
              <span>{channel.name}</span>

              {channel.unread > 0 && (
                <span className="unread">{channel.unread}</span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <section className="chat-area">
        <div className="chat-header">
          <div>
            <span className="channel-hash">#</span>
            <strong>{activeChannel}</strong>
          </div>

          <span className="online-status">Community feed</span>
        </div>

        <div className="messages">
          {messages.map((message, index) => (
            <article className="message" key={index}>
              <div className="message-avatar">{message.avatar}</div>

              <div className="message-content">
                <div className="message-meta">
                  <strong>{message.user}</strong>
                  <span>{message.time}</span>
                </div>

                <p>{message.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="message-input">
          <input
            type="text"
            placeholder={`Message #${activeChannel}`}
            disabled
          />

          <button disabled>Send</button>
        </div>
      </section>

      <aside className="context-panel">
        <div className="context-header">
          <p>COMMUNITY INTELLIGENCE</p>
          <h3>Channel Context</h3>
        </div>

        <div className="context-card">
          <span className="context-label">ACTIVE TOPIC</span>
          <h4>Authentication issues</h4>

          <p>
            Several recent messages mention authentication problems following
            a recent update.
          </p>
        </div>

        <div className="context-card">
          <span className="context-label">HISTORICAL SIGNAL</span>

          <div className="signal-number">12</div>

          <p>
            Similar conversations found in historical community memory.
          </p>
        </div>

        <div className="context-card">
          <span className="context-label">QUICK ACTION</span>

          <button className="investigate-button">
            Investigate this issue
          </button>
        </div>
      </aside>
    </div>
  );
}