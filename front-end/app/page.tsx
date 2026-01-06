"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import styles from "./page.module.css"

export default function LexpalLanding() {
  const router = useRouter()
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Add Google Material Icons if not already present
    if (!document.querySelector('link[href*="material-symbols"]')) {
      const link = document.createElement("link")
      link.href =
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }

    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible)
          }
        })
      },
      { threshold: 0.1 },
    )

    const animatedElements = document.querySelectorAll(`.${styles.animateOnScroll}`)
    animatedElements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className="material-symbols-outlined">gavel</span>
          <span className={styles.logoText}>Lexpal</span>
        </div>
        <nav className={styles.nav}>
          <button className={styles.navButton} onClick={() => router.push("/Lawyer-Login")}>
            Login as Lawyer
          </button>
          <button className={styles.primaryButton} onClick={() => router.push("/Lawyer-SignUp")}>
            Create Lawyer Account
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>The AI Operating System for Modern Lawyers</h1>
          <p className={styles.heroSubtitle}>
            Manage clients, cases, documents, research, and drafting — all in one intelligent workspace.
          </p>
          <div className={styles.heroCTA}>
            <button className={styles.primaryButtonLarge} onClick={() => router.push("/Lawyer-SignUp")}>
              Create Lawyer Account
            </button>
            <button className={styles.secondaryButtonLarge} onClick={() => router.push("/Lawyer-Login")}>
              Login as Lawyer
            </button>
          </div>
          <div className={styles.clientCTA}>
            <button className={styles.textButton} onClick={() => router.push("/SignUp")}>
              Create Client Account
            </button>
            <span className={styles.separator}>|</span>
            <button className={styles.textButton} onClick={() => router.push("/Login")}>
              Client Login
            </button>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className={`${styles.trustStrip} ${styles.animateOnScroll}`}>
        <div className={styles.trustItem}>
          <span className="material-symbols-outlined">lock</span>
          <span>Secure & Confidential</span>
        </div>
        <div className={styles.trustItem}>
          <span className="material-symbols-outlined">account_balance</span>
          <span>Built for Indian Legal System</span>
        </div>
        <div className={styles.trustItem}>
          <span className="material-symbols-outlined">psychology</span>
          <span>AI-Assisted, Lawyer-Controlled</span>
        </div>
      </section>

      {/* Problem Solution Section */}
      <section className={styles.problemSolution}>
        <div className={`${styles.problemSide} ${styles.animateOnScroll}`}>
          <h2 className={styles.sectionTitle}>The Problem</h2>
          <ul className={styles.problemList}>
            <li className={styles.problemItem}>
              <span className="material-symbols-outlined">close</span>
              Too many tools
            </li>
            <li className={styles.problemItem}>
              <span className="material-symbols-outlined">close</span>
              Too many PDFs
            </li>
            <li className={styles.problemItem}>
              <span className="material-symbols-outlined">close</span>
              Too much manual drafting
            </li>
            <li className={styles.problemItem}>
              <span className="material-symbols-outlined">close</span>
              Too much context switching
            </li>
          </ul>
        </div>
        <div className={`${styles.solutionSide} ${styles.animateOnScroll}`}>
          <h2 className={styles.sectionTitle}>The Solution</h2>
          <ul className={styles.solutionList}>
            <li className={styles.solutionItem}>
              <span className="material-symbols-outlined">check_circle</span>
              One workspace per case
            </li>
            <li className={styles.solutionItem}>
              <span className="material-symbols-outlined">check_circle</span>
              AI that understands your case, not just keywords
            </li>
            <li className={styles.solutionItem}>
              <span className="material-symbols-outlined">check_circle</span>
              Research → Draft → File in one flow
            </li>
          </ul>
        </div>
      </section>

      {/* Core Features */}
      <section className={styles.features}>
        <h2 className={`${styles.sectionTitle} ${styles.centered}`}>Core Features</h2>
        <div className={styles.featureGrid}>
          {[
            {
              icon: "dashboard",
              title: "Lawyer CMS Dashboard",
              description: "Manage cases, appointments, and tasks",
            },
            {
              icon: "folder_shared",
              title: "Client & Case Workspaces",
              description: "All documents, timelines, and notes in one place",
            },
            {
              icon: "search",
              title: "AI Legal Research",
              description: "Natural-language search for judgments & statutes",
            },
            {
              icon: "edit_document",
              title: "AI-Assisted Drafting",
              description: "Templates + contextual drafting",
            },
            {
              icon: "push_pin",
              title: "Pin & Cite",
              description: "Pin judgments and laws directly into the case",
            },
            {
              icon: "summarize",
              title: "Smart Summaries",
              description: "AI-powered case summaries and document analysis",
            },
          ].map((feature, index) => (
            <div key={index} className={`${styles.featureCard} ${styles.animateOnScroll}`}>
              <div className={styles.featureIcon}>
                <span className="material-symbols-outlined">{feature.icon}</span>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2 className={`${styles.sectionTitle} ${styles.centered}`}>How It Works</h2>
        <div className={styles.timeline}>
          {[
            { step: 1, title: "Lawyer creates account", icon: "person_add" },
            { step: 2, title: "Client schedules appointment", icon: "event" },
            { step: 3, title: "Documents uploaded to case workspace", icon: "upload_file" },
            { step: 4, title: "AI understands the case context", icon: "psychology" },
            { step: 5, title: "Lawyer researches, drafts, and files faster", icon: "rocket_launch" },
          ].map((item, index) => (
            <div key={index} className={`${styles.timelineItem} ${styles.animateOnScroll}`}>
              <div className={styles.timelineNumber}>{item.step}</div>
              <div className={styles.timelineIcon}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <p className={styles.timelineText}>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lawyers vs Clients */}
      <section className={styles.forWho}>
        <div className={`${styles.forLawyers} ${styles.animateOnScroll}`}>
          <h2 className={styles.sectionTitle}>For Lawyers</h2>
          <ul className={styles.benefitsList}>
            <li>
              <span className="material-symbols-outlined">bolt</span>
              Faster drafting
            </li>
            <li>
              <span className="material-symbols-outlined">auto_awesome</span>
              Better research
            </li>
            <li>
              <span className="material-symbols-outlined">verified</span>
              Fewer mistakes
            </li>
            <li>
              <span className="material-symbols-outlined">trending_up</span>
              More cases handled
            </li>
          </ul>
        </div>
        <div className={`${styles.forClients} ${styles.animateOnScroll}`}>
          <h2 className={styles.sectionTitle}>For Clients</h2>
          <ul className={styles.benefitsList}>
            <li>
              <span className="material-symbols-outlined">cloud_upload</span>
              Easy document upload
            </li>
            <li>
              <span className="material-symbols-outlined">schedule</span>
              Appointment tracking
            </li>
            <li>
              <span className="material-symbols-outlined">forum</span>
              Transparent communication
            </li>
            <li>
              <span className="material-symbols-outlined">insights</span>
              Real-time case updates
            </li>
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCTA}>
        <div className={styles.ctaBackground}></div>
        <h2 className={styles.ctaTitle}>Stop switching tabs. Start practicing smarter.</h2>
        <div className={styles.ctaButtons}>
          <button className={styles.primaryButtonLarge} onClick={() => router.push("/Lawyer-SignUp")}>
            Create Lawyer Account
          </button>
          <button className={styles.secondaryButtonLarge} onClick={() => router.push("/Lawyer-Login")}>
            Login as Lawyer
          </button>
        </div>
        <div className={styles.clientCTAFooter}>
          <button className={styles.textButton} onClick={() => router.push("/SignUp")}>
            Create Client Account
          </button>
          <span className={styles.separator}>|</span>
          <button className={styles.textButton} onClick={() => router.push("/Login")}>
            Client Login
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span className="material-symbols-outlined">gavel</span>
            <span className={styles.logoText}>Lexpal</span>
          </div>
          <nav className={styles.footerLinks}>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
        <p className={styles.footerDisclaimer}>
          Lexpal is a legal-tech productivity platform. AI assists, lawyers decide.
        </p>
      </footer>
    </div>
  )
}
