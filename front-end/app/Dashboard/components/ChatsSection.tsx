"use client";

import React, { useEffect, useState } from "react";
import styles from "./ChatsSection.module.css";
import { fetchChatList, ChatListItem } from "./chatList.api";
import EmptyChatState from "../../Lawyer-Dashboard/emptyChat"; // your pre-written component

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type chatProps = {
  router: AppRouterInstance;
};

export default function ChatsSection({router}:chatProps) {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    fetchChatList()
      .then(setChats)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && chats.length === 0) {
    return (<section style={{ padding: "0 24px 48px 24px" }}>
      <div className={styles.headerRow}>
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: `'wght' 400`, fontSize: 28 ,color: "#007aff"}}
        >
          chat
        </span>
        <h2 className={styles.title}>Chats</h2>
      </div>

     
      <EmptyChatState />
      </section>);
  }

  return (
    <section style={{ padding: "0 24px 48px 24px" }}>

      <div className={styles.headerRow}>
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: `'wght' 400`, fontSize: 28 , color: "#007aff"}}
        >
          chat
        </span>
        <h2 className={styles.title}>Chats</h2>
      </div>

      <div className={styles.hrWrap}>
        <div className={styles.hrLine} />
      </div>

      <div className={styles.list}>
        {chats.map((chat) => {
          const unread = chat.unreadCount > 0;

          return (
            <button
              key={chat.userId}
              className={`${styles.item} ${unread ? styles.unread : ""}`}
              onClick={() => router.push(`/User-Chat/${chat.userId}`)}
            >
              {/* green accent if user is online */}
              <div
                className={`${styles.leftAccent} ${
                  chat.online ? styles.online : ""
                }`}
              />

              <img
                src={chat.profile_pic}
                alt={`${chat.first_name} ${chat.last_name}`}
                className={styles.avatar}
              />

              <div className={styles.content}>
                <p className={styles.name}>
                  {chat.first_name} {chat.last_name}
                </p>

                <p className={styles.subText}>
                  {unread
                    ? `${chat.unreadCount} New Message${
                        chat.unreadCount > 1 ? "s" : ""
                      }`
                    : chat.lastMessage || "No new messages"}
                </p>
              </div>

              <div className={styles.meta}>
                <span className={styles.time}>
                  {formatTime(chat.lastMessageAt)}
                </span>
                <span className="material-symbols-outlined">
                  chevron_right
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Utils
   ───────────────────────────────────────────── */

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();

  const hours = diff / (1000 * 60 * 60);
  if (hours < 24) return `${Math.floor(hours)}h ago`;

  const days = hours / 24;
  return `${Math.floor(days)}d ago`;
}