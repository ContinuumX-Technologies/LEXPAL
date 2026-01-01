import styles from "./SavedLawyer.alternate.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type props={
  router:AppRouterInstance
}
const EmptySavedLawyers = ({router}:props) => {
  return (
    // <div className={styles.container}>
      <div className={styles.card}>
        <span
          className={`material-symbols-outlined ${styles.icon}`}
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}
        >
          bookmark
        </span>

        <p className={styles.text}>
          No saved lawyers yet. Explore and curate your trusted legal team.
        </p>

        <button className={styles.button} onClick={()=>{router.push("/Explore")}}>Explore Lawyers</button>
      </div>
    // </div>
  );
};

export default EmptySavedLawyers;