// app/dashboard/SavedLawyers.tsx
import  { useState, useEffect } from "react";
import styles from "./SavedLawyers.module.css";
import EmptySavedLawyers from "./SavedLawyer.alternate";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const CARDS = [
  {
    name: "Jane Doe",
    specialty: "Family Law",
    active: true,
    rating: "4.9",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPwK_q6QO_sV8lS4kUxNxOMXUYewedqdvlWKw3b6y696bSKytq8pyHxFh5231aO_zayynBLa07Pz0zuzmIdHvhI0N4F0pwgArcKcMeQGrUUmZcKZeU_QsuAIJbONRjo28ojWhYiLEVuTlJ2mrB2vQFiwEZGXAe5yivQs2Uh6X1A4YV-D0083Zh5xIl66-JzkiUO7cgbbJtf91wM3aDgOgzGj5pe573xSiWIIckJkv4M-hDGo0_w-FS7-rdhfRrK6e44ABhsjTYd1KM",
  },
  {
    name: "John Smith",
    specialty: "Criminal Defense",
    active: false,
    rating: "4.8",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5GFzK2v5quexqZzAj7MT0FnHPnHYHmd4w1NgCjXENGRfI5Yyvwr0vifTaosqUT6g7sKyVe9J9uoRhNA3FRIebLjq7e3tg6LLBlTwAkCIqGsvRAYG4BFUw8cEmY1OsH7sD_DqQJzpgQkL9BDZsXKZENPJXQWCv4ToZ2iS5uTP4KsE_J9z0KthIM_B_0AHKWXsmqYSNYGuqA5C87FVuO4Spr1bB1vJfcNcu-4mNzR-QOybAw0WKfcqOw34AvrBCpVU0gPPUq1IzPsCE",
  },
  {
    name: "Samantha Ray",
    specialty: "Corporate Law",
    active: true,
    rating: "5.0",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk2wHx-yGqr_735dL9742sHSwEK8ziI75LWMWGqyJ80zakY1pYW19NNcFHVb2PnD6AAefajRW0PUHGhNlm5RYABRll6LlQHuNp6iBDIjl_bF-7jn52N9SmDBxzzB30cjYxFdGxQVr2acXseOx4PY_n3T8CsuXiBXDDywpg7HHjdkxSrbFTs36YDZngZOJydvs3wCY1xEcvFQcpQtBTJfhdV39v9QiFPLLW19JcLMx1Ja8ibjvHr-MtZEpyU6hesbarN7BmiwPKRlNt",
  },
];

type SavedLawyersProps = {
  lawyers: any[] | null;
  loading: boolean;
  error: string | null;
  router: AppRouterInstance
};

export default function SavedLawyers({ lawyers, loading, error, router}: SavedLawyersProps) {
  const [lawyersEmpty, setLawyersEmpty] = useState<boolean>(false);

  // Use useEffect to update lawyersEmpty based on lawyers prop
  useEffect(() => {
    setLawyersEmpty(!lawyers || lawyers.length === 0);
  }, [lawyers]);

  // Handle loading state
  if (loading) {
    return (
      <section className={styles.wrap}>
        <div className={styles.header}>
          <h2 className={styles.title}>Saved Lawyers</h2>
        </div>
        <div className={styles.loading}>Loading...</div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section className={styles.wrap}>
        <div className={styles.header}>
          <h2 className={styles.title}>Saved Lawyers</h2>
        </div>
        <div className={styles.error}>Error: {error}</div>
      </section>
    );
  }

  // Check if lawyers is null or empty
  const isEmpty = !lawyers || lawyers.length === 0;

  return (
    <section className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Saved Lawyers</h2>
        {!isEmpty && <a className={styles.seeAll} href="#">See All</a>}
      </div>

      {isEmpty ? (
        <EmptySavedLawyers  router={router}/>
      ) : (
        <div className={styles.scrollRow}>
          {lawyers.map((l) => (
            <div key={l.id} className={styles.card}>
              <img src={l.profile_pic} alt={l.name} className={styles.img} />
              <div className={styles.cardBody}>
                <p className={styles.name}>{l.name}</p>
                <p className={styles.specialty}>{l.speciality.trim()}</p>
                <div className={styles.metaRow}>
                  {l.active ? (
                    <span className={styles.activeDot} />
                  ) : (
                    <span className={styles.lastSeen}>Last seen 2h ago</span>
                  )}
                  <div className={styles.rating}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: `'FILL' 1` }}
                    >
                      star
                    </span>
                    <span>{l.review_count}</span>
                  </div>
                </div>
                <button className={styles.chatBtn}>
                  <span className="material-symbols-outlined">chat</span> Chat
                </button>
                <button className={styles.profileBtn} onClick={()=>{router.push(`/Lawyer-Profile/${l.id}`)}}>
                  View Profile{" "}
                  <span className="material-symbols-outlined">arrow_right_alt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}