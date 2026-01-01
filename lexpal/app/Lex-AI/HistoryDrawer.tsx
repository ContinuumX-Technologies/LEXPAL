"use client";

import { useEffect, useState } from "react";
import styles from "./HistoryDrawer.module.css";

interface Conversation {
  _id: string;
  title: string | null;
  description: string;
  timestamp: Date;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;

  /**
   * Called when user selects a conversation
   * MainChat will:
   * - close socket
   * - set new convoId
   * - fetch history
   * - open new socket
   */
  onSelectConversation: (convoId: string) => void;
}

const HistoryDrawer = ({
  isOpen,
  onClose,
  onSelectConversation,
}: HistoryDrawerProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const server_url=process.env.NEXT_PUBLIC_DEV_SERVER_URL;

  /* ─────────────────────────────────────────────
     Fetch recent conversations WHEN drawer opens
     ───────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;

    const fetchRecentConvos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${server_url}/api/AI/recent-conversation`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) return;

        const data = await res.json();
        setConversations(data.conversations);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentConvos();
  }, [isOpen]);

  return (
    <>
      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
        <h3 className={styles.title}>Chat History</h3>

        <div className={styles.list}>
          {loading && <p className={styles.loading}>Loading...</p>}

          {!loading && conversations.length === 0 && (
            <p className={styles.empty}>No conversations yet</p>
          )}

          {!loading &&
            conversations.map((convo) => (
              <button
                key={convo._id}
                className={styles.item}
                onClick={() => {
                  /**
                   * IMPORTANT:
                   * We do NOT handle sockets or messages here.
                   * We ONLY tell MainChat which convo was selected.
                   */
                  onSelectConversation(convo._id);
                  onClose();
                }}
              >
                <p className={styles.itemTitle}>
                  {convo.title || "Untitled conversation"}
                </p>

                <p className={styles.itemSub}>
                  {convo.description || "Click to continue chat"}
                </p>
              </button>
            ))}
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${!isOpen ? styles.hidden : ""}`}
        onClick={onClose}
      />
    </>
  );
};

export default HistoryDrawer;