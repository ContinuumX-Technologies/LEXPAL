// app/dashboard/Header.tsx
import React from "react";
import styles from "./Header.module.css";

/**
 * Header component - sticky with left menu icon, centered welcome, right notifications.
 * This matches visual layout from your HTML.
 */
type props={
  firstName:String
}
export default function Header({firstName}:props) {
  return (
    <header className={styles.header}>
      <button className={styles.iconBtn} aria-label="menu">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'wght' 400` }}>
          menu
        </span>
      </button>

      <h1 className={styles.title}>
        <span className={styles.welcome}>welcome </span>
        <span className={styles.name}>{firstName}</span>
      </h1>

      <button className={styles.iconBtn} aria-label="notifications">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'wght' 400` }}>
          notifications
        </span>
      </button>
    </header>
  );
}