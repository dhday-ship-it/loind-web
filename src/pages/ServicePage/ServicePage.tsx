import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ServicePage.module.css";
import { christianGroups } from "../../data/christianBusiness";
import {
  loerBrand,
  lodnBrand,
  type ServiceCategory,
} from "../../data/serviceBrands";

type BrandKey = "loer" | "lodn" | "christian";

function Verse({ text }: { text: string }) {
  return (
    <p
      style={{
        padding: "28px 0",
        fontSize: "16px",
        lineHeight: 1.8,
        color: "#555",
        wordBreak: "keep-all",
      }}
    >
      {text}
    </p>
  );
}

/** LOER's internal tabbed service-category list (legacy `switchSvcTab`). */
function LoerServiceList({ list }: { list: ServiceCategory[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles["service-list"]}>
      <div className={styles["tab-list"]}>
        {list.map((c, i) => (
          <div
            key={c.cat}
            className={`${styles["svc-tab"]} ${i === activeTab ? styles.active : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {c.cat}
          </div>
        ))}
      </div>
      <div className={styles["items-panel"]}>
        {list.map((c, i) => (
          <div
            key={c.cat}
            className={`${styles["items-tags"]} ${i === activeTab ? styles.active : ""}`}
          >
            {c.items.map((it) => (
              <span key={it} className={styles["item-tag"]}>
                {it}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LoerContent() {
  const d = loerBrand;
  return (
    <>
      <section
        className={styles["middle-banner-section"]}
        style={{ background: "#fff", paddingBottom: "20px" }}
      >
        <div className="container">
          <h2 style={{ fontSize: "34px", letterSpacing: "-0.5px" }}>
            {d.bannerTitle}
          </h2>
        </div>
      </section>
      <section className={styles["business-section"]}>
        <div className="container">
          <div style={{ paddingBottom: "28px" }}>
            <Verse text={d.standard} />
          </div>
          <h3 style={{ marginTop: 0, marginBottom: "32px" }}>
            {d.sectionTitle}
          </h3>
          <LoerServiceList list={d.serviceList} />
        </div>
      </section>
    </>
  );
}

function LodnContent() {
  const d = lodnBrand;
  return (
    <>
      <section className={styles["middle-banner-section"]}>
        <div className="container">
          <h2 style={{ fontSize: "34px", letterSpacing: "-0.5px" }}>
            {d.bannerTitle}
          </h2>
        </div>
        <div className={styles["lodn-video-wrap"]}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles["lodn-video"]}
          >
            <source src="/LODN.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
      <section className={styles["business-section"]}>
        <div className="container">
          <Verse text={d.standard} />
          <div className={styles["lodn-features"]}>
            {d.features.map((f) => (
              <div key={f.title} className={styles["lodn-feature"]}>
                <div className={styles["lodn-feature-icon"]}>
                  <img src={f.image} alt={f.alt} />
                </div>
                <p className={styles["lodn-feature-title"]}>{f.title}</p>
                <p className={styles["lodn-feature-desc"]}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ChristianBusinessContent() {
  const [selected, setSelected] = useState(0);
  const group = christianGroups[selected];

  return (
    <>
      <section className={styles["daehee-hero"]}>
        <div className="container">
          <div className={styles["daehee-banner"]}>
            <div className={styles["daehee-banner-image"]}>
              <img src="/INDEX_DAEHEE.png" alt="Impact" />
            </div>
            <div className={styles["daehee-banner-info"]}>
              <h3 className={styles["daehee-banner-title"]}>Impact</h3>
              <div className={styles["daehee-banner-details"]}>
                <div className={styles["daehee-banner-row"]}>
                  <p className={styles["daehee-banner-value"]}>
                    하나님과 사람 사이에서 축복의 통로 쓰임받는 일들을 만들어갑니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles["cb-section"]}>
        <div className="container">
          <p className={styles["schedule-eyebrow"]}>SERVICE</p>
          <h2 className={styles["schedule-title"]}>I am a Christian.</h2>

          <div className={styles["cb-app"]}>
            <aside className={styles["cb-side"]}>
              <h3 className={styles["cb-side-title"]}>Service</h3>
              <p className={styles["cb-side-sub"]}>항목</p>
              {christianGroups.map((g, gi) => (
                <button
                  key={g.name}
                  type="button"
                  className={`${styles["cb-item"]} ${gi === selected ? styles["cb-item-active"] : ""}`}
                  onClick={() => setSelected(gi)}
                >
                  <span className={styles["cb-icon"]}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                  </span>
                  <span className={styles["cb-item-text"]}>
                    <span className={styles["cb-item-name"]}>{g.name}</span>
                    <span className={styles["cb-item-ko"]}>{g.nameKo}</span>
                  </span>
                  <i className={`${styles["cb-status"]} ${gi === selected ? styles["cb-status-on"] : ""}`} />
                </button>
              ))}
            </aside>

            <section className={styles["cb-detail"]}>
              <div key={group.name} className={styles["cb-detail-inner"]}>
                <h3 className={styles["cb-detail-title"]}>
                  {group.name}
                  <span>{group.nameKo}</span>
                </h3>

                {group.cards.map((card) => (
                  <div key={card.label} className={styles["cb-block"]}>
                    <h4>{card.label}</h4>
                    {card.items.length === 0 ? (
                      <p className={styles["cb-empty"]}>등록된 내용이 없습니다.</p>
                    ) : (
                      <p className={styles["cb-items"]}>
                        {card.items.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </p>
                    )}
                  </div>
                ))}

                <div className={styles["cb-foot"]}>
                  <Link to={group.to} className={styles["cb-link"]}>
                    {group.name} 페이지 바로가기 <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ServicePage() {
  const [activeBrand, setActiveBrand] = useState<BrandKey>("loer");
  const [fading, setFading] = useState(false);
  const brandsGridRef = useRef<HTMLDivElement>(null);
  const brandContentRef = useRef<HTMLDivElement>(null);

  function switchBrand(key: BrandKey) {
    if (key === activeBrand) return;
    setFading(true);
    window.setTimeout(() => {
      setActiveBrand(key);
      setFading(false);
      brandContentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 220);
  }

  function scrollToBrands() {
    brandsGridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <>
      <section className={styles["services-top-section"]}>
        <div className="container">
          <div className={styles["brands-grid"]} ref={brandsGridRef}>
            <div
              className={`${styles["brand-item"]} ${activeBrand === "loer" ? styles.active : ""}`}
              onClick={() => switchBrand("loer")}
            >
              <span className={styles["brand-name"]}>Creative Agency</span>
              <span className={styles["brand-tag"]}>에이전시</span>
            </div>
            <div className={styles["brands-divider"]} />
            <div
              className={`${styles["brand-item"]} ${activeBrand === "lodn" ? styles.active : ""}`}
              onClick={() => switchBrand("lodn")}
            >
              <span className={styles["brand-name"]}>Studio LODN</span>
              <span className={styles["brand-tag"]}>로든 스튜디오</span>
            </div>
            <div className={styles["brands-divider"]} />
            <div
              className={`${styles["brand-item"]} ${activeBrand === "christian" ? styles.active : ""}`}
              onClick={() => switchBrand("christian")}
            >
              <span className={styles["brand-name"]}>Christian Business</span>
              <span className={styles["brand-tag"]}>크리스천 비즈니스</span>
            </div>
          </div>
          <div className={styles["section-divider"]} />
        </div>
      </section>

      <div
        id="brand-content"
        ref={brandContentRef}
        className={`${styles["brand-content"]} ${fading ? styles.fading : ""}`}
      >
        {activeBrand === "loer" && <LoerContent />}
        {activeBrand === "lodn" && <LodnContent />}
        {activeBrand === "christian" && <ChristianBusinessContent />}
      </div>

      <div className={styles["back-to-top-wrap"]}>
        <div className={styles["back-to-top"]} onClick={scrollToBrands}>
          ↑ &nbsp;브랜드 선택으로 돌아가기
        </div>
      </div>
    </>
  );
}
