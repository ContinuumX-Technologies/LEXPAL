import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./SavedLawyers.module.css";
import EmptySavedLawyers from "./SavedLawyer.alternate";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Lawyer {
  id: string;
  name: string;
  speciality: string;
  profile_pic: string;
  active: boolean;
  review_count: number;
  rating?: number;
  lastSeen?: string;
}

interface SavedLawyersProps {
  lawyers: Lawyer[] | null;
  loading: boolean;
  error: string | null;
  router: AppRouterInstance;
}

export default function SavedLawyers({
  lawyers,
  loading,
  error,
  router,
}: SavedLawyersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Check scroll position for navigation arrows
  const checkScrollPosition = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [checkScrollPosition, lawyers]);

  // Scroll navigation
  const scroll = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = 260;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }, []);

  // Format last seen time
  const formatLastSeen = useCallback((lastSeen?: string) => {
    if (!lastSeen) return "Recently";
    return lastSeen;
  }, []);

  // Handle navigation
  const handleChat = useCallback(
    (id: string) => {
      router.push(`/User-Chat/${id}`);
    },
    [router]
  );

  const handleProfile = useCallback(
    (id: string) => {
      router.push(`/Lawyer-Profile/${id}`);
    },
    [router]
  );

  const handleSeeAll = useCallback(() => {
    router.push("/saved-lawyers");
  }, [router]);

  const isEmpty = !lawyers || lawyers.length === 0;

  return (
    <section className={styles.section} id="saved-lawyers">
      {/* Section Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleWrap}>
            <span className={`material-symbols-outlined ${styles.titleIcon}`}>
              bookmark
            </span>
            <h2 className={styles.title}>Saved Lawyers</h2>
          </div>
          {!isEmpty && !loading && (
            <span className={styles.count}>{lawyers?.length} saved</span>
          )}
        </div>

        <div className={styles.headerRight}>
          {!isEmpty && !loading && (
            <>
              {/* Navigation Arrows */}
              <div className={styles.navArrows}>
                <button
                  className={`${styles.navBtn} ${!canScrollLeft ? styles.navBtnDisabled : ""}`}
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll left"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  className={`${styles.navBtn} ${!canScrollRight ? styles.navBtnDisabled : ""}`}
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll right"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              {/* See All Link */}
              <button className={styles.seeAllBtn} onClick={handleSeeAll}>
                See All
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingWrap}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonBody}>
                <div className={styles.skeletonLine} style={{ width: "70%" }} />
                <div className={styles.skeletonLine} style={{ width: "50%" }} />
                <div className={styles.skeletonLine} style={{ width: "40%" }} />
                <div className={styles.skeletonBtns}>
                  <div className={styles.skeletonBtn} />
                  <div className={styles.skeletonBtn} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorWrap}>
          <div className={styles.errorIcon}>
            <span className="material-symbols-outlined">error</span>
          </div>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryBtn}>
            <span className="material-symbols-outlined">refresh</span>
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {isEmpty && !loading && !error && <EmptySavedLawyers router={router} />}

      {/* Lawyer Cards */}
      {!isEmpty && !loading && !error && (
        <div className={styles.carouselWrap}>
          {/* Gradient Fade Left */}
          {canScrollLeft && <div className={styles.fadeLeft} />}

          {/* Cards Container */}
          <div className={styles.carousel} ref={scrollRef}>
            {lawyers?.map((lawyer) => (
              <article
                key={lawyer.id}
                className={`${styles.card} ${
                  hoveredCard === lawyer.id ? styles.cardHovered : ""
                }`}
                onMouseEnter={() => setHoveredCard(lawyer.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Image */}
                <div className={styles.cardImageWrap}>
                  <img
                    src={lawyer.profile_pic}
                    alt={lawyer.name}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <div className={styles.cardImageOverlay} />

                  {/* Status Badge */}
                  {lawyer.active ? (
                    <div className={styles.statusBadge}>
                      <span className={styles.statusDot} />
                      Available
                    </div>
                  ) : (
                    <div className={`${styles.statusBadge} ${styles.statusOffline}`}>
                      <span className="material-symbols-outlined">schedule</span>
                      {formatLastSeen(lawyer.lastSeen)}
                    </div>
                  )}

                  {/* Save Button */}
                  <button className={styles.saveBtn} aria-label="Remove from saved">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardName}>{lawyer.name}</h3>
                  <p className={styles.cardSpecialty}>{lawyer.speciality?.trim()}</p>

                  {/* Rating */}
                  <div className={styles.ratingWrap}>
                    <div className={styles.stars}>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    </div>
                    <span className={styles.ratingScore}>
                      {lawyer.rating || "4.9"}
                    </span>
                    <span className={styles.ratingCount}>
                      ({lawyer.review_count} reviews)
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.cardActions}>
                    <button
                      className={styles.chatBtn}
                      onClick={() => handleChat(lawyer.id)}
                    >
                      <span className="material-symbols-outlined">chat</span>
                      Chat
                    </button>
                    <button
                      className={styles.profileBtn}
                      onClick={() => handleProfile(lawyer.id)}
                    >
                      <span className="material-symbols-outlined">person</span>
                      Profile
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Gradient Fade Right */}
          {canScrollRight && <div className={styles.fadeRight} />}
        </div>
      )}
    </section>
  );
}