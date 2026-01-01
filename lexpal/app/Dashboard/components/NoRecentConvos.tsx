import React from "react";
import styles from "./NoRecentConvos.module.css";

export default function NoRecentConvos() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <span
          className={`material-symbols-outlined ${styles.icon}`}
          style={{ fontVariationSettings: "'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 48'" }}
        >
          psychology
        </span>

        <p className={styles.text}>
          No recent conversations yet. Start exploring legal insights with
          Lexpal AI!
        </p>
      </div>
    </div>
  );
}