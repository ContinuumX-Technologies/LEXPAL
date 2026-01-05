import { useState, useCallback } from "react";
import styles from "./LexpalAISection.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Conversation {
  _id: string;
  title: string;
  description: string;
  updatedAt?: string;
  messageCount?: number;
}

interface LexpalAISectionProps {
  conversations: Conversation[] | null;
  loading: boolean;
  error: string | null;
  router: AppRouterInstance;
}

// Quick prompt suggestions
const QUICK_PROMPTS = [
  { icon: "gavel", label: "Legal advice", prompt: "I need legal advice about..." },
  { icon: "description", label: "Document review", prompt: "Can you review this document..." },
  { icon: "help", label: "General question", prompt: "I have a question about..." },
];

export default function LexpalAISection({
  conversations,
  loading,
  error,
  router,
}: LexpalAISectionProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const isEmpty = !conversations || conversations.length === 0;

  // Format relative time
  const formatTime = useCallback((dateString?: string) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  // Handle new conversation
  const handleNewChat = useCallback(() => {
    router.push("/Lex-AI/new");
  }, [router]);

  // Handle continue conversation
  const handleContinue = useCallback((id: string) => {
    router.push(`/Lex-AI/${id}`);
  }, [router]);

  return (
    <section className={styles.section} id="lexpal-ai">
      {/* Hero Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroGlow} aria-hidden="true" />
        
        <div className={styles.heroContent}>
          {/* AI Icon */}
          <div className={styles.aiIconWrap}>
            <div className={styles.aiIcon}>
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className={styles.aiIconRing} />
            <div className={styles.aiIconRing2} />
          </div>

          {/* Hero Text */}
          <div className={styles.heroText}>
            <h2 className={styles.heroTitle}>Lexpal AI</h2>
            <p className={styles.heroSubtitle}>
              Your intelligent legal assistant, powered by advanced AI
            </p>
          </div>

          {/* Primary CTA */}
          <button className={styles.newChatBtn} onClick={handleNewChat}>
            <span className={styles.newChatIcon}>
              <span className="material-symbols-outlined">add</span>
            </span>
            <span className={styles.newChatText}>New Conversation</span>
            <span className={styles.newChatArrow}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </button>

          {/* Quick Prompts */}
          <div className={styles.quickPrompts}>
            {QUICK_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                className={styles.quickPromptBtn}
                onClick={handleNewChat}
              >
                <span className="material-symbols-outlined">{prompt.icon}</span>
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className={styles.recentSection}>
        <header className={styles.recentHeader}>
          <div className={styles.recentTitleWrap}>
            <span className={`material-symbols-outlined ${styles.recentIcon}`}>
              history
            </span>
            <h3 className={styles.recentTitle}>Recent Conversations</h3>
          </div>
          
          {!isEmpty && (
            <button className={styles.viewAllBtn}>
              View All
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}
        </header>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingWrap}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonLine} style={{ width: "60%" }} />
                <div className={styles.skeletonLine} style={{ width: "90%" }} />
                <div className={styles.skeletonLine} style={{ width: "40%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorWrap}>
            <span className={`material-symbols-outlined ${styles.errorIcon}`}>
              error
            </span>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryBtn}>
              <span className="material-symbols-outlined">refresh</span>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && isEmpty && (
          <div className={styles.emptyWrap}>
            <div className={styles.emptyIcon}>
              <span className="material-symbols-outlined">chat_bubble</span>
            </div>
            <h4 className={styles.emptyTitle}>No conversations yet</h4>
            <p className={styles.emptyText}>
              Start your first conversation with Lexpal AI to get intelligent legal assistance
            </p>
            <button className={styles.emptyBtn} onClick={handleNewChat}>
              <span className="material-symbols-outlined">add</span>
              Start a Conversation
            </button>
          </div>
        )}

        {/* Conversation Cards */}
        {!loading && !error && !isEmpty && (
          <div className={styles.cardsGrid}>
            {conversations?.slice(0, 4).map((convo) => (
              <article
                key={convo._id}
                className={`${styles.card} ${hoveredCard === convo._id ? styles.cardHovered : ""}`}
                onMouseEnter={() => setHoveredCard(convo._id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleContinue(convo._id)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconWrap}>
                    <span className="material-symbols-outlined">forum</span>
                  </div>
                  <span className={styles.cardTime}>
                    {formatTime(convo.updatedAt)}
                  </span>
                </div>

                <h4 className={styles.cardTitle}>{convo.title}</h4>
                <p className={styles.cardDesc}>{convo.description}</p>

                <div className={styles.cardFooter}>
                  <div className={styles.cardMeta}>
                    <span className="material-symbols-outlined">chat</span>
                    <span>{convo.messageCount || 0} messages</span>
                  </div>
                  
                  <button
                    className={styles.continueBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContinue(convo._id);
                    }}
                  >
                    Continue
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>

                {/* Hover Gradient */}
                <div className={styles.cardGradient} aria-hidden="true" />
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Section Divider */}
      <div className={styles.divider}>
        <div className={styles.dividerLine} />
      </div>
    </section>
  );
}