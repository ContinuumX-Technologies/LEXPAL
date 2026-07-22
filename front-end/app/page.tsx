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

import seven from "@/public/assets/7.jpeg";

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
                image: seven
            },
            {
                icon: "folder_shared",
                title: "Smart Workspaces",
                description: "Organized documents, timelines, and research per case automatically",
                image: two
            },
            {
                icon: "search",
                title: "AI Legal Research",
                description: "Natural language search across millions of Indian judgments",
                image: three
            },
            {
                icon: "edit_document",
                title: "Smart Drafting",
                description: "AI-powered document generation with court-specific templates",
                image: four
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
            subtitle: "Join legal professionals who've modernized their practice with Lexpal."
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
                image: seven // Reusing images for demo
            },
            {
                icon: "calendar_month",
                title: "Easy Scheduling",
                description: "Book consultations with real-time availability, video or in-person",
                image: two
            },
            {
                icon: "cloud_upload",
                title: "Secure Documents",
                description: "Upload and share files with bank-grade encryption security",
                image: three
            },
            {
                icon: "monitoring",
                title: "Live Tracking",
                description: "Real-time updates on your case status, hearings, and documents",
                image: four
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
        window.location.href = "https://workspace.lexpal.in/"
    }

    const handleSecondaryAction = () => {
        window.location.href = "https://workspace.lexpal.in/"
    }

    if (!mounted) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.loadingContent}>
                    <div className={styles.loadingLogo}>
                        <img src="/assets/logo.png" alt="Lexpal Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
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
                                <img src="/assets/logo.png" alt="Lexpal Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
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
                                    
                                    </div>
                                    <div className={styles.featureImageWrap}>
                                        {/* Image Component */}
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className={styles.featureImage}
                                        />
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
                                    ? "No credit card required • Free trial "
                                    : "Free account • No hidden fees "}
                            </p>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    )
}