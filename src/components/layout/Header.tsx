import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { GroupMenuPanel } from "./GroupMenuPanel";
import { GroupMenuTrigger } from "./GroupMenuTrigger";

interface HeaderProps {
  variant?: "static" | "sticky";
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

export default function Header({ variant = "static" }: HeaderProps) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (variant !== "sticky") return;
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 80);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const header = <header className={styles.header}>
    <div className={`container ${styles.headerInner}`}>
      <div className={styles.brandArea}>
        <GroupMenuTrigger open={menuOpen} onClick={() => setMenuOpen((value) => !value)} />
        <div className={styles.logo} onClick={() => { closeMenu(); navigate("/"); }}>LOIND</div>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/about" className={navLinkClassName} onClick={closeMenu}>About</NavLink>
        <NavLink to="/service" className={navLinkClassName} onClick={closeMenu}>Service</NavLink>
        <NavLink to="/story" className={navLinkClassName} onClick={closeMenu}>Story</NavLink>
        <NavLink to="/contact" className={navLinkClassName} onClick={closeMenu}>Contact</NavLink>
        <div className={styles.navSeparator} />
        <a href="https://www.loindworks.com" target="_blank" rel="noopener noreferrer" className={styles.navLink} onClick={closeMenu}>Works</a>
      </nav>
    </div>
    {menuOpen && <GroupMenuPanel onClose={closeMenu} />}
  </header>;

  return variant === "sticky" ? <div className={`${styles.stickyChrome} ${hidden ? styles.chromeHidden : ""}`}>{header}</div> : header;
}
