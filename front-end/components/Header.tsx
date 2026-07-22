"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
    userType: 'lawyer' | 'client';
    setUserType: (type: 'lawyer' | 'client') => void;
    isTransitioning?: boolean;
}

export default function Header({ userType, setUserType, isTransitioning = false }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`${styles.container} ${userType === 'client' ? styles.clientTheme : styles.lawyerTheme}`}>
            <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerInner}>
                        <Link href="/" className={styles.logo}>
                            <div className={styles.logoMark}>
                                <img src="/assets/logo.png" alt="Lexpal Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                            </div>
                            <span className={styles.logoText}>Lexpal</span>
                        </Link>

                        <nav className={styles.desktopNav}>
                            {/* Use absolute links to home sections */}
                            <Link href="/#how-it-works" className={styles.navLink}>How It Works</Link>
                            <Link href="/#comparison" className={styles.navLink}>Compare</Link>
                            <Link href="/#features" className={styles.navLink}>Features</Link>
                        </nav>

                        <div className={styles.headerActions}>
                            {/* User Type Switch */}
                            <div className={styles.userTypeSwitch}>
                                <div className={styles.switchTrack}>
                                    <div className={`${styles.switchIndicator} ${userType === "client" ? styles.switchRight : ""}`}></div>
                                    <button
                                        className={`${styles.switchOption} ${userType === "lawyer" ? styles.active : ""}`}
                                        onClick={() => setUserType("lawyer")}
                                        disabled={isTransitioning}
                                    >
                                        <span className="material-symbols-outlined">gavel</span>
                                        <span>Lawyers</span>
                                    </button>
                                    <button
                                        className={`${styles.switchOption} ${userType === "client" ? styles.active : ""}`}
                                        onClick={() => setUserType("client")}
                                        disabled={isTransitioning}
                                    >
                                        <span className="material-symbols-outlined">person</span>
                                        <span>Clients</span>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.authButtons}>
                                <Link href="https://workspace.lexpal.in/">
                                    <button className={styles.loginButton}>Log In</button>
                                </Link>
                                <Link href="https://workspace.lexpal.in/">
                                    <button className={styles.signupButton}>Get Started</button>
                                </Link>
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
            </header>
        </div>
    );
}
