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
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./walkthrough.css"; // Import Apple-style theme

type SavedLawyer = any; // refine types to your schema
type Conversation = any; // refine types to your schema

export default function DashboardPage() {
  const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL || "http://localhost:5001";
  const router = useRouter();


  const [firstName, setFirstName] = useState<string>("");
  const [savedLawyers, setSavedLawyers] = useState<SavedLawyer[] | null>(null);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);
  const [hasSeenWalkthrough, setHasSeenWalkthrough] = useState<boolean | null>(null);

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
        setHasSeenWalkthrough(data.has_seen_walkthrough);
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

  const markWalkthroughSeen = async () => {
    try {
      await fetch(`${server_url}/api/user/walkthrough-seen`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      setHasSeenWalkthrough(true);
    } catch (err) {
      console.error("Failed to mark walkthrough as seen", err);
    }
  };

  useEffect(() => {
    if (hasSeenWalkthrough === false) {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: "Done",
        nextBtnText: "Next",
        prevBtnText: "Previous",
        stagePadding: 4, // Add padding around highlighted element
        popoverOffset: 20, // Distance from element
        steps: [
          {
            popover: {
              title: `Welcome to LexPal${firstName ? ", " + firstName : ""}!`,
              description: "Let's take a quick tour of your new legal dashboard to help you get started."
            }
          },
          {
            element: "#lexpal-ai",
            popover: {
              title: "AI Legal Assistant",
              description: "Ask complex legal questions and get instant, AI-powered answers. Start a new conversation here."
            }
          },
          {
            element: "#case-timeline",
            popover: {
              title: "Case Timeline",
              description: "Visual timeline of your legal journey. See upcoming events and past milestones."
            }
          },
          {
            element: "#all-cases",
            popover: {
              title: "Case Overview",
              description: "Track the status of all your ongoing cases. See what's active, pending, or resolved at a glance."
            }
          },
          {
            element: "#saved-lawyers",
            popover: {
              title: "Saved Lawyers",
              description: "Quickly access profiles of lawyers you've bookmarked. Perfect for shortlisting potential candidates."
            }
          },
          {
            element: "#chats",
            popover: {
              title: "Recent Messages",
              description: "Stay connected. Your latest conversations with lawyers appear here for easy access."
            }
          },
          {
            element: "#featured-lawyers",
            popover: {
              title: "Find Experts",
              description: "Discover top-rated legal professionals tailored to your needs. Browse and connect with experts."
            }
          },
        ],
        onDestroyed: () => {
          markWalkthroughSeen();
        },
      });

      // valid steps are only those that exist in DOM. driver.js handles missing elements gracefully usually, but waiting for data load is key.
      // fetchSavedLawyers sets loading false *after* data is set. But we depend on hasSeenWalkthrough which is set at same time.
      // A small timeout helps ensure DOM is rendered.

      const timer = setTimeout(() => {
        driverObj.drive();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasSeenWalkthrough, firstName]);

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