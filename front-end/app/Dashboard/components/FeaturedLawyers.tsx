// app/dashboard/FeaturedLawyers.tsx

import styles from "./FeaturedLawyers.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
/**
 * A horizontal snap scroller with hero cards (three slides) and a CTA button.
 * We preserve aspect ratios using CSS and background images.
 */

type FeaturedLawyersProps={
  router:AppRouterInstance
}

const SLIDES = [
  {
    name: "Sarah Miller",
    title: "Corporate & Business Law",
    rating: "5.0 (200+ cases)",
    quote: 'Dedicated and strategic legal counsel for startups and established enterprises.',
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBupzZPjiEBOh462m4y19_Kze-Pgjl0YwUwh70VyBtwciOqJH35_xv5c1SOCTMcS4oYZmZviFFnZlIUS2c3RWt-gPlpvufr1OdXOuo4YFab6Afbc4fLWDgelMojcKnS5f5cV3sLCl-lK40O-hoc7816Z2rnPxyxtp8_F4YXUmq2fcWwTXWwWN12prFmhXm2gEA3tbSUNGLOAH0-k46_WCqyHpOUatkOqpow8y76WVodrmEkKg5Yb1JdI2Ret46CdkuF43H97cAEjuyy",
  },
  {
    name: "David Chen",
    title: "Immigration Law Specialist",
    rating: "4.9 (150+ clients)",
    quote: "Guiding individuals and families through complex immigration processes with care.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi4TxfHuedDzKOR1dwa9vn4q6d6sJokXvpB593ZyoN0M3C_q5OlXl-X8bJ2obVmoc_Jlke5EfYpxDdGFfIHTsJWZdZ7_c9JzPl04eMcOb0z5IJ3AHNP4SJXPIaBdZNIbYGSAEV7TCsbeUWqRM_ssfiEeLnJ-ZEy0DmA29OGWh8UWSGS1N4HxZkUXfaCGleGuKA-t34a7yILmyiumgC_YFjaJF2LvxnmNFfN0JFw7jUOYwxVOfeJ7IFyHEPHYBTQ1eTMTdMAQAF2g3o",
  },
  {
    name: "Emily White",
    title: "Family & Divorce Law",
    rating: "4.8 (180+ cases)",
    quote: "Compassionate advocacy during challenging family legal matters.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi_yQzwnuschQRfmTEmaV0ulxtJA1kZZJYaqPo6Q3dquhv67ul0IAmE4ZThVRinEa9XBEMYw1IO8YXZqYjUrNnUzmQg99kPkehZns7y_3tX-6ISrxTLUXhSDdpVMoNbwaLy_ZkpY6-bZdCBiOGTtPul83n0TqrdgEcvRYsjfVPbR540ZFXvJr1GvjpEJm-q2W05TlZvbcDQzBSdfAjC7q59vB0TWnvDqndSINHtfl2LtjM0kdrd6eXz88XXISKGQI-z9Gx16kPigpK",
  },
];

export default function FeaturedLawyers({router}:FeaturedLawyersProps) {
  return (
    <section className={styles.wrap}>
      <div className={styles.slider}>
        {SLIDES.map((s) => (
          <article key={s.name} className={styles.card}>
            <img src={s.img} alt={`${s.name} banner`} className={styles.cardImage} />
            <div className={styles.overlay}>
              <h3 className={styles.name}>{s.name}</h3>
              <p className={styles.title}>{s.title}</p>
              <div className={styles.rating}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' 1` }}>
                  star
                </span>
                <span className={styles.ratingText}>{s.rating}</span>
              </div>
              <p className={styles.quote}>"{s.quote}"</p>
              <button className={styles.viewBtn}>View Profile</button>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.ctaWrap}>
        <button className={styles.cta} onClick={()=>{router.push("/Explore")}}>
          View All Experts
          <span className="material-symbols-outlined" style={{ fontVariationSettings: `'wght' 400` }}>
            arrow_right_alt
          </span>
        </button>
      </div>

      <div className={styles.hrWrap}>
        <div className={styles.hrLine} />
      </div>
    </section>
  );
}