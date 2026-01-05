import { useState } from "react";
import styles from "./EmptyChatState.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface EmptyChatStateProps {
  router?: AppRouterInstance;
}

const QUICK_ACTIONS = [
  {
    icon: "person_search",
    title: "Find a Lawyer",
    description: "Browse our expert network",
  },
  {
    icon: "auto_awesome",
    title: "Ask Lexpal AI",
    description: "Get instant legal guidance",
  },
  {
    icon: "bookmark",
    title: "View Saved",
    description: "Check your saved lawyers",
  },
];

export default function EmptyChatState({ router }: EmptyChatStateProps) {
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      {/* Main Card */}
      <div className={styles.card}>
        {/* Background */}
        <div className={styles.cardBg} aria-hidden="true">
          <div className={styles.bgGradient} />
          <div className={styles.bgBubbles}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.bgBubble}>
                <span className="material-symbols-outlined">chat_bubble</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Icon */}
          <div className={styles.iconWrap}>
            <div className={styles.iconInner}>
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
              >
                forum
              </span>
            </div>
            <div className={styles.iconPulse} />
          </div>

          {/* Text */}
          <div className={styles.textWrap}>
            <h3 className={styles.title}>No messages yet</h3>
            <p className={styles.subtitle}>
              Start a conversation with a lawyer to get expert legal assistance
            </p>
          </div>

          {/* CTA */}
          <button
            className={styles.ctaButton}
            onClick={() => router?.push("/Explore")}
          >
            <span className={styles.ctaIcon}>
              <span className="material-symbols-outlined">search</span>
            </span>
            <span className={styles.ctaText}>Find a Lawyer</span>
            <span className={styles.ctaArrow}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actions}>
        <p className={styles.actionsLabel}>Quick actions</p>
        <div className={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action, index) => (
            <button
              key={index}
              className={`${styles.actionCard} ${
                hoveredAction === index ? styles.actionCardHovered : ""
              }`}
              onMouseEnter={() => setHoveredAction(index)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => router?.push("/Explore")}
            >
              <div className={styles.actionIcon}>
                <span className="material-symbols-outlined">{action.icon}</span>
              </div>
              <div className={styles.actionText}>
                <span className={styles.actionTitle}>{action.title}</span>
                <span className={styles.actionDesc}>{action.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}