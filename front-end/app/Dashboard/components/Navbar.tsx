import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Navbar.module.css";

interface NavItem {
  id: string;
  label: string;
  icon?: string;
}

type props = {
  firstName: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "featured-lawyers", label: "Featured", icon: "star" },
  { id: "lexpal-ai", label: "AI", icon: "auto_awesome" },
  { id: "saved-lawyers", label: "Saved", icon: "bookmark" },
  { id: "chats", label: "Chats", icon: "chat" },
];

const SCROLL_OFFSET = 120;

export default function Navbar({ firstName }: props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get greeting based on time
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }, []);

  // Scroll detection for glass effect intensity
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection
  const detectActiveSection = useCallback(() => {
    if (isScrollingRef.current) return;

    const sections = NAV_ITEMS
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];

    const scrollY = window.scrollY + SCROLL_OFFSET;
    let currentId = NAV_ITEMS[0].id;

    for (const section of sections) {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        currentId = section.id;
        break;
      }
    }

    setActiveId(currentId);
  }, []);

  useEffect(() => {
    let rafId: number;
    const throttled = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        detectActiveSection();
        rafId = 0;
      });
    };

    window.addEventListener("scroll", throttled, { passive: true });
    detectActiveSection();
    return () => {
      window.removeEventListener("scroll", throttled);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [detectActiveSection]);

  // Animate indicator pill
  useEffect(() => {
    const pill = pillRef.current;
    const indicator = indicatorRef.current;
    if (!pill || !indicator) return;

    const activeBtn = pill.querySelector<HTMLButtonElement>(`[data-id="${activeId}"]`);
    if (activeBtn) {
      const pillRect = pill.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      indicator.style.transform = `translateX(${btnRect.left - pillRect.left}px)`;
      indicator.style.width = `${btnRect.width}px`;
      indicator.style.opacity = "1";
    }
  }, [activeId]);

  // Handle navigation click
  const handleNavClick = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    isScrollingRef.current = true;
    setActiveId(id);

    const navHeight = containerRef.current?.getBoundingClientRect().height || 100;
    window.scrollTo({
      top: target.offsetTop - navHeight - 16,
      behavior: "smooth",
    });

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 600);
  }, []);

  // Menu toggle
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    if (navigator.vibrate) navigator.vibrate(8);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Main Navigation Bar */}
      <div
        ref={containerRef}
        className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ""}`}
      >
        <div className={styles.navContent}>
          {/* Left - Menu & Greeting */}
          <div className={styles.navLeft}>
            <button
              className={styles.menuBtn}
              onClick={toggleMenu}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <div className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}>
                <span /><span />
              </div>
            </button>
            
            <div className={styles.greetingWrap}>
              <span className={styles.greetingLabel}>{getGreeting()},</span>
              <span className={styles.greetingName}>{firstName}</span>
            </div>
          </div>

          {/* Center - Navigation Pill */}
          <div className={styles.navCenter}>
            <div className={styles.pill} ref={pillRef}>
              <div className={styles.pillIndicator} ref={indicatorRef} />
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  data-id={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`${styles.pillItem} ${activeId === item.id ? styles.pillItemActive : ""}`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 18,
                      fontVariationSettings: `'wght' ${activeId === item.id ? 600 : 400}`,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className={styles.pillLabel}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right - Actions */}
          <div className={styles.navRight}>
            <button className={styles.actionBtn} aria-label="Search">
              <span className="material-symbols-outlined">search</span>
            </button>

            <button className={styles.actionBtn} aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
              {notificationCount > 0 && (
                <span className={styles.badge}>{notificationCount}</span>
              )}
            </button>

            <button className={styles.avatarBtn} aria-label="Profile">
              <span className={styles.avatarText}>
                {firstName.charAt(0).toUpperCase()}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayVisible : ""}`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu Drawer */}
      <aside className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerAvatar}>
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div className={styles.drawerUser}>
            <span className={styles.drawerName}>{firstName}</span>
            <span className={styles.drawerSub}>View Profile →</span>
          </div>
        </div>

        <nav className={styles.drawerNav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.drawerItem} ${activeId === item.id ? styles.drawerItemActive : ""}`}
              onClick={() => {
                handleNavClick(item.id);
                setMenuOpen(false);
              }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.drawerFooter}>
          <button className={styles.drawerFooterBtn}>
            <span className="material-symbols-outlined">settings</span>
            Settings
          </button>
          <button className={styles.drawerFooterBtn}>
            <span className="material-symbols-outlined">help</span>
            Help
          </button>
          <button className={`${styles.drawerFooterBtn} ${styles.drawerLogout}`}>
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}