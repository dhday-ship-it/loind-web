import { useRef, useState, type CSSProperties } from "react";
import styles from "./ServicePage.module.css";
import {
  loerBrand,
  lodnBrand,
  daeheeBrand,
  type ServiceCategory,
} from "../../data/serviceBrands";

type BrandKey = "loer" | "lodn" | "daehee";

const badgeStyle: CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  color: "#fff",
  background: "#111",
  padding: "4px 10px",
  borderRadius: "4px",
  letterSpacing: "1px",
  textTransform: "uppercase",
};

/** Faithful port of legacy `renderStandard()` — supports the 3 principle-badge layouts. */
function PrincipleBadge({ level, text }: { level: number; text: string }) {
  if (level === 1) {
    const verseMatch = text.match(/^(.*?)(\[.*?\])$/s);
    const quote = verseMatch ? verseMatch[1].trim() : text;
    const verse = verseMatch ? verseMatch[2] : "";
    return (
      <div
        style={{
          padding: "28px 0",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "4px",
            minHeight: "16px",
            background: "#55689B",
            borderRadius: "2px",
            flexShrink: 0,
            marginTop: "2px",
          }}
        />
        <div>
          <p
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#111",
              letterSpacing: "-0.3px",
              marginBottom: "8px",
            }}
          >
            LOIND PRINCIPLE
          </p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: 400,
              color: "#aaa",
              lineHeight: 1.75,
              wordBreak: "keep-all",
            }}
          >
            {quote}{" "}
            <span style={{ fontSize: "13px", fontWeight: 600 }}>{verse}</span>
          </p>
        </div>
      </div>
    );
  }
  if (level === 2) {
    return (
      <div
        style={{
          padding: "28px 0",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={badgeStyle}>LOIND PRINCIPLE</span>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "#555" }}>
          {text}
        </span>
      </div>
    );
  }
  return (
    <div style={{ padding: "28px 0" }}>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 500,
          color: "#aaa",
          letterSpacing: "0.5px",
        }}
      >
        LOIND PRINCIPLE &nbsp;—&nbsp; {text}
      </span>
    </div>
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
          <div style={{ padding: "28px 0 56px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  ...badgeStyle,
                  padding: "5px 10px",
                  flexShrink: 0,
                  minWidth: "112px",
                  textAlign: "center",
                }}
              >
                LOIND PRINCIPLE
              </span>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#555",
                  lineHeight: 1.6,
                }}
              >
                {d.standard}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  ...badgeStyle,
                  padding: "5px 10px",
                  flexShrink: 0,
                  minWidth: "112px",
                  textAlign: "center",
                }}
              >
                Slogan
              </span>
              <span
                style={{ fontSize: "15px", fontWeight: 400, color: "#555" }}
              >
                {d.slogan}
              </span>
            </div>
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
          <PrincipleBadge level={d.standardLevel} text={d.standard} />
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

function DaeheeContent() {
  const d = daeheeBrand;
  const b = d.banner;
  const [activeValue, setActiveValue] = useState(0);
  const [openDetail, setOpenDetail] = useState<number | null>(null);

  return (
    <>
      <section className={styles["daehee-hero"]}>
        <div className="container">
          <div className={styles["daehee-banner"]}>
            <div className={styles["daehee-banner-image"]}>
              <img src={b.image} alt={b.title} />
            </div>
            <div className={styles["daehee-banner-info"]}>
              <h3 className={styles["daehee-banner-title"]}>{b.title}</h3>
              <div className={styles["daehee-banner-details"]}>
                {b.topicLabel && (
                  <div className={styles["daehee-banner-row"]}>
                    <span className={styles["daehee-banner-label"]}>{b.topicLabel}</span>
                    <p className={styles["daehee-banner-value"]}>{b.topic}</p>
                  </div>
                )}
                {b.verseLabel && (
                  <div className={styles["daehee-banner-row"]}>
                    <span className={styles["daehee-banner-label"]}>{b.verseLabel}</span>
                    <p className={styles["daehee-banner-value"]}>{b.verse}</p>
                  </div>
                )}
                {b.date && (
                  <div className={styles["daehee-banner-row"]}>
                    {b.dateLabel && <span className={styles["daehee-banner-label"]}>{b.dateLabel}</span>}
                    <p className={styles["daehee-banner-value"]}>{b.date}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles["schedule-section"]}>
        <div className="container">
          <p className={styles["schedule-eyebrow"]}>SERVICE</p>
          <h2 className={styles["schedule-title"]}>I am a Christian.</h2>
          <div className={styles["schedule-panel"]}>
            <div className={styles["schedule-list"]}>
              {d.schedule.map((item, i) => (
                <div
                  key={item.name}
                  className={`${styles["schedule-item"]} ${i === activeValue ? styles.active : ""}`}
                  onClick={() => {
                    setActiveValue(i);
                    setOpenDetail(null);
                  }}
                >
                  <span className={styles["schedule-name"]}>{item.name}</span>
                  {item.nameKo && (
                    <span className={styles["schedule-name-ko"]}>{item.nameKo}</span>
                  )}
                </div>
              ))}
            </div>
            <div className={styles["schedule-detail"]}>
              {d.schedule[activeValue] && (
                <div className={styles["detail-boxes"]}>
                  {(d.schedule[activeValue].details ?? []).map((item, i) => (
                    <div
                      key={item.label}
                      className={styles["detail-card"]}
                      onClick={() => setOpenDetail(openDetail === i ? null : i)}
                    >
                      <div className={styles["detail-line-row"]}>
                        <p className={styles["detail-line"]}>{item.label}</p>
                        <span
                          className={`${styles["detail-toggle-icon"]} ${openDetail === i ? styles.open : ""}`}
                        >
                          +
                        </span>
                      </div>
                      <div
                        className={`${styles["detail-panel"]} ${openDetail === i ? styles.open : ""}`}
                      >
                        <div className={styles["detail-panel-inner"]}>
                          <p className={styles["detail-panel-text"]}>{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              <span className={styles["brand-tag"]}>business</span>
            </div>
            <div
              className={`${styles["brand-item"]} ${activeBrand === "lodn" ? styles.active : ""}`}
              onClick={() => switchBrand("lodn")}
            >
              <span className={styles["brand-name"]}>
                Creative Studio: LODN
              </span>
              <span className={styles["brand-tag"]}>business</span>
            </div>
            <div className={styles["brands-divider"]} />
            <div
              className={`${styles["brand-item"]} ${activeBrand === "daehee" ? styles.active : ""}`}
              onClick={() => switchBrand("daehee")}
            >
              <span className={styles["brand-name"]}>Impact Brand</span>
              <span className={styles["brand-tag"]}>impact</span>
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
        {activeBrand === "daehee" && <DaeheeContent />}
      </div>

      <div className={styles["back-to-top-wrap"]}>
        <div className={styles["back-to-top"]} onClick={scrollToBrands}>
          ↑ &nbsp;브랜드 선택으로 돌아가기
        </div>
      </div>
    </>
  );
}
