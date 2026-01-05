"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./ChatsSection.module.css";
import { fetchChatList, ChatListItem } from "./chatList.api";
import EmptyChatState from "./EmptyChatState";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ChatsSectionProps {
  router: AppRouterInstance;
}

export default function ChatsSection({ router }: ChatsSectionProps) {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  // Fetch chats
  useEffect(() => {
    fetchChatList()
      .then(setChats)
      .catch((err) => setError(err.message || "Failed to load chats"))
      .finally(() => setLoading(false));
  }, []);

  // Format relative time
  const formatTime = useCallback((dateStr: string) => {
    if (!dateStr) return "";
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  // Get total unread count
  const totalUnread = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

  // Handle chat click
  const handleChatClick = useCallback(
    (userId: string) => {
      router.push(`/User-Chat/${userId}`);
    },
    [router]
  );

  // Handle see all
  const handleSeeAll = useCallback(() => {
    router.push("/chats");
  }, [router]);

  const isEmpty = !loading && chats.length === 0;

  return (
    <section className={styles.section} id="chats">
      {/* Section Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleWrap}>
            <div className={styles.titleIcon}>
              <span className="material-symbols-outlined">chat</span>
            </div>
            <h2 className={styles.title}>Messages</h2>
          </div>
          
          {!loading && !isEmpty && totalUnread > 0 && (
            <span className={styles.unreadBadge}>
              {totalUnread} new
            </span>
          )}
        </div>

        <div className={styles.headerRight}>
          {!loading && !isEmpty && (
            <>
              <button className={styles.composeBtn} aria-label="New message">
                <span className="material-symbols-outlined">edit_square</span>
              </button>
              
              <button className={styles.seeAllBtn} onClick={handleSeeAll}>
                See All
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingWrap}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonItem}>
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonLine} style={{ width: "40%" }} />
                <div className={styles.skeletonLine} style={{ width: "70%" }} />
              </div>
              <div className={styles.skeletonMeta}>
                <div className={styles.skeletonLine} style={{ width: "30px" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorWrap}>
          <div className={styles.errorIcon}>
            <span className="material-symbols-outlined">error</span>
          </div>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchChatList()
                .then(setChats)
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
            }}
          >
            <span className="material-symbols-outlined">refresh</span>
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {isEmpty && !error && <EmptyChatState router={router} />}

      {/* Chat List */}
      {!loading && !error && !isEmpty && (
        <div className={styles.chatList}>
          {chats.map((chat, index) => {
            const hasUnread = chat.unreadCount > 0;
            const isOnline = chat.online;

            return (
              <button
                key={chat.userId}
                className={`${styles.chatItem} ${hasUnread ? styles.chatItemUnread : ""} ${
                  hoveredChat === chat.userId ? styles.chatItemHovered : ""
                }`}
                onClick={() => handleChatClick(chat.userId)}
                onMouseEnter={() => setHoveredChat(chat.userId)}
                onMouseLeave={() => setHoveredChat(null)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Avatar */}
                <div className={styles.avatarWrap}>
                  <img
                    src={chat.profile_pic}
                    alt={`${chat.first_name} ${chat.last_name}`}
                    className={styles.avatar}
                    loading="lazy"
                  />
                  {isOnline && <span className={styles.onlineDot} />}
                </div>

                {/* Content */}
                <div className={styles.chatContent}>
                  <div className={styles.chatTop}>
                    <h3 className={styles.chatName}>
                      {chat.first_name} {chat.last_name}
                    </h3>
                    <span className={styles.chatTime}>
                      {formatTime(chat.lastMessageAt)}
                    </span>
                  </div>
                  
                  <div className={styles.chatBottom}>
                    <p className={styles.chatMessage}>
                      {chat.lastMessage || "No messages yet"}
                    </p>
                    
                    {hasUnread && (
                      <span className={styles.chatBadge}>
                        {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Chevron */}
                <span className={`material-symbols-outlined ${styles.chatChevron}`}>
                  chevron_right
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Section Divider */}
      <div className={styles.divider}>
        <div className={styles.dividerLine} />
      </div>
    </section>
  );
}