"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

interface FooterProps {
    userType?: 'lawyer' | 'client';
}

export default function Footer({ userType = 'lawyer' }: FooterProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSection = (section: string) => {
        if (!isMobile) return;
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const footerSections = [
        {
            id: 'product',
            title: 'Product',
            links: [
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Features', href: '/#features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'For Lawyers', href: '/lawyers' },
                { label: 'Trust & Safety', href: '/trust' },
            ]
        },
        {
            id: 'company',
            title: 'Company',
            links: [
                { label: 'About Us', href: '/about' },
                { label: 'Careers', href: '/careers' },
                { label: 'Impact', href: '/impact' },
                { label: 'Newsroom', href: '/news' },
                { label: 'Contact', href: '/contact' },
            ]
        },
        {
            id: 'resources',
            title: 'Resources',
            links: [
                { label: 'Help Center', href: '/help' },
                { label: 'Legal Blog', href: '/blog' },
                { label: 'Community', href: '/community' },
                { label: 'Developers', href: '/api' },
                { label: 'Status', href: '/status' },
            ]
        },
        {
            id: 'legal',
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Security', href: '/security' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'Accessibility', href: '/accessibility' },
            ]
        }
    ];

    return (
        <footer className={`${styles.footer} ${userType === 'client' ? styles.clientTheme : styles.lawyerTheme}`}>
            <div className={styles.footerContainer}>

                <div className={styles.footerMain}>
                    {/* Brand Column (Next-Gen Addition) */}
                    <div className={styles.brandColumn}>
                        <div className={styles.brandInfo}>
                            <Link href="/" className={styles.brandLogo}>
                                <span className="material-symbols-outlined">balance</span>
                                <span>Lexpal</span>
                            </Link>
                            <p className={styles.brandTagline}>
                                The AI operating system for modern legal professionals. Democratizing justice through technology.
                            </p>
                        </div>

                        <div className={styles.newsletter}>
                            <span className={styles.newsletterLabel}>Stay Updated</span>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={styles.emailInput}
                                    suppressHydrationWarning
                                />
                                <button className={styles.submitBtn} aria-label="Subscribe">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        <div className={styles.socials}>
                            {/* Minimal SVG Social Actions */}
                            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                            <a href="#" className={styles.socialIcon} aria-label="Twitter / X">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            <a href="#" className={styles.socialIcon} aria-label="Instagram">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {footerSections.map((section) => (
                        <div
                            key={section.id}
                            className={`${styles.footerLinkGroup} ${expandedSections[section.id] ? styles.expanded : ''}`}
                        >
                            <h4 onClick={() => toggleSection(section.id)}>
                                {section.title}
                                <span className={styles.accordionIcon}>+</span>
                            </h4>
                            <div className={styles.linksList}>
                                {section.links.map((link, idx) => (
                                    <Link key={idx} href={link.href}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.footerBottomLinks}>
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/terms">Terms</Link>
                        <Link href="/security">Security</Link>
                        <Link href="/cookies">Cookies</Link>
                        <Link href="/sitemap">Sitemap</Link>
                    </div>
                    <p className={styles.footerCopyright}>
                        © {new Date().getFullYear()} Lexpal Inc. All rights reserved. • Designed for Justice.
                    </p>
                </div>
            </div>
        </footer>
    );
}
