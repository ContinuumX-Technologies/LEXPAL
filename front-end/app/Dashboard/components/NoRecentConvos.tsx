import React, { useState } from "react";
import styles from "./NoRecentConvos.module.css";

interface NoRecentConvosProps {
  onStartChat?: () => void;
}

const SUGGESTIONS = [
  {
    icon: "gavel",
    title: "Legal Questions",
    description: "Ask about contracts, rights, or regulations",
  },
  {
    icon: "description",
    title: "Document Review",
    description: "Get help understanding legal documents",
  },
  {
    icon: "lightbulb",
    title: "Legal Guidance",
    description: "Explore options for your situation",
  },
];

export default function NoRecentConvos({ onStartChat }: NoRecentConvosProps) {
  const [hoveredSuggestion, setHoveredSuggestion] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      {/* Main Empty State Card */}
      <div className={styles.card}>
        {/* Decorative Background */}
        <div className={styles.cardBg} aria-hidden="true">
          <div className={styles.bgCircle1} />
          <div className={styles.bgCircle2} />
          <div className={styles.bgCircle3} />
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Animated Icon */}
          <div className={styles.iconWrap}>
            <div className={styles.iconInner}>
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
              >
                chat_bubble
              </span>
            </div>
            <div className={styles.iconRing} />
            <div className={styles.iconDots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>

          {/* Text */}
          <div className={styles.textWrap}>
            <h3 className={styles.title}>No conversations yet</h3>
            <p className={styles.subtitle}>
              Start your first conversation with Lexpal AI and get intelligent legal assistance
            </p>
          </div>

          {/* Primary CTA */}
          <button className={styles.ctaButton} onClick={onStartChat}>
            <span className={styles.ctaIcon}>
              <span className="material-symbols-outlined">add</span>
            </span>
            <span className={styles.ctaText}>Start a Conversation</span>
            <span className={styles.ctaArrow}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </button>
        </div>
      </div>

      {/* Suggestion Cards */}
      <div className={styles.suggestions}>
        <p className={styles.suggestionsLabel}>Popular topics to explore</p>
        
        <div className={styles.suggestionsGrid}>
          {SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              className={`${styles.suggestionCard} ${
                hoveredSuggestion === index ? styles.suggestionCardHovered : ""
              }`}
              onMouseEnter={() => setHoveredSuggestion(index)}
              onMouseLeave={() => setHoveredSuggestion(null)}
              onClick={onStartChat}
            >
              <div className={styles.suggestionIcon}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'wght' 400" }}
                >
                  {suggestion.icon}
                </span>
              </div>
              <div className={styles.suggestionText}>
                <span className={styles.suggestionTitle}>{suggestion.title}</span>
                <span className={styles.suggestionDesc}>{suggestion.description}</span>
              </div>
              <span className={`material-symbols-outlined ${styles.suggestionArrow}`}>
                arrow_forward
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Help Link */}
      <div className={styles.helpWrap}>
        <button className={styles.helpLink}>
          <span className="material-symbols-outlined">help</span>
          <span>Learn how Lexpal AI can help you</span>
        </button>
      </div>
    </div>
  );
}