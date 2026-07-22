"use client";

import { useState } from 'react';
import Header from './Header';
import styles from './LegalPageLayout.module.css';

interface Section {
    id: string;
    title: string;
}

interface LegalPageLayoutProps {
    title: string;
    lastUpdated?: string;
    sections?: Section[];
    lawyerContent: React.ReactNode;
    clientContent: React.ReactNode;
}

export default function LegalPageLayout({
    title,
    lastUpdated,
    sections = [],
    lawyerContent,
    clientContent
}: LegalPageLayoutProps) {
    const [userType, setUserType] = useState<"lawyer" | "client">("lawyer");
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleUserTypeChange = (newType: "lawyer" | "client") => {
        if (newType === userType || isTransitioning) return;

        // Start exit animation
        setIsTransitioning(true);

        // Wait for exit animation to complete before changing state
        setTimeout(() => {
            setUserType(newType);

            // Short delay for DOM update then remove transition class (trigger enter animation)
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 400); // 400ms matches CSS transition duration
    };

    return (
        <div className={styles.container}>
            {/* Use the new Header that matches the Landing Page */}
            <Header
                userType={userType}
                setUserType={handleUserTypeChange}
                isTransitioning={isTransitioning}
            />

            {/* Adjust Main Top Padding because Header is fixed */}
            <main className={styles.main} style={{ marginTop: '40px' }}>
                {/* Sidebar Table of Contents */}
                <aside className={styles.sidebar}>
                    {sections.length > 0 && (
                        <>
                            <div className={styles.sidebarTitle}>On This Page</div>
                            <nav>
                                {sections.map((section) => (
                                    <a key={section.id} href={`#${section.id}`} className={styles.tocLink}>
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </>
                    )}
                </aside>

                {/* Main Content */}
                <div className={styles.content}>
                    <div className={styles.breadcrumbs}>Legal &rsaquo; {title} ({userType === 'lawyer' ? 'Lawyer' : 'Client'})</div>

                    <div className={`${styles.contentWrapper} ${isTransitioning ? styles.transitioning : ''}`}>
                        <h1 className={styles.title}>{title}.</h1>
                        {lastUpdated && <span className={styles.lastUpdated}>Last updated {lastUpdated}</span>}

                        <div className={styles.prose}>
                            {userType === 'lawyer' ? lawyerContent : clientContent}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
