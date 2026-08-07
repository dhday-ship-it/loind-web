import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerLeft}>
          <h2 className={styles.footerLogo}>LOIND</h2>
          <p className={styles.footerCopy}>© 2026 LOIND. All rights reserved.</p>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.footerLinks}>
            <h4>Company</h4>
            <div className={styles.footerLinkCols}>
              <div className={styles.footerLinkCol}>
                <Link to="/about">About</Link>
                <Link to="/service">Service</Link>
                <Link to="/story">Story</Link>
                <Link to="/contact">Contact</Link>
                <a
                  href="https://www.loindworks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Works
                </a>
              </div>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <h4>Resources</h4>
            <div className={styles.footerLinkCols}>
              <div className={styles.footerLinkCol}>
                <Link to="/story">Story</Link>
                <a
                  href="https://www.instagram.com/loind_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  href="https://youtube.com/@loind-youtube?si=X0Cy9L6flUmFkft9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Youtube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
