import styles from "./emptyChat.module.css";

export default function EmptyChatState() {
  return (
    <div className={styles.wrapper}>
      {/* Divider */}
      <div className={styles.dividerWrapper}>
        <div className={styles.divider} />
      </div>

      {/* Card */}
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <span
            className={`material-symbols-outlined ${styles.icon}`}
            style={{
              fontVariationSettings:
                "'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 48",
            }}
          >
            question_answer
          </span>

          <p className={styles.text}>
            No conversations yet! Start your first chat to see them here.
          </p>

          {/* <button className={styles.button}>
            Start a New Chat
          </button> */}
        </div>
      </div>
    </div>
  );
}