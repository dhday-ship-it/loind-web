import { useRef } from "react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  async function saveAsPng() {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.download = "LOIND_Business_Card.png";
    link.href = canvas.toDataURL();
    link.click();
  }

  return (
    <main className="container">
      <div className={styles["contact-container"]}>
        <div className={styles["contact-header"]}>
          <h2>CONTACT.</h2>
          <p>
            프로젝트 문의 및 파트너십 제안은
            <br />
            언제나 열려있습니다.
          </p>
        </div>

        <div className={styles["contact-content"]}>
          <div className={styles["info-left"]}>
            <div className={styles["info-box"]}>
              <span className={styles["label"]}>Project Inquiry</span>
              <span className={styles["value"]}>contact@loind.com</span>
            </div>
            <div className={styles["info-box"]}>
              <span className={styles["label"]}>Office</span>
              <div className={styles["address-list"]}>
                <div className={styles["address-item"]}>
                  <p className={styles["addr-value"]}>
                    경기 부천시 원미구 소향로 131
                    <br />
                    7층 726호 (중동워크리움)
                  </p>
                </div>
              </div>
            </div>

            {/* 채널 바로가기: 연한 알약 + 각 브랜드 색 아이콘 */}
            <div className={styles["sns-wrap"]}>
              <Link to="/story" className={styles["sns-story"]}>
                <span className={styles["sns-icon"]} aria-hidden="true">
                  <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="#111" /><path d="M8 8.5h8M8 12h8M8 15.5h5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </span>
                Story
              </Link>
              <a className={styles["sns-instagram"]} href="https://www.instagram.com/loind_official/" target="_blank" rel="noopener noreferrer">
                <span className={styles["sns-icon"]} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <defs>
                      <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="5%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="90%" stopColor="#285aeb" />
                      </radialGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#igGrad)" />
                    <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" strokeWidth="1.8" />
                    <circle cx="16.1" cy="7.9" r="0.95" fill="#fff" />
                  </svg>
                </span>
                Instagram
              </a>
              <a className={styles["sns-youtube"]} href="https://youtube.com/@loind-youtube?si=X0Cy9L6flUmFkft9" target="_blank" rel="noopener noreferrer">
                <span className={styles["sns-icon"]} aria-hidden="true">
                  <svg viewBox="0 0 24 24"><rect x="2" y="5.5" width="20" height="13.5" rx="4" fill="#ff0000" /><path d="M10.2 9.4v5.7l4.9-2.85z" fill="#fff" /></svg>
                </span>
                YouTube
              </a>
              {/* 아티즌 사이트와 같은 로인드 카카오톡 채널 */}
              <a className={styles["sns-kakao"]} href="https://pf.kakao.com/_iIxbxnX/chat" target="_blank" rel="noopener noreferrer">
                <span className={styles["sns-icon"]} aria-hidden="true">
                  <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="#fee500" /><path d="M12 6.5c-3.6 0-6.5 2.27-6.5 5.08 0 1.8 1.2 3.38 3 4.27-.13.48-.48 1.74-.55 2-.09.34.12.33.26.24.11-.07 1.71-1.16 2.4-1.63.44.06.9.1 1.39.1 3.6 0 6.5-2.27 6.5-5.08S15.6 6.5 12 6.5z" fill="#3c1e1e" /></svg>
                </span>
                KakaoTalk
              </a>
            </div>
          </div>

          <div className={styles["info-right"]}>
            <div className={styles["brand-seal"]} id="cardArea" ref={cardRef}>
              <div className={styles["logo-title"]}>LOIND</div>
              <div className={styles["biz-info"]}>
                <p style={{ fontWeight: 800, marginBottom: 6, fontSize: 14 }}>
                  (주)로인드 (LOIND Co., Ltd.)
                </p>
                <p>e-mail : contact@loind.com</p>
                <p>대표이사 : 정대희</p>
                <div className={styles["tag"]}>
                  © 2026 LOIND. All rights reserved.
                </div>
              </div>
            </div>

            <button className={styles["save-card-btn"]} onClick={saveAsPng}>
              <svg viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              명함 저장 (PNG)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
