import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { COMPANY } from "../../data/company";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerLeft}>
          <h2 className={styles.footerLogo}>LOIND</h2>
          {/* 사업자 정보 — 아티즌 등 그룹 서비스 사이트 푸터와 동일 */}
          <div className={styles.footerCompany}>
            <p>
              {COMPANY.name} <span>|</span> 대표 {COMPANY.ceo}
              {COMPANY.bizNumber && (
                <>
                  <span>|</span> 사업자등록번호 {COMPANY.bizNumber}
                </>
              )}
            </p>
            <p>{COMPANY.address}</p>
            <p>
              {COMPANY.phone && (
                <>
                  전화 {COMPANY.phone} <span>|</span>{" "}
                </>
              )}
              이메일 <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </p>
            {/* 로인드 그룹 전 서비스 공통 개인정보처리방침 */}
            <p className={styles.footerLegal}>
              <Link to="/privacy">개인정보처리방침</Link>
            </p>
          </div>
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
