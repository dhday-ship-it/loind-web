import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

interface HeaderProps {
  /** "sticky" auto-hides the header on downward scroll (used on the About page). */
  variant?: "static" | "sticky";
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

export default function Header({ variant = "static" }: HeaderProps) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (variant !== "sticky") return;

    lastScrollY.current = window.scrollY;
    function onScroll() {
      const currentY = window.scrollY;
      const scrolledDown = currentY > lastScrollY.current;
      setHidden(scrolledDown && currentY > 80);
      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const header = (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <div className={styles.logo} onClick={() => navigate("/")}>
          LOIND
        </div>
        <nav className={styles.nav}>
          <NavLink to="/about" className={navLinkClassName}>
            About
          </NavLink>
          <NavLink to="/service" className={navLinkClassName}>
            Service
          </NavLink>
          <NavLink to="/story" className={navLinkClassName}>
            Story
          </NavLink>
          <NavLink to="/contact" className={navLinkClassName}>
            Contact
          </NavLink>
          <div className={styles.navSeparator} />
          <a
            href="https://www.loindworks.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            Works
          </a>
        </nav>
      </div>
    </header>
  );

  if (variant === "sticky") {
    return (
      <div
        className={`${styles.stickyChrome} ${hidden ? styles.chromeHidden : ""}`}
      >
        {header}
      </div>
    );
  }

  return header;
}
