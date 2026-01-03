'use client';

import React from 'react';
import styles from './page.module.css';
import Button1 from '../UI_components/button';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router= useRouter();
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <span className={`material-symbols-outlined ${styles.logoIcon}`}>gavel</span>
          <h2 className={styles.logoText}>Lexpal</h2>
        </div>
        <button onClick={()=>{router.push("lexpal/Login")}}>
        <a href="#" className={styles.primaryButton}>
          Get Started
        </a>
        </button>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Your Legal Questions, Answered by AI.</h1>
          <h2>
            Get matched with top-rated local lawyers instantly. Describe your case and let our AI find the best
            legal expert for you.
          </h2>
          {/* <button className={styles.primaryButtonLarge}>Talk to AI Chatbot</button> */}
          
         <Button1 onClick={()=>{router.push("lexpal/Login")}}/>

        </div>
        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-MioYeNWYc6oDlikQ3UIdJK8uSvRuB7AmH7Q61RyYpe0aUKA1GCLTwau9tc7HqLi2P6V847Xvs3j1R9u7wx-_dKEA8ME3TdiHJmgL9gE__hfSTv9PxdDRV6nKY2nFVXgSjKcBrNph3Xmzq8EUPs0BOaZ4O9gOouG_ecTwkTLt8VZaf99RzB9yuQzOm1jPTontCxFbEmwr1LW9G-TQ0IL7Mmf1wq4IxyCjDlP87ZvXZBLAcihbDBQIvbt151xIELeqSzM92uJPxA2q")',
          }}
        ></div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h1>AI-Powered Legal Assistance</h1>
          <p>Leverage cutting-edge technology to simplify your legal journey from start to finish.</p>
        </div>

        <div className={styles.featureGrid}>
          {[
            {
              icon: 'auto_awesome',
              title: 'AI-Assisted Case Handling',
              text: 'Our AI analyzes the nuances of your case to provide initial insights and guidance.',
            },
            {
              icon: 'person_search',
              title: 'Personalized Lawyer Recommendations',
              text: 'Receive a curated list of lawyers perfectly matched to your specific needs.',
            },
            {
              icon: 'travel_explore',
              title: 'Find Lawyers In Your Jurisdiction',
              text: 'Easily find experienced lawyers who are licensed and practice in your local area.',
            },
            {
              icon: 'description',
              title: 'Instantly Draft Legal Notices',
              text: 'Get a head start by using AI automation to instantly file legal notices or suits.',
            },
          ].map((item, i) => (
            <div key={i} className={styles.featureCard}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>{item.icon}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          {[
            {
              icon: 'chat',
              step: '1. Describe Your Case',
              text: 'Simply tell our secure AI chatbot about your situation in plain language.',
            },
            {
              icon: 'manage_search',
              step: '2. Get Instant AI Matches',
              text: 'Our algorithm analyzes your case and instantly recommends the best lawyers for you.',
            },
            {
              icon: 'handshake',
              step: '3. Connect and Consult Securely',
              text: 'Review profiles, chat securely, and hire the right lawyer with confidence.',
            },
          ].map((item, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepIcon}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <p className={styles.stepTitle}>{item.step}</p>
                <p className={styles.stepDesc}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Find the right legal help today.</h2>
        <p>
          Take the first step towards resolving your legal matters. Our AI is ready to assist you 24/7.
        </p>
        <button onClick={()=>{router.push("lexpal/Lawyer-Login")}} className={styles.ctaButton}>Get Started Now</button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <span className={`material-symbols-outlined ${styles.logoIcon}`}>gavel</span>
          <h2>Lexpal</h2>
        </div>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
        <p>© 2024 Lexpal. All rights reserved.</p>
      </footer>
    </div>
  );
}