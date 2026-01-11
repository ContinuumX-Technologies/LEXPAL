// page.tsx
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import styles from "./page.module.css"

import one from "@/public/assets/1.jpeg";
import three from "@/public/assets/3.jpeg";
import five from "@/public/assets/5.jpeg";

import two from "@/public/assets/2.jpeg";
import four from "@/public/assets/4.jpeg";
import six from "@/public/assets/6.jpeg";

export default function LexpalLanding() {
  const router = useRouter()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [userType, setUserType] = useState<"lawyer" | "client">("lawyer")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // Hero Case Flow Animation States
  const [activeFlowStep, setActiveFlowStep] = useState(0)
  const [isFlowPlaying, setIsFlowPlaying] = useState(true)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  // Comparison Section States
  const [comparisonInView, setComparisonInView] = useState(false)
  const [activeShowcaseImage, setActiveShowcaseImage] = useState<number | null>(null);

  // Case Flow Data for Lawyers
  const lawyerCaseFlow = [
    {
      id: 1,
      icon: "person_add",
      title: "Client Inquiry",
      shortTitle: "Inquiry",
      description: "Client submits case details through secure portal",
      details: ["Automated intake forms", "Document upload", "Initial case assessment"],
      color: "#64748b", // Slate 500 - Neutral Start
      duration: "5 min"
    },
    {
      id: 2,
      icon: "upload_file",
      title: "Document Collection",
      shortTitle: "Documents",
      description: "All case documents organized in one workspace",
      details: ["Secure cloud storage", "Auto-categorization", "Version control"],
      color: "#3b82f6", // Blue 500 - Active
      duration: "10 min"
    },
    {
      id: 3,
      icon: "psychology",
      title: "AI Analysis",
      shortTitle: "Analysis",
      description: "AI analyzes documents and extracts key information",
      details: ["Smart summarization", "Key facts extraction", "Risk assessment"],
      color: "#1e40af", // Blue 800 - Deep Work
      duration: "2 min"
    },
    {
      id: 4,
      icon: "search",
      title: "Legal Research",
      shortTitle: "Research",
      description: "AI finds relevant precedents and statutes",
      details: ["Case law matching", "Statute references", "Similar judgments"],
      color: "#1e3a8a", // Blue 900 - Authority
      duration: "5 min"
    },
    {
      id: 5,
      icon: "edit_document",
      title: "Draft Generation",
      shortTitle: "Drafting",
      description: "AI-assisted document drafting with templates",
      details: ["Smart templates", "Auto-citations", "Format compliance"],
      color: "#d97706", // Amber 600 - Value Accent
      duration: "15 min"
    },
    {
      id: 6,
      icon: "task_alt",
      title: "Review & File",
      shortTitle: "Filing",
      description: "Final review and court filing preparation",
      details: ["Compliance check", "E-filing ready", "Deadline tracking"],
      color: "#15803d", // Green 700 - Completion
      duration: "10 min"
    }
  ]

  // Case Flow Data for Clients
  const clientCaseFlow = [
    {
      id: 1,
      icon: "search",
      title: "Find Lawyer",
      shortTitle: "Search",
      description: "Browse verified lawyers by expertise and location",
      details: ["Verified profiles", "Ratings & reviews", "Expertise matching"],
      color: "#14b8a6", // Teal 500 - Welcoming
      duration: "5 min"
    },
    {
      id: 2,
      icon: "calendar_month",
      title: "Book Consultation",
      shortTitle: "Book",
      description: "Schedule appointment at your convenience",
      details: ["Real-time availability", "Video/In-person options", "Instant confirmation"],
      color: "#0d9488", // Teal 600 - Trust
      duration: "2 min"
    },
    {
      id: 3,
      icon: "upload_file",
      title: "Share Documents",
      shortTitle: "Upload",
      description: "Securely upload all case-related documents",
      details: ["Encrypted storage", "Easy organization", "Lawyer access control"],
      color: "#0891b2", // Cyan 600 - Secure
      duration: "10 min"
    },
    {
      id: 4,
      icon: "forum",
      title: "Communicate",
      shortTitle: "Chat",
      description: "Direct messaging with your legal team",
      details: ["Secure messaging", "File sharing", "Query tracking"],
      color: "#0284c7", // Sky 600 - Communication
      duration: "Ongoing"
    },
    {
      id: 5,
      icon: "monitoring",
      title: "Track Progress",
      shortTitle: "Track",
      description: "Real-time updates on your case status",
      details: ["Status timeline", "Hearing dates", "Document status"],
      color: "#2563eb", // Blue 600 - Progress
      duration: "24/7"
    },
    {
      id: 6,
      icon: "celebration",
      title: "Case Resolution",
      shortTitle: "Resolution",
      description: "Complete transparency until case conclusion",
      details: ["Final documents", "Outcome summary", "Feedback option"],
      color: "#059669", // Emerald 600 - Success
      duration: "Varies"
    }
  ]
  const caseFlow = userType === "lawyer" ? lawyerCaseFlow : clientCaseFlow

  const lawyerShowcaseSections = [
    {
      id: 'problem',
      subtitle: 'The Problem',
      title: 'Drowning In\nPaperwork',
      description: 'Hours lost to manual research. Nights spent drafting from scratch. The endless cycle of administrative burden that keeps you from what matters most — practicing law.',
      image: one, // Replace with your image
      theme: 'dark' as const,
      stats: [
        { value: '11', unit: '+hrs', label: 'Daily Grind' },
        { value: '70', unit: '%', label: 'Admin Work' },
        { value: '₹1.5L', unit: 'Cr', label: 'Annual Loss' }
      ]
    },
    {
      id: 'solution',
      subtitle: 'The Solution',
      title: 'Practice Law,\nNot Paperwork',
      description: 'AI-powered research in seconds. Smart drafting that learns your style. Everything organized, automated, and optimized — so you can focus on winning cases.',
      image: three, // Replace with your image
      theme: 'light' as const,
      stats: [
        { value: '10', unit: 'x', label: 'Faster Research' },
        { value: '82', unit: '%', label: 'Time Saved' },
        { value: '2', unit: 'hrs', label: 'Daily Work' }
      ]
    },
    {
      id: 'experience',
      subtitle: 'The Experience',
      title: 'Your AI-Powered\nLegal Assistant',
      description: 'From client intake to case resolution — experience a seamless workflow powered by AI that understands Indian law. Research, draft, organize, and win.',
      image: five, // Replace with your image
      theme: 'dark' as const,
      stats: [
        { value: '500', unit: '+', label: 'Lawyers Trust Us' },
        { value: '99.9', unit: '%', label: 'Uptime' },
        { value: '24', unit: '/7', label: 'AI Support' }
      ]
    }
  ];

  const clientShowcaseSections = [
    {
      id: 'problem',
      subtitle: 'The Problem',
      title: 'Lost In The\nLegal Maze',
      description: 'Days spent searching for the right lawyer. Weeks of uncertainty. The frustrating cycle of phone calls, office visits, and zero visibility into your own case.',
      image: two, // Replace with your image
      theme: 'dark' as const,
      stats: [
        { value: 'Days', unit: '', label: 'Finding Lawyers' },
        { value: '0', unit: '%', label: 'Visibility' },
        { value: '∞', unit: '', label: 'Anxiety' }
      ]
    },
    {
      id: 'solution',
      subtitle: 'The Solution',
      title: 'Legal Journey,\nMade Simple',
      description: 'Find verified lawyers instantly. Book consultations online. Track your case 24/7. Complete transparency and peace of mind, from start to resolution.',
      image: four, // Replace with your image
      theme: 'light' as const,
      stats: [
        { value: '500', unit: '+', label: 'Verified Lawyers' },
        { value: '95', unit: '%', label: 'Time Saved' },
        { value: '24', unit: '/7', label: 'Case Access' }
      ]
    },
    {
      id: 'experience',
      subtitle: 'The Experience',
      title: 'Your Case,\nOne Tap Away',
      description: 'Book like Uber. Track like Amazon. Our app connects you to verified lawyers in minutes. Step into clarity, step out with confidence.',
      image: six, // Replace with your image
      theme: 'dark' as const,
      stats: [
        { value: '5', unit: 'min', label: 'Avg. Booking' },
        { value: '50', unit: '+', label: 'Cities' },
        { value: '100', unit: '%', label: 'Transparency' }
      ]
    }
  ];

  const showcaseSections = userType === "lawyer" ? lawyerShowcaseSections : clientShowcaseSections;

  // Content configurations
  const lawyerContent = {
    hero: {
      badge: "AI-Powered Legal Practice Management",
      title: "Watch Your Cases",
      titleHighlight: "Flow Seamlessly",
      subtitle: "From first consultation to final verdict — experience the future of legal practice management."
    },
    stats: [
      { number: "10x", label: "Faster Research" },
      { number: "82%", label: "Time Saved" },
      { number: "99.9%", label: "Uptime SLA" }
    ],
    features: [
      {
        icon: "dashboard",
        title: "Practice Dashboard",
        description: "Comprehensive case management with real-time insights and analytics",
        image: "/images/feature-dashboard.jpg"
      },
      {
        icon: "folder_shared",
        title: "Smart Workspaces",
        description: "Organized documents, timelines, and research per case automatically",
        image: "/images/feature-workspace.jpg"
      },
      {
        icon: "search",
        title: "AI Legal Research",
        description: "Natural language search across millions of Indian judgments",
        image: "/images/feature-research.jpg"
      },
      {
        icon: "edit_document",
        title: "Smart Drafting",
        description: "AI-powered document generation with court-specific templates",
        image: "/images/feature-drafting.jpg"
      }
    ],
    benefits: [
      { icon: "speed", title: "10x Faster", desc: "AI-powered research & drafting" },
      { icon: "verified", title: "Fewer Errors", desc: "AI-assisted review process" },
      { icon: "groups", title: "Happy Clients", desc: "Better service, faster results" },
      { icon: "trending_up", title: "Grow Practice", desc: "Handle more cases efficiently" }
    ],
    testimonials: [
      {
        quote: "Lexpal has revolutionized my practice. The AI research tool finds relevant precedents in seconds. I've increased my case capacity by 40%.",
        author: "Adv. Amit Kumar",
        role: "Senior Advocate, Delhi High Court",
        avatar: "AK"
      },
      {
        quote: "The drafting assistant understands legal nuance perfectly. Documents that took hours now take minutes. My clients are impressed.",
        author: "Adv. Priya Sharma",
        role: "Corporate Lawyer, Mumbai",
        avatar: "PS"
      },
      {
        quote: "Finally, a platform designed for Indian lawyers. The case workspace keeps everything organized beautifully.",
        author: "Adv. Rajesh Verma",
        role: "Civil Lawyer, Bangalore",
        avatar: "RV"
      }
    ],
    cta: {
      title: "Ready to Transform Your Practice?",
      subtitle: "Join 5,000+ legal professionals who've modernized their practice with Lexpal."
    }
  }

  const clientContent = {
    hero: {
      badge: "Simplified Legal Case Management",
      title: "Your Legal Journey",
      titleHighlight: "Made Simple",
      subtitle: "Connect with verified lawyers, track your cases in real-time, and stay informed every step of the way."
    },
    stats: [
      { number: "500+", label: "Verified Lawyers" },
      { number: "95%", label: "Time Saved" },
      { number: "24/7", label: "Case Access" }
    ],
    features: [
      {
        icon: "person_search",
        title: "Find Your Lawyer",
        description: "Search verified lawyers by expertise, location, ratings and reviews",
        image: "/images/feature-find-lawyer.jpg"
      },
      {
        icon: "calendar_month",
        title: "Easy Scheduling",
        description: "Book consultations with real-time availability, video or in-person",
        image: "/images/feature-scheduling.jpg"
      },
      {
        icon: "cloud_upload",
        title: "Secure Documents",
        description: "Upload and share files with bank-grade encryption security",
        image: "/images/feature-documents.jpg"
      },
      {
        icon: "monitoring",
        title: "Live Tracking",
        description: "Real-time updates on your case status, hearings, and documents",
        image: "/images/feature-tracking.jpg"
      }
    ],
    benefits: [
      { icon: "visibility", title: "Full Transparency", desc: "See everything about your case" },
      { icon: "schedule", title: "Save Time", desc: "No more back-and-forth calls" },
      { icon: "security", title: "Stay Secure", desc: "Your data is protected" },
      { icon: "handshake", title: "Better Outcomes", desc: "Work with the right lawyer" }
    ],
    testimonials: [
      {
        quote: "I was overwhelmed with my property dispute until I found Lexpal. The platform helped me find a great lawyer, and I can track every update in real-time.",
        author: "Suresh Mehta",
        role: "Business Owner, Pune",
        avatar: "SM"
      },
      {
        quote: "The document sharing is seamless and secure. I upload my files once, and my lawyer has instant access. No more email chains or lost attachments.",
        author: "Neha Kapoor",
        role: "IT Professional, Hyderabad",
        avatar: "NK"
      },
      {
        quote: "Booking appointments and tracking my case has never been easier. The hearing reminders have saved me multiple times!",
        author: "Anita Gupta",
        role: "Teacher, Chennai",
        avatar: "AG"
      }
    ],
    cta: {
      title: "Take Control of Your Legal Journey",
      subtitle: "Join thousands of clients who trust Lexpal for their legal needs."
    }
  }

  const content = userType === "lawyer" ? lawyerContent : clientContent

  // Auto-play case flow animation
  useEffect(() => {
    if (!isFlowPlaying || hoveredStep !== null) return
    const interval = setInterval(() => {
      setActiveFlowStep((prev) => (prev + 1) % caseFlow.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isFlowPlaying, hoveredStep, caseFlow.length])

  // Handle user type change with transition
  const handleUserTypeChange = useCallback((newType: "lawyer" | "client") => {
    if (newType === userType || isTransitioning) return
    setIsTransitioning(true)
    setActiveFlowStep(0)
    setTimeout(() => {
      setUserType(newType)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 400)
  }, [userType, isTransitioning])

  // Initialize
  useEffect(() => {
    setMounted(true)

    // Add Google Material Icons
    if (!document.querySelector('link[href*="material-symbols"]')) {
      const link = document.createElement("link")
      link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }

    // Add Inter font
    if (!document.querySelector('link[href*="Inter"]')) {
      const fontLink = document.createElement("link")
      fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
      fontLink.rel = "stylesheet"
      document.head.appendChild(fontLink)
    }

    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Intersection Observer for animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible)
            if (entry.target.id === "comparison-section") {
              setComparisonInView(true)
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    const animatedElements = document.querySelectorAll(`.${styles.animateOnScroll}, .${styles.showcase}`)
    animatedElements.forEach((el) => observerRef.current?.observe(el))

    // HIW Step Observer
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!isNaN(index)) {
            setActiveFlowStep(index);
          }
        }
      });
    }, {
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1
    });

    const stepElements = document.querySelectorAll(`.${styles.hiwStepItem}`);
    stepElements.forEach((el) => stepObserver.observe(el));

    return () => {
      observerRef.current?.disconnect();
      stepObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    }
  }, [userType])

  // Re-observe elements when content changes
  useEffect(() => {
    if (!mounted) return

    // reset animations
    const animatedElements = document.querySelectorAll(`.${styles.animateOnScroll}, .${styles.showcase}`)
    animatedElements.forEach((el) => {
      el.classList.remove(styles.visible)
      observerRef.current?.unobserve(el)
    })

    // small delay to ensure DOM is updated and allow browser to paint the "hidden" state
    const timer = setTimeout(() => {
      animatedElements.forEach((el) => {
        observerRef.current?.observe(el)
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [userType, mounted])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  const handlePrimaryAction = () => {
    router.push(userType === "lawyer" ? "/Lawyer-SignUp" : "/SignUp")
  }

  const handleSecondaryAction = () => {
    router.push(userType === "lawyer" ? "/Lawyer-Login" : "/Login")
  }

  if (!mounted) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingLogo}>
            <span className="material-symbols-outlined">balance</span>
          </div>
          <div className={styles.loadingSpinner}></div>
          <p>Loading Lexpal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.container} ${userType === "client" ? styles.clientTheme : styles.lawyerTheme}`}>

      {/* Header */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.headerContainer}>
          <div className={styles.headerInner}>
            <a href="/" className={styles.logo}>
              <div className={styles.logoMark}>
                <span className="material-symbols-outlined">balance</span>
              </div>
              <span className={styles.logoText}>Lexpal</span>
            </a>

            <nav className={styles.desktopNav}>
              <button className={styles.navLink} onClick={() => scrollToSection("how-it-works")}>
                How It Works
              </button>
              <button className={styles.navLink} onClick={() => scrollToSection("comparison")}>
                Compare
              </button>
              <button className={styles.navLink} onClick={() => scrollToSection("features")}>
                Features
              </button>
              <button className={styles.navLink} onClick={() => scrollToSection("testimonials")}>
                Testimonials
              </button>
            </nav>

            <div className={styles.headerActions}>
              {/* User Type Switch */}
              <div className={styles.userTypeSwitch}>
                <div className={styles.switchTrack}>
                  <div className={`${styles.switchIndicator} ${userType === "client" ? styles.switchRight : ""}`}></div>
                  <button
                    className={`${styles.switchOption} ${userType === "lawyer" ? styles.active : ""}`}
                    onClick={() => handleUserTypeChange("lawyer")}
                    disabled={isTransitioning}
                  >
                    <span className="material-symbols-outlined">gavel</span>
                    <span>Lawyers</span>
                  </button>
                  <button
                    className={`${styles.switchOption} ${userType === "client" ? styles.active : ""}`}
                    onClick={() => handleUserTypeChange("client")}
                    disabled={isTransitioning}
                  >
                    <span className="material-symbols-outlined">person</span>
                    <span>Clients</span>
                  </button>
                </div>
              </div>

              <div className={styles.authButtons}>
                <button className={styles.loginButton} onClick={handleSecondaryAction}>
                  Log In
                </button>
                <button className={styles.signupButton} onClick={handlePrimaryAction}>
                  Get Started
                </button>
              </div>
            </div>

            <button
              className={`${styles.mobileMenuBtn} ${mobileMenuOpen ? styles.active : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ""}`}>
          <div className={styles.mobileMenuInner}>
            <div className={styles.mobileUserSwitch}>
              <button
                className={`${styles.mobileSwitchBtn} ${userType === "lawyer" ? styles.active : ""}`}
                onClick={() => { handleUserTypeChange("lawyer"); setMobileMenuOpen(false); }}
              >
                <span className="material-symbols-outlined">gavel</span>
                For Lawyers
              </button>
              <button
                className={`${styles.mobileSwitchBtn} ${userType === "client" ? styles.active : ""}`}
                onClick={() => { handleUserTypeChange("client"); setMobileMenuOpen(false); }}
              >
                <span className="material-symbols-outlined">person</span>
                For Clients
              </button>
            </div>

            <nav className={styles.mobileNav}>
              <button onClick={() => scrollToSection("how-it-works")}>How It Works</button>
              <button onClick={() => scrollToSection("comparison")}>Compare</button>
              <button onClick={() => scrollToSection("features")}>Features</button>
              <button onClick={() => scrollToSection("testimonials")}>Testimonials</button>
            </nav>

            <div className={styles.mobileAuthButtons}>
              <button className={styles.mobileLoginBtn} onClick={() => { handleSecondaryAction(); setMobileMenuOpen(false); }}>
                Log In
              </button>
              <button className={styles.mobileSignupBtn} onClick={() => { handlePrimaryAction(); setMobileMenuOpen(false); }}>
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className={styles.videoModalOverlay} onClick={() => setIsVideoModalOpen(false)}>
          <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeModalBtn}
              onClick={() => setIsVideoModalOpen(false)}
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className={styles.videoWrapper}>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                title="Lexpal Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${styles.mainContent} ${isTransitioning ? styles.transitioning : ""}`}>

        {/* ============================================ */}
        {/* HERO SECTION (KEPT SAME AS ORIGINAL) */}
        {/* ============================================ */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroGradientOrb1}></div>
            <div className={styles.heroGradientOrb2}></div>
            <div className={styles.heroGrid}></div>
          </div>

          <div className={styles.heroContainer}>
            {/* Hero Text Content - Centered & Premium */}
            <div className={styles.heroTextContent}>
              <div className={styles.heroBadge}>
                <span className={styles.badgeDot}></span>
                <span>{content.hero.badge}</span>
              </div>

              <h1 className={styles.heroTitle}>
                {content.hero.title}
                <br />
                <span className={styles.heroTitleHighlight}>{content.hero.titleHighlight}</span>
              </h1>

              <p className={styles.heroSubtitle}>{content.hero.subtitle}</p>

              <div className={styles.heroActions}>
                <button className={styles.heroPrimaryBtn} onClick={handlePrimaryAction}>
                  <span>Get Started</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className={styles.heroSecondaryBtn} onClick={() => setIsVideoModalOpen(true)}>
                  <span className="material-symbols-outlined">play_circle</span>
                  <span>Watch The Film</span>
                </button>
              </div>
            </div>

            {/* Interactive Case Flow Visualization */}
            <div className={styles.caseFlowContainer}>
              <div className={styles.caseFlowHeader}>
                <div className={styles.caseFlowTitle}>
                  <span className="material-symbols-outlined">route</span>
                  <span>{userType === "lawyer" ? "Case Lifecycle" : "Your Journey"}</span>
                </div>
                <button
                  className={styles.caseFlowPlayPause}
                  onClick={() => setIsFlowPlaying(!isFlowPlaying)}
                  aria-label={isFlowPlaying ? "Pause animation" : "Play animation"}
                >
                  <span className="material-symbols-outlined">
                    {isFlowPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>
              </div>

              {/* Flow Steps */}
              <div className={styles.caseFlowSteps}>
                {caseFlow.map((step, index) => (
                  <div
                    key={step.id}
                    className={`${styles.flowStep} ${activeFlowStep === index ? styles.flowStepActive : ""} ${hoveredStep === index ? styles.flowStepHovered : ""}`}
                    onMouseEnter={() => { setHoveredStep(index); setActiveFlowStep(index); }}
                    onMouseLeave={() => setHoveredStep(null)}
                    onClick={() => setActiveFlowStep(index)}
                    style={{ "--step-color": step.color } as React.CSSProperties}
                  >
                    <div className={styles.flowStepConnector}>
                      <div className={styles.flowStepLine}></div>
                      <div className={styles.flowStepProgress}></div>
                    </div>

                    <div className={styles.flowStepNode}>
                      <div className={styles.flowStepIcon}>
                        <span className="material-symbols-outlined">{step.icon}</span>
                      </div>
                      <div className={styles.flowStepNumber}>{step.id}</div>
                    </div>

                    <div className={styles.flowStepLabel}>
                      <span className={styles.flowStepShortTitle}>{step.shortTitle}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Step Details */}
              <div className={styles.caseFlowDetails}>
                <div
                  key={activeFlowStep}
                  className={styles.flowDetailCard}
                  style={{ "--active-color": caseFlow[activeFlowStep]?.color } as React.CSSProperties}
                >
                  <div className={styles.flowDetailHeader}>
                    <div className={styles.flowDetailIcon}>
                      <span className="material-symbols-outlined">{caseFlow[activeFlowStep]?.icon}</span>
                    </div>
                    <div className={styles.flowDetailTitleWrap}>
                      <h3>{caseFlow[activeFlowStep]?.title}</h3>
                      <span className={styles.flowDetailDuration}>
                        <span className="material-symbols-outlined">schedule</span>
                        {caseFlow[activeFlowStep]?.duration}
                      </span>
                    </div>
                  </div>

                  <p className={styles.flowDetailDescription}>
                    {caseFlow[activeFlowStep]?.description}
                  </p>

                  <ul className={styles.flowDetailList}>
                    {caseFlow[activeFlowStep]?.details.map((detail, idx) => (
                      <li key={idx}>
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.flowDetailProgress}>
                    <div className={styles.flowProgressBar}>
                      <div
                        className={styles.flowProgressFill}
                        style={{ width: `${((activeFlowStep + 1) / caseFlow.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className={styles.flowProgressText}>
                      Step {activeFlowStep + 1} of {caseFlow.length}
                    </span>
                  </div>
                </div>

                {/* Mini visualization */}
                <div className={styles.flowMiniViz}>
                  {caseFlow.map((step, index) => (
                    <div
                      key={step.id}
                      className={`${styles.flowMiniDot} ${index <= activeFlowStep ? styles.flowMiniDotActive : ""}`}
                      style={{ "--dot-color": step.color } as React.CSSProperties}
                      onClick={() => setActiveFlowStep(index)}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* TRUSTED BY / LOGOS SECTION (Flyhive Style) */}
        {/* ============================================ */}
        <section className={styles.trustedBy}>
          <div className={styles.trustedByContainer}>
            <p className={styles.trustedByLabel}>Trusted by legal professionals across India</p>
            <div className={styles.trustedByLogos}>
              <div className={styles.trustBadge}>
                <span className="material-symbols-outlined">verified_user</span>
                <span>Bank-Grade Security</span>
              </div>
              <div className={styles.trustBadge}>
                <span className="material-symbols-outlined">account_balance</span>
                <span>Indian Legal System</span>
              </div>
              <div className={styles.trustBadge}>
                <span className="material-symbols-outlined">psychology</span>
                <span>AI-Powered</span>
              </div>
              <div className={styles.trustBadge}>
                <span className="material-symbols-outlined">support_agent</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* HOW IT WORKS SECTION (Flyhive Style) */}
        {/* ============================================ */}
        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.sectionContainer}>
            <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
              <span className={styles.sectionLabel}>How It Works</span>
              <h2 className={styles.sectionTitle}>
                {userType === "lawyer" ? "Streamline Your Legal Practice" : "Your Journey Made Simple"}
              </h2>
              <p className={styles.sectionSubtitle}>
                {userType === "lawyer"
                  ? "See how Lexpal transforms every step of your legal workflow into an efficient, AI-powered process."
                  : "Experience a seamless legal journey from finding the right lawyer to case resolution."}
              </p>
            </div>

            {/* Split Layout: Text Left, Sticky Visual Right */}
            <div className={styles.hiwSplitLayout}>
              {/* Left Column: Scrollable Text */}
              <div className={styles.hiwScrollColumn}>
                {caseFlow.map((step, index) => (
                  <div
                    key={`text-${step.id}`}
                    data-index={index}
                    className={`${styles.hiwStepItem} ${activeFlowStep === index ? styles.active : ''}`}
                  >
                    <span className={styles.hiwStepNum} style={{ color: step.color }}>0{index + 1}</span>
                    <h3 className={styles.hiwStepHeading}>{step.title}</h3>
                    <p className={styles.hiwStepPara}>{step.description}</p>
                    <div className={styles.hiwStepFeatureList}>
                      {step.details.map((detail, i) => (
                        <div key={i} className={styles.detailTag}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16, color: step.color }}>check_circle</span>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Sticky Visuals */}
              <div className={styles.hiwStickyColumn}>
                <div className={styles.hiwVisualFrame}>
                  {caseFlow.map((step, index) => (
                    <div
                      key={`visual-${step.id}`}
                      className={`${styles.hiwVisualCard} ${activeFlowStep === index ? styles.active : ''}`}
                    >
                      <div className={styles.visualInner}>
                        <div className={styles.visualIconBox} style={{ backgroundColor: step.color }}>
                          <span className="material-symbols-outlined">{step.icon}</span>
                        </div>
                        <h3 className={styles.visualTitle} style={{ color: step.color }}>{step.title}</h3>
                        <div className={styles.visualDecoration} style={{
                          background: `radial-gradient(circle, ${step.color}20 0%, transparent 70%)`
                        }}></div>

                        {/* Simulated UI Card */}
                        <div className={styles.fakeUiCard}>
                          <div className={styles.fakeUiHeader}>
                            <div className={styles.redDot}></div>
                            <div className={styles.yellowDot}></div>
                            <div className={styles.greenDot}></div>
                          </div>
                          <div className={styles.fakeUiBody}>
                            <div className={styles.fakeLine} style={{ width: '70%', background: step.color, opacity: 0.2 }}></div>
                            <div className={styles.fakeLine} style={{ width: '50%', background: step.color, opacity: 0.1 }}></div>
                            <div className={styles.fakeBox} style={{ borderColor: step.color, opacity: 0.2 }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SHOWCASE SECTIONS */}
        {/* ============================================ */}
        {showcaseSections.map((section, index) => (
          <section
            key={section.id}
            id={index === 0 ? "comparison" : undefined}
            className={`
      ${styles.showcase} 
      ${section.theme === 'dark' ? styles.showcaseDark : styles.showcaseLight}
      ${styles.showcaseLayoutStacked}
      ${styles.animateOnScroll}
    `}
            aria-labelledby={`showcase-title-${index}`}
          >
            {/* Background */}
            <div className={styles.showcaseBackdrop} />

            {/* Main Content Wrapper */}
            <div className={styles.showcaseWrapper}>
              {/* Text Content */}
              <div className={styles.showcaseTextBlock}>
                {/* Category Label */}
                <span className={styles.showcaseCategory}>{section.subtitle}</span>

                {/* Main Title */}
                <h2 className={styles.showcaseTitle} id={`showcase-title-${index}`}>
                  {section.title.split('\n').map((line, i) => (
                    <span key={i} className={styles.showcaseTitleRow}>
                      <span
                        className={styles.showcaseTitleContent}
                        style={{ '--row': i } as React.CSSProperties}
                      >
                        {line}
                      </span>
                    </span>
                  ))}
                </h2>

                {/* Description */}
                <p className={styles.showcaseSubtitle}>{section.description}</p>

                {/* Stats */}
                {section.stats && (
                  <div className={styles.showcaseStats}>
                    {section.stats.map((stat, statIndex) => (
                      <div key={statIndex} className={styles.showcaseStat}>
                        <span className={styles.showcaseStatValue}>
                          {stat.value}
                          <span className={styles.showcaseStatUnit}>{stat.unit}</span>
                        </span>
                        <span className={styles.showcaseStatLabel}>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA - Only on solution section */}
                {section.id === 'solution' && (
                  <div className={styles.showcaseActions}>
                    <button className={styles.showcaseActionPrimary} onClick={handlePrimaryAction}>
                      <span>Get Started Free</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <button className={styles.showcaseActionSecondary} onClick={() => scrollToSection("features")}>
                      <span className="material-symbols-outlined">play_circle</span>
                      <span>Watch Demo</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Image */}
              <figure className={styles.showcaseFigure}>
                <div className={styles.showcaseImageWrapper}>
                  {/* Placeholder - Replace with actual image */}
                  <div className={styles.showcaseImagePlaceholder}>
                    <span className={styles.showcaseImageIcon}>
                      <span className="material-symbols-outlined">
                        {section.id === 'problem' ? 'sentiment_stressed' :
                          section.id === 'solution' ? 'sentiment_very_satisfied' : 'dashboard'}
                      </span>
                    </span>
                  </div>

                  <Image
                    src={section.image}
                    alt={section.title.replace('\n', ' ')}
                    fill
                    style={{ objectFit: 'cover' }}
                    className={styles.showcaseImage}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Optional Caption */}
                {section.id === 'experience' && (
                  <figcaption className={styles.showcaseCaption}>
                    {userType === 'lawyer' ? 'Lexpal Dashboard Preview' : 'Lexpal Mobile App'}
                  </figcaption>
                )}
              </figure>
            </div>

            {/* Bottom Fade */}
            <div className={styles.showcaseFade} />

            {/* Scroll Prompt - Only on first section */}
            {index === 0 && (
              <div className={styles.showcaseScrollPrompt}>
                <span className={styles.showcaseScrollText}>Scroll</span>
                <div className={styles.showcaseScrollTrack}>
                  <div className={styles.showcaseScrollThumb} />
                </div>
              </div>
            )}
          </section>
        ))}

        {/* ============================================ */}
        {/* FEATURES SECTION (Flyhive Style - Alternating) */}
        {/* ============================================ */}
        <section id="features" className={styles.featuresSection}>
          <div className={styles.sectionContainer}>
            <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
              <span className={styles.sectionLabel}>Features</span>
              <h2 className={styles.sectionTitle}>
                {userType === "lawyer" ? "Powerful Tools for Legal Excellence" : "Everything You Need"}
              </h2>
              <p className={styles.sectionSubtitle}>
                {userType === "lawyer"
                  ? "A comprehensive suite designed for modern legal professionals"
                  : "Intuitive features that make legal management simple"}
              </p>
            </div>

            <div className={styles.featuresGrid}>
              {content.features.map((feature, index) => (
                <div
                  key={index}
                  className={`${styles.featureBlock} ${styles.animateOnScroll} ${index % 2 === 1 ? styles.featureReverse : ""}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className={styles.featureContent}>
                    <div className={styles.featureIconLarge}>
                      <span className="material-symbols-outlined">{feature.icon}</span>
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                    <button className={styles.featureLink}>
                      Learn more
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                  <div className={styles.featureImageWrap}>
                    <div className={styles.featureImagePlaceholder}>
                      <span className="material-symbols-outlined">{feature.icon}</span>
                      {/* Replace with actual image */}
                      {/* <Image src={feature.image} alt={feature.title} fill style={{ objectFit: 'cover' }} /> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* BENEFITS SECTION (Flyhive Style - Grid) */}
        {/* ============================================ */}
        <section className={styles.benefitsSection}>
          <div className={styles.sectionContainer}>
            <div className={`${styles.sectionHeader} ${styles.sectionHeaderLight} ${styles.animateOnScroll}`}>
              <span className={styles.sectionLabel}>Benefits</span>
              <h2 className={styles.sectionTitle}>
                {userType === "lawyer" ? "Why Lawyers Choose Lexpal" : "Why Clients Trust Lexpal"}
              </h2>
            </div>

            <div className={styles.benefitsGrid}>
              {content.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`${styles.benefitCard} ${styles.animateOnScroll}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.benefitIcon}>
                    <span className="material-symbols-outlined">{benefit.icon}</span>
                  </div>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* TESTIMONIALS SECTION (Flyhive Style) */}
        {/* ============================================ */}
        <section id="testimonials" className={styles.testimonialsSection}>
          <div className={styles.sectionContainer}>
            <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
              <span className={styles.sectionLabel}>Testimonials</span>
              <h2 className={styles.sectionTitle}>
                {userType === "lawyer" ? "Loved by Legal Professionals" : "What Our Clients Say"}
              </h2>
            </div>

            <div className={styles.testimonialsGrid}>
              {content.testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`${styles.testimonialCard} ${styles.animateOnScroll}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.testimonialQuote}>
                    <span className="material-symbols-outlined">format_quote</span>
                  </div>
                  <blockquote className={styles.testimonialText}>
                    {testimonial.quote}
                  </blockquote>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorAvatar}>{testimonial.avatar}</div>
                    <div className={styles.authorInfo}>
                      <strong>{testimonial.author}</strong>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                  <div className={styles.testimonialRating}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined">star</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* CTA SECTION (Flyhive Style) */}
        {/* ============================================ */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBackground}>
            <div className={styles.ctaPattern}></div>
          </div>
          <div className={styles.ctaContainer}>
            <div className={`${styles.ctaContent} ${styles.animateOnScroll}`}>
              <h2 className={styles.ctaTitle}>{content.cta.title}</h2>
              <p className={styles.ctaSubtitle}>{content.cta.subtitle}</p>
              <div className={styles.ctaButtons}>
                <button className={styles.ctaPrimaryBtn} onClick={handlePrimaryAction}>
                  Get Started Free
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className={styles.ctaSecondaryBtn} onClick={handleSecondaryAction}>
                  Log In
                </button>
              </div>
              <p className={styles.ctaNote}>
                {userType === "lawyer"
                  ? "No credit card required • 14-day free trial • Cancel anytime"
                  : "Free account • No hidden fees • Cancel anytime"}
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ============================================ */}
      {/* FOOTER (Flyhive Style) */}
      {/* ============================================ */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <a href="/" className={styles.footerLogo}>
                <div className={styles.logoMark}>
                  <span className="material-symbols-outlined">balance</span>
                </div>
                <span className={styles.logoText}>Lexpal</span>
              </a>
              <p className={styles.footerTagline}>
                {userType === "lawyer"
                  ? "The AI Operating System for Modern Legal Professionals"
                  : "Your Trusted Legal Companion"}
              </p>
              <div className={styles.footerSocial}>
                <a href="#" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="mailto:hello@lexpal.in" aria-label="Email">
                  <span className="material-symbols-outlined">mail</span>
                </a>
              </div>
            </div>

            <div className={styles.footerLinks}>
              <div className={styles.footerLinkGroup}>
                <h4>Product</h4>
                <a href="#how-it-works">How It Works</a>
                <a href="#features">Features</a>
                <a href="/pricing">Pricing</a>
                <a href="/integrations">Integrations</a>
              </div>
              <div className={styles.footerLinkGroup}>
                <h4>Company</h4>
                <a href="/about">About Us</a>
                <a href="/careers">Careers</a>
                <a href="/blog">Blog</a>
                <a href="/contact">Contact</a>
              </div>
              <div className={styles.footerLinkGroup}>
                <h4>Resources</h4>
                <a href="/help">Help Center</a>
                <a href="/docs">Documentation</a>
                <a href="/api">API</a>
                <a href="/status">Status</a>
              </div>
              <div className={styles.footerLinkGroup}>
                <h4>Legal</h4>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
                <a href="/security">Security</a>
                <a href="/cookies">Cookies</a>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.footerDisclaimer}>
              Lexpal is a legal technology platform. AI assists research and drafting; lawyers make all final decisions. This platform does not provide legal advice.
            </p>
            <div className={styles.footerBottomRow}>
              <p className={styles.footerCopyright}>
                © {new Date().getFullYear()} Lexpal Technologies Pvt. Ltd. All rights reserved.
              </p>
              <div className={styles.footerBottomLinks}>
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
                <a href="/sitemap">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}