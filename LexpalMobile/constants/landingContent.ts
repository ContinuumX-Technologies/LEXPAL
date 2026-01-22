
import { ImageSourcePropType } from 'react-native';

const one = require('@/assets/images/1.jpeg');
const two = require('@/assets/images/2.jpeg');
const three = require('@/assets/images/3.jpeg');
const four = require('@/assets/images/4.jpeg');
const five = require('@/assets/images/5.jpeg');
const six = require('@/assets/images/6.jpeg');
const seven = require('@/assets/images/7.jpeg');

export const IMAGES = {
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
};

export const LAWYER_CASE_FLOW = [
    {
        id: 1,
        icon: "person-add", // material icon name using dashes instead of underscores for some libraries, but we'll stick to material names
        title: "Client Inquiry",
        shortTitle: "Inquiry",
        description: "Client submits case details through secure portal",
        details: ["Automated intake forms", "Document upload", "Initial case assessment"],
        color: "#64748b", // Slate 500
        duration: "5 min"
    },
    {
        id: 2,
        icon: "upload-file",
        title: "Document Collection",
        shortTitle: "Documents",
        description: "All case documents organized in one workspace",
        details: ["Secure cloud storage", "Auto-categorization", "Version control"],
        color: "#3b82f6", // Blue 500
        duration: "10 min"
    },
    {
        id: 3,
        icon: "psychology",
        title: "AI Analysis",
        shortTitle: "Analysis",
        description: "AI analyzes documents and extracts key information",
        details: ["Smart summarization", "Key facts extraction", "Risk assessment"],
        color: "#1e40af", // Blue 800
        duration: "2 min"
    },
    {
        id: 4,
        icon: "search",
        title: "Legal Research",
        shortTitle: "Research",
        description: "AI finds relevant precedents and statutes",
        details: ["Case law matching", "Statute references", "Similar judgments"],
        color: "#1e3a8a", // Blue 900
        duration: "5 min"
    },
    {
        id: 5,
        icon: "edit-document",
        title: "Draft Generation",
        shortTitle: "Drafting",
        description: "AI-assisted document drafting with templates",
        details: ["Smart templates", "Auto-citations", "Format compliance"],
        color: "#d97706", // Amber 600
        duration: "15 min"
    },
    {
        id: 6,
        icon: "task-alt",
        title: "Review & File",
        shortTitle: "Filing",
        description: "Final review and court filing preparation",
        details: ["Compliance check", "E-filing ready", "Deadline tracking"],
        color: "#15803d", // Green 700
        duration: "10 min"
    }
];

export const CLIENT_CASE_FLOW = [
    {
        id: 1,
        icon: "search",
        title: "Find Lawyer",
        shortTitle: "Search",
        description: "Browse verified lawyers by expertise and location",
        details: ["Verified profiles", "Ratings & reviews", "Expertise matching"],
        color: "#14b8a6", // Teal 500
        duration: "5 min"
    },
    {
        id: 2,
        icon: "calendar-month",
        title: "Book Consultation",
        shortTitle: "Book",
        description: "Schedule appointment at your convenience",
        details: ["Real-time availability", "Video/In-person options", "Instant confirmation"],
        color: "#0d9488", // Teal 600
        duration: "2 min"
    },
    {
        id: 3,
        icon: "upload-file",
        title: "Share Documents",
        shortTitle: "Upload",
        description: "Securely upload all case-related documents",
        details: ["Encrypted storage", "Easy organization", "Lawyer access control"],
        color: "#0891b2", // Cyan 600
        duration: "10 min"
    },
    {
        id: 4,
        icon: "forum",
        title: "Communicate",
        shortTitle: "Chat",
        description: "Direct messaging with your legal team",
        details: ["Secure messaging", "File sharing", "Query tracking"],
        color: "#0284c7", // Sky 600
        duration: "Ongoing"
    },
    {
        id: 5,
        icon: "insights", // Check if this icon exists in MaterialIcons, might need fallback
        title: "Track Progress",
        shortTitle: "Track",
        description: "Real-time updates on your case status",
        details: ["Status timeline", "Hearing dates", "Document status"],
        color: "#2563eb", // Blue 600
        duration: "24/7"
    },
    {
        id: 6,
        icon: "celebration",
        title: "Case Resolution",
        shortTitle: "Resolution",
        description: "Complete transparency until case conclusion",
        details: ["Final documents", "Outcome summary", "Feedback option"],
        color: "#059669", // Emerald 600
        duration: "Varies"
    }
];

export const LAWYER_SHOWCASE_SECTIONS = [
    {
        id: 'problem',
        subtitle: 'The Problem',
        title: 'Drowning In\nPaperwork',
        description: 'Hours lost to manual research. Nights spent drafting from scratch. The endless cycle of administrative burden that keeps you from what matters most — practicing law.',
        image: one,
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
        image: three,
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
        image: five,
        theme: 'dark' as const,
        stats: [
            { value: '500', unit: '+', label: 'Lawyers Trust Us' },
            { value: '99.9', unit: '%', label: 'Uptime' },
            { value: '24', unit: '/7', label: 'AI Support' }
        ]
    }
];

export const CLIENT_SHOWCASE_SECTIONS = [
    {
        id: 'problem',
        subtitle: 'The Problem',
        title: 'Lost In The\nLegal Maze',
        description: 'Days spent searching for the right lawyer. Weeks of uncertainty. The frustrating cycle of phone calls, office visits, and zero visibility into your own case.',
        image: two,
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
        image: four,
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
        image: six,
        theme: 'dark' as const,
        stats: [
            { value: '5', unit: 'min', label: 'Avg. Booking' },
            { value: '50', unit: '+', label: 'Cities' },
            { value: '100', unit: '%', label: 'Transparency' }
        ]
    }
];

export const LAWYER_CONTENT = {
    hero: {
        badge: "AI-Powered Legal Practice Management",
        title: "Watch Your\nCases",
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
            icon: "folder-shared",
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
            icon: "edit-document",
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
        subtitle: "Join 5,000+ legal professionals who've modernized their practice with Lexpal."
    }
};

export const CLIENT_CONTENT = {
    hero: {
        badge: "Simplified Legal Case Management",
        title: "Your Legal\nJourney",
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
            icon: "person-search",
            title: "Find Your Lawyer",
            description: "Search verified lawyers by expertise, location, ratings and reviews",
            image: seven
        },
        {
            icon: "calendar-month",
            title: "Easy Scheduling",
            description: "Book consultations with real-time availability, video or in-person",
            image: two
        },
        {
            icon: "cloud-upload",
            title: "Secure Documents",
            description: "Upload and share files with bank-grade encryption security",
            image: three
        },
        {
            icon: "insights",
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
};
