// app/dashboard/LexpalAISection.tsx
import React from "react";
import { useState } from "react";
import styles from "./LexpalAISection.module.css";
import Button1 from "@/UI_components/button";
import NoRecentConvos from "./NoRecentConvos";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


/**
 * Lexpal AI section with heading, Talk to AI CTA and recent conversation cards.
 * Preserves the card look, shadows and spacing from original.
 */


type LexpalAISectionProps={
  conversations: any[]|null,
  loading: boolean,
  error:string|null,
   router: AppRouterInstance;
}

export default function LexpalAISection({
  conversations,
  loading,
  error,
  router,
}: LexpalAISectionProps) {

  const convosEmpty = conversations?.length === 0;

  return (
    <section className={styles.wrap}>
      <h2 className={styles.heading}>Lexpal AI</h2>

      <Button1 onClick={() => router.push(`/Lex-AI/${"new"}`)} />

      <div className={styles.rowHeader}>
        <h3 className={styles.recentTitle}>Recent Conversation</h3>
      </div>

      {convosEmpty ? (
        <NoRecentConvos />
      ) : (
        <div className={styles.cards}>
          {conversations?.map((c) => (
            <article key={c._id} className={styles.card}>
              <p className={styles.cardTitle}>{c.title}</p>
              <p className={styles.cardText}>{c.description}</p>
              <p className={styles.meta}>Yesterday, 10:30 AM</p>
              <button
                className={styles.continueBtn}
                onClick={() => router.push(`/Lex-AI/${c._id}`)}
              >
                Continue Chat
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}