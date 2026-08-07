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

            <div className={styles["sns-wrap"]}>
              <Link to="/story">Story</Link>
              <a
                href="https://www.instagram.com/loind_official/"
                target="_blank"
                rel="noopener noreferrer"
              >
                INSTAGRAM
              </a>
              <a
                href="https://youtube.com/@loind-youtube?si=X0Cy9L6flUmFkft9"
                target="_blank"
                rel="noopener noreferrer"
              >
                YOUTUBE
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
