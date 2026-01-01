// app/dashboard/Navbar.tsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";

/**
 * Sticky horizontal navbar with scrollspy + animated overline.
 *
 * Behavior:
 * - Highlights nav link based on current section in view (scrollspy).
 * - Moves an overline element underneath the active nav item.
 * - Smooth scroll on click with offset (accounts for header + navbar heights).
 *
 * Implementation notes:
 * - Uses window scroll listener and computes active section by comparing scroll position.
 * - Measures link and container positions to move the overline using transform.
 */

const NAV_ITEMS = [
  { id: "featured-lawyers", label: "Featured Lawyers" },
  { id: "lexpal-ai", label: "Lexpal AI" },
  { id: "saved-lawyers", label: "Saved Lawyers" },
  { id: "chats", label: "Chats" },
];

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const overlineRef = useRef<HTMLDivElement | null>(null);

  // Update active nav link based on scroll position
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const handleScroll = () => {
      let current: string | null = null;
      const y = window.scrollY;
      // choose the section whose top is <= y + offset and largest top
      const offset = 150; // matches original heuristic
      for (const s of sections) {
        const top = s.offsetTop - offset;
        const bottom = top + s.offsetHeight;
        if (y >= top && y < bottom) {
          current = s.id;
          break;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Move the overline to active link
  useEffect(() => {
    const container = containerRef.current;
    const overline = overlineRef.current;
    if (!container || !overline) return;

    const activeLink = container.querySelector<HTMLAnchorElement>(
      `a[data-nav="${activeId}"]`
    );

    if (activeLink) {
      const navRect = container.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const offsetLeft = linkRect.left - navRect.left + container.scrollLeft;
      const width = linkRect.width;
      overline.style.transform = `translateX(${offsetLeft}px)`;
      overline.style.width = `${width}px`;
      overline.style.opacity = "1";
    } else {
      overline.style.width = `0px`;
      overline.style.opacity = "0";
    }
  }, [activeId]);

  // Click handler for smooth scroll with offset
  const onClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const header = document.querySelector("header");
    const navbar = containerRef.current;
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
    const offset = headerHeight + navbarHeight;

    const top = target.offsetTop - offset;
    window.scrollTo({ top, behavior: "smooth" });

    // set active immediately for better UX
    setActiveId(id);
  };

  return (
    <nav className={styles.navbar} ref={containerRef}>
      <div className={styles.overline} ref={overlineRef} />
      <div className={styles.links}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-nav={item.id}
            onClick={(e) => onClick(e, item.id)}
            className={`${styles.link} ${activeId === item.id ? styles.active : ""}`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}