import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./FeaturedLawyers.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Lawyer {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviews: number;
  quote: string;
  img: string;
  available: boolean;
}

interface FeaturedLawyersProps {
  router: AppRouterInstance;
}

const LAWYERS: Lawyer[] = [
  {
    id: "sarah-miller",
    name: "Sarah Miller",
    title: "Senior Partner",
    specialty: "Corporate & Business Law",
    rating: 5.0,
    reviews: 200,
    quote: "Dedicated and strategic legal counsel for startups and established enterprises.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBupzZPjiEBOh462m4y19_Kze-Pgjl0YwUwh70VyBtwciOqJH35_xv5c1SOCTMcS4oYZmZviFFnZlIUS2c3RWt-gPlpvufr1OdXOuo4YFab6Afbc4fLWDgelMojcKnS5f5cV3sLCl-lK40O-hoc7816Z2rnPxyxtp8_F4YXUmq2fcWwTXWwWN12prFmhXm2gEA3tbSUNGLOAH0-k46_WCqyHpOUatkOqpow8y76WVodrmEkKg5Yb1JdI2Ret46CdkuF43H97cAEjuyy",
    available: true,
  },
  {
    id: "david-chen",
    name: "David Chen",
    title: "Immigration Specialist",
    specialty: "Immigration Law",
    rating: 4.9,
    reviews: 150,
    quote: "Guiding individuals and families through complex immigration processes with care.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi4TxfHuedDzKOR1dwa9vn4q6d6sJokXvpB593ZyoN0M3C_q5OlXl-X8bJ2obVmoc_Jlke5EfYpxDdGFfIHTsJWZdZ7_c9JzPl04eMcOb0z5IJ3AHNP4SJXPIaBdZNIbYGSAEV7TCsbeUWqRM_ssfiEeLnJ-ZEy0DmA29OGWh8UWSGS1N4HxZkUXfaCGleGuKA-t34a7yILmyiumgC_YFjaJF2LvxnmNFfN0JFw7jUOYwxVOfeJ7IFyHEPHYBTQ1eTMTdMAQAF2g3o",
    available: true,
  },
  {
    id: "emily-white",
    name: "Emily White",
    title: "Family Law Expert",
    specialty: "Family & Divorce Law",
    rating: 4.8,
    reviews: 180,
    quote: "Compassionate advocacy during challenging family legal matters.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi_yQzwnuschQRfmTEmaV0ulxtJA1kZZJYaqPo6Q3dquhv67ul0IAmE4ZThVRinEa9XBEMYw1IO8YXZqYjUrNnUzmQg99kPkehZns7y_3tX-6ISrxTLUXhSDdpVMoNbwaLy_ZkpY6-bZdCBiOGTtPul83n0TqrdgEcvRYsjfVPbR540ZFXvJr1GvjpEJm-q2W05TlZvbcDQzBSdfAjC7q59vB0TWnvDqndSINHtfl2LtjM0kdrd6eXz88XXISKGQI-z9Gx16kPigpK",
    available: false,
  },
];

export default function FeaturedLawyers({ router }: FeaturedLawyersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll carousel
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % LAWYERS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Scroll to active card
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(`.${styles.card}`);
    const activeCard = cards[activeIndex] as HTMLElement;

    if (activeCard) {
      const containerWidth = container.offsetWidth;
      const cardLeft = activeCard.offsetLeft;
      const cardWidth = activeCard.offsetWidth;
      const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  // Handle manual scroll
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.querySelector(`.${styles.card}`)?.clientWidth || 0;
    const gap = 16;
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < LAWYERS.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex]);

  // Navigate carousel
  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % LAWYERS.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + LAWYERS.length) % LAWYERS.length);
  }, []);

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span
            key={i}
            className={`material-symbols-outlined ${styles.starFilled}`}
            style={{ fontVariationSettings: `'FILL' 1` }}
          >
            star
          </span>
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <span
            key={i}
            className={`material-symbols-outlined ${styles.starHalf}`}
            style={{ fontVariationSettings: `'FILL' 1` }}
          >
            star_half
          </span>
        );
      } else {
        stars.push(
          <span key={i} className={`material-symbols-outlined ${styles.starEmpty}`}>
            star
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <section className={styles.section} id="featured-lawyers">
      {/* Section Header */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Featured Experts</h2>
          <p className={styles.subtitle}>
            Connect with top-rated legal professionals
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.navBtn}
            onClick={goPrev}
            aria-label="Previous"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            className={styles.navBtn}
            onClick={goNext}
            aria-label="Next"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </header>

      {/* Carousel */}
      <div
        className={styles.carousel}
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {LAWYERS.map((lawyer, index) => (
          <article
            key={lawyer.id}
            className={`${styles.card} ${index === activeIndex ? styles.cardActive : ""}`}
            onClick={() => goToSlide(index)}
          >
            {/* Card Image */}
            <div className={styles.cardImageWrap}>
              <img
                src={lawyer.img}
                alt={lawyer.name}
                className={styles.cardImage}
                loading="lazy"
              />
              <div className={styles.cardImageOverlay} />
              
              {/* Availability Badge */}
              {lawyer.available && (
                <div className={styles.availableBadge}>
                  <span className={styles.availableDot} />
                  Available Now
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className={styles.cardContent}>
              {/* Specialty Tag */}
              <span className={styles.specialtyTag}>{lawyer.specialty}</span>

              {/* Name & Title */}
              <h3 className={styles.cardName}>{lawyer.name}</h3>
              <p className={styles.cardTitle}>{lawyer.title}</p>

              {/* Rating */}
              <div className={styles.ratingWrap}>
                <div className={styles.stars}>{renderStars(lawyer.rating)}</div>
                <span className={styles.ratingScore}>{lawyer.rating}</span>
                <span className={styles.ratingCount}>({lawyer.reviews}+ reviews)</span>
              </div>

              {/* Quote */}
              <p className={styles.cardQuote}>"{lawyer.quote}"</p>

              {/* Actions */}
              <div className={styles.cardActions}>
                <button className={styles.primaryBtn}>
                  <span className="material-symbols-outlined">calendar_today</span>
                  Book Consultation
                </button>
                <button className={styles.secondaryBtn}>
                  <span className="material-symbols-outlined">person</span>
                  View Profile
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className={styles.pagination}>
        {LAWYERS.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* View All CTA */}
      <div className={styles.ctaSection}>
        <button
          className={styles.ctaButton}
          onClick={() => router.push("/Explore")}
        >
          <span className={styles.ctaText}>Explore All Experts</span>
          <span className={styles.ctaIcon}>
            <span className="material-symbols-outlined">arrow_forward</span>
          </span>
        </button>
      </div>

      {/* Section Divider */}
      <div className={styles.divider}>
        <div className={styles.dividerLine} />
      </div>
    </section>
  );
}