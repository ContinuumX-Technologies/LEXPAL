"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import {
  fetchUserProfile,
  fetchChatHistory,
  createChatSocket,
  ChatMessage,
  UserProfile,
} from "./chat";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router= useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ─────────────────────────────────────────────
     INITIAL LOAD
     ───────────────────────────────────────────── */
  useEffect(() => {
    if (!id) return;

    // fetch header info
    fetchUserProfile(id).then(setProfile);

    // fetch initial history
    fetchChatHistory(id).then((data) => {
      setMessages(data.messages);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
      scrollToBottom();
    });

    // open socket
    const socket = createChatSocket(id);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "check_online" }));
    };

    socket.onmessage = (e) => {
      const payload = JSON.parse(e.data);

      if (payload.type === "receiver_online") {
        setIsOnline(payload.online);
      }

      if (payload.type === "incoming_message") {
        setMessages((prev) => [...prev, payload.message]);
        scrollToBottom();
      }

      if (payload.type === "message_delivered" || payload.type === "message_read") {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === payload.messageId
              ? { ...m, ...payload.update }
              : m
          )
        );
      }
    };

    return () => socket.close();
  }, [id]);

  /* ─────────────────────────────────────────────
     HELPERS
     ───────────────────────────────────────────── */
  const scrollToBottom = () =>
    setTimeout(() => bottomRef.current?.scrollIntoView(), 50);

  const loadOlderMessages = async () => {
    if (!hasMore || loadingMore || !cursor) return;

    setLoadingMore(true);
    const data = await fetchChatHistory(id, cursor);

    setMessages((prev) => [...data.messages, ...prev]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
    setLoadingMore(false);
  };

  /* ─────────────────────────────────────────────
     SEND MESSAGE
     ───────────────────────────────────────────── */
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "send_message",
        receiverId:id,
        content: input,
      })
    );
     

    setInput("");
  };

  /* ─────────────────────────────────────────────
     SCROLL HANDLER (LAZY LOAD)
     ───────────────────────────────────────────── */
  const onScroll = () => {
    if (!chatRef.current) return;
    if (chatRef.current.scrollTop < 40) {
      loadOlderMessages();
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button className={styles.backButton} onClick={()=>{router.back()}}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <div className={styles.headerDivider} />

          {profile && (
            <div className={styles.userInfo}>
              <div className={styles.avatarWrapper}>
                <div
                  className={styles.avatar}
                  style={{ backgroundImage: `url(${profile.profile_pic})` }}
                />
                {isOnline && <span className={styles.onlineDot} />}
              </div>

              <div className={styles.userText}>
                <h2>{profile.first_name} {profile.last_name}</h2>
                <span>{isOnline ? "Active now" : "Offline"}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className={styles.chat} ref={chatRef} onScroll={onScroll}>
        {loadingMore && <div className={styles.dateChip}>Loading…</div>}

        {messages.map((msg) => {
          const outgoing = msg.sender_id !== id;

          return (
            <div
              key={msg._id}
              className={`${styles.messageRow} ${outgoing ? styles.outgoing : ""}`}
            >
              {!outgoing && (
                <div
                  className={styles.smallAvatar}
                  style={{ backgroundImage: `url(${profile?.profile_pic})` }}
                />
              )}

              <div className={styles.bubbleGroup}>
                <div
                  className={
                    outgoing
                      ? styles.bubbleOutgoing
                      : styles.bubbleIncoming
                  }
                >
                  {msg.content}
                </div>

                <span className={styles.timestamp}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}

                  {outgoing && (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: msg.read_at
                          ? "green"
                          : msg.delivered_at
                          ? "gray"
                          : "gray",
                      }}
                    >
                      {msg.read_at
                        ? "done_all"
                        : msg.delivered_at
                        ? "done_all"
                        : "done"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className={styles.sendButton} onClick={sendMessage}>
          <span className="material-symbols-outlined">send</span>
        </button>
      </footer>
    </div>
  );
}