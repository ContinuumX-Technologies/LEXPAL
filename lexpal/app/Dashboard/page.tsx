"use client";

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import FeaturedLawyers from "./components/FeaturedLawyers";
import LexpalAISection from "./components/LexpalAISection";
import SavedLawyers from "./components/SavedLawyers";
import ChatsSection from "./components/ChatsSection";
import { useRouter } from "next/navigation";

type SavedLawyer = any; // refine types to your schema
type Conversation = any; // refine types to your schema

export default function DashboardPage() {
  const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL || "http://localhost:5001";
  const router= useRouter();


  const [firstName, setFirstName]=useState<String>("");
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

  return (
    <div className="dashboard-root">
      <Header firstName={firstName} />
      <Navbar />
      <main style={{ paddingTop: "10px", paddingBottom: "64px" }}>
        <section id="featured-lawyers">
          <FeaturedLawyers router={router} />
        </section>

        <section id="lexpal-ai">
          {/* pass recent conversations as prop */}
          <LexpalAISection
            conversations={recentConvos}
            loading={recentLoading}
            error={recentError}
            router={router}
          />
        </section>

        <section id="saved-lawyers">
          {/* pass saved lawyers as prop */}
          <SavedLawyers
            lawyers={savedLawyers}
            loading={savedLoading}
            error={savedError}
            router={router}
          />
        </section>

        <section id="chats">
          <ChatsSection router={router} />
        </section>
      </main>
    </div>
  );
}