import { useState } from "react";
import styles from "./SavedLawyer.alternate.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface EmptySavedLawyersProps {
  router: AppRouterInstance;
}

const FEATURES = [
  {
    icon: "bookmark",
    title: "Save Favorites",
    description: "Keep track of lawyers you trust",
  },
  {
    icon: "compare",
    title: "Compare Easily",
    description: "Review and compare your saved picks",
  },
  {
    icon: "bolt",
    title: "Quick Access",
    description: "Reach out instantly when needed",
  },
];

const CATEGORIES = [
  "Corporate Law",
  "Immigration",
  "Family Law",
  "Real Estate",
  "Criminal Defense",
];

export default function EmptySavedLawyers({ router }: EmptySavedLawyersProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.container}>
      {/* Main Card */}
      <div className={styles.card}>
        {/* Background Decoration */}
        <div className={styles.cardBg} aria-hidden="true">
          <div className={styles.bgGradient} />
          <div className={styles.bgPattern}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.bgBookmark}>
                <span className="material-symbols-outlined">bookmark</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Animated Icon */}
          <div className={styles.iconWrap}>
            <div className={styles.iconOuter}>
              <div className={styles.iconInner}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                >
                  bookmark_add
                </span>
              </div>
              <div className={styles.iconPulse} />
            </div>
          </div>

          {/* Text */}
          <div className={styles.textWrap}>
            <h3 className={styles.title}>No saved lawyers yet</h3>
            <p className={styles.subtitle}>
              Build your trusted legal team by saving lawyers you'd like to work with
            </p>
          </div>

          {/* CTA Button */}
          <button
            className={styles.ctaButton}
            onClick={() => router.push("/Explore")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className={styles.ctaIcon}>
              <span className="material-symbols-outlined">explore</span>
            </span>
            <span className={styles.ctaText}>Explore Lawyers</span>
            <span className={styles.ctaArrow}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </button>
        </div>
      </div>

      {/* Feature Pills */}
      <div className={styles.features}>
        {FEATURES.map((feature, index) => (
          <div key={index} className={styles.featurePill}>
            <span className={`material-symbols-outlined ${styles.featureIcon}`}>
              {feature.icon}
            </span>
            <div className={styles.featureText}>
              <span className={styles.featureTitle}>{feature.title}</span>
              <span className={styles.featureDesc}>{feature.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Browse Categories */}
      <div className={styles.categories}>
        <p className={styles.categoriesLabel}>Popular specializations</p>
        <div className={styles.categoryTags}>
          {CATEGORIES.map((category, index) => (
            <button
              key={index}
              className={styles.categoryTag}
              onClick={() => router.push("/Explore")}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}