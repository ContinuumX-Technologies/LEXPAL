"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import FeaturedLawyers from "./components/FeaturedLawyers";
import LexpalAISection from "./components/LexpalAISection";
import SavedLawyers from "./components/SavedLawyers";
import ChatsSection from "./components/ChatsSection";
import CaseTimeline from "./components/CaseTimeline";
import CaseStatusOverview from "./components/CaseStatusOverview";
import QuickActions from "./components/QuickActions";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type SavedLawyer = any; // refine types to your schema
type Conversation = any; // refine types to your schema

export default function DashboardPage() {
  const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL || "http://localhost:5001";
  const router = useRouter();


  const [firstName, setFirstName] = useState<string>("");
  const [savedLawyers, setSavedLawyers] = useState<SavedLawyer[] | null>(null);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  const [recentConvos, setRecentConvos] = useState<Conversation[] | null>(null);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function fetchSavedLawyers() {
      setSavedLoading(true);
      setSavedError(null);
      try {
        const res = await fetch(`${server_url}/api/user/saved-lawyers/fetch/all-saved`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: ac.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Saved lawyers fetch failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        // assume response shape { saved: [...] } or adjust as needed
        setSavedLawyers(data.saved_lawyers ?? data);
        setFirstName(data.name);
      } catch (err: any) {
        if (err.name !== "AbortError") setSavedError(err.message || "Unknown error");
      } finally {
        setSavedLoading(false);
      }
    }

    async function fetchRecentConvos() {
      setRecentLoading(true);
      setRecentError(null);
      try {
        const res = await fetch(`${server_url}/api/AI/recent-conversation?n=3`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: ac.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Recent convos fetch failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        // assume response shape { conversations: [...] } or adjust as needed
        setRecentConvos(data.conversations ?? data);
      } catch (err: any) {
        if (err.name !== "AbortError") setRecentError(err.message || "Unknown error");
      } finally {
        setRecentLoading(false);
      }
    }

    fetchSavedLawyers();
    fetchRecentConvos();

    return () => ac.abort();
  }, [server_url]);

  // Date formatter
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.dashboardRoot}>
      <Navbar firstName={firstName} />

      <main className={styles.mainContent}>
        {/* Intro / Header */}
        <section className={styles.introSection}>
          <div className={styles.date}>{today}</div>
          <h1 className={styles.greeting}>
            Good Morning{firstName ? `, ${firstName}` : ""}
          </h1>
        </section>

        {/* Bento Grid Layout */}
        <div className={styles.bentoGrid}>

          {/* Tile 1: AI Hero (Span 8) */}
          <div id="lexpal-ai" className={`${styles.span8} ${styles.tile}`}>
            <LexpalAISection
              conversations={recentConvos}
              loading={recentLoading}
              error={recentError}
              router={router}
            />
          </div>

          {/* Tile 2: Quick Actions (Span 4) */}
          <div className={`${styles.span4} ${styles.tile}`}>
            <QuickActions />
          </div>

          {/* Tile 3: Saved Lawyers (Span 6) */}
          <div id="saved-lawyers" className={`${styles.span6} ${styles.tile}`}>
            <SavedLawyers
              lawyers={savedLawyers}
              loading={savedLoading}
              error={savedError}
              router={router}
            />
          </div>

          {/* Tile 4: Recent Chats (Span 6) */}
          <div id="chats" className={`${styles.span6} ${styles.tile}`}>
            <ChatsSection router={router} />
          </div>

          {/* Tile 6: Case Timeline (Span 6) - NEW */}
          <div id="case-timeline" className={`${styles.span6} ${styles.tile}`}>
            <CaseTimeline />
          </div>

          {/* Tile 7: Case Status Overview (Span 6) - NEW */}
          <div id="all-cases" className={`${styles.span6} ${styles.tile}`}>
            <CaseStatusOverview />
          </div>

          {/* Tile 5: Featured Lawyers (Span 12) */}
          <div id="featured-lawyers" className={`${styles.span12} ${styles.tile}`}>
            <FeaturedLawyers router={router} />
          </div>

        </div>
      </main>
    </div>
  );
}