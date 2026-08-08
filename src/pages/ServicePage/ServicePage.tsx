import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./ServicePage.module.css";
import {
  loerBrand,
  lodnBrand,
  daeheeBrand,
  type ServiceCategory,
  type DaeheeIcon,
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

const channelIconPaths: Record<DaeheeIcon, ReactNode> = {
  fund: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v5c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 11v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" />
    </>
  ),
  space: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  community: (
    <>
      <circle cx="9" cy="9" r="3.2" />
      <circle cx="17" cy="10.5" r="2.4" />
      <path d="M3.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6" />
      <path d="M14.8 15.2c2.3.3 4.2 2.4 4.2 4.8" />
    </>
  ),
  app: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 18.2h3" />
    </>
  ),
};

function ChannelIcon({ icon }: { icon: DaeheeIcon }) {
  return (
    <svg
      className={styles["channel-icon"]}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {channelIconPaths[icon]}
    </svg>
  );
}

/** Faithful port of legacy `rippleIcon()` — used as a fallback when a stage has no image. */
function RippleIcon({ stageIdx }: { stageIdx: number }) {
  const gold = "var(--dh-gold)";
  if (stageIdx === 0) {
    return (
      <svg className={styles["stage-ripple"]} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="11" fill={gold} />
      </svg>
    );
  }
  if (stageIdx === 1) {
    return (
      <svg className={styles["stage-ripple"]} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="9" fill={gold} />
        <circle
          className={styles.ring}
          cx="50"
          cy="50"
          r="24"
          fill="none"
          stroke={gold}
          strokeWidth={2}
          opacity={0.5}
        />
      </svg>
    );
  }
  return (
    <svg className={styles["stage-ripple"]} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="8" fill={gold} />
      <circle
        className={styles.ring}
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke={gold}
        strokeWidth={2}
        opacity={0.55}
      />
      <circle
        className={`${styles.ring} ${styles["ring-anim"]}`}
        cx="50"
        cy="50"
        r="33"
        fill="none"
        stroke={gold}
        strokeWidth={2}
        opacity={0.32}
      />
      <circle
        className={`${styles.ring} ${styles["ring-anim"]}`}
        style={{ animationDelay: "1s" }}
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={gold}
        strokeWidth={1.5}
        opacity={0.16}
      />
    </svg>
  );
}

function DaeheeContent() {
  const d = daeheeBrand;
  return (
    <>
      <section className={styles["daehee-hero"]}>
        <div className="container">
          <p className={styles["daehee-eyebrow"]}>
            {d.subTitle} · {d.bannerTitle}
          </p>
          {d.standard && d.standard !== "TBD" && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PrincipleBadge level={d.standardLevel} text={d.standard} />
            </div>
          )}
          <h2 className={styles["daehee-question"]}>
            어떤 <span className={styles["daehee-accent"]}>기쁨</span>에
            <br />
            참여하기 원하세요?{" "}
            <span className={styles["daehee-accent"]}>:)</span>
          </h2>
          <p className={styles["daehee-intro"]}>{d.intro}</p>
        </div>
      </section>
      <section className={styles["daehee-stages"]}>
        <div className="container">
          <div className={styles["stage-flow"]}>
            {d.stages.map((s, i) => (
              <div key={s.name} style={{ display: "contents" }}>
                {i > 0 && <div className={styles["stage-arrow"]}>→</div>}
                <div className={styles["stage-block"]}>
                  {s.image ? (
                    <div
                      className={styles["stage-media"]}
                      style={{ backgroundImage: `url('${s.image}')` }}
                    />
                  ) : (
                    <div
                      className={`${styles["stage-media"]} ${styles["stage-media-empty"]}`}
                    >
                      <RippleIcon stageIdx={i} />
                    </div>
                  )}
                  <p className={styles["stage-name"]}>{s.name}</p>
                  <p className={styles["stage-line"]}>{s.line}</p>
                  <p className={styles["stage-desc"]}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={styles["daehee-services"]}>
        <div className="container">
          <p className={styles["daehee-eyebrow"]}>{d.servicesEyebrow}</p>
          <h3 className={styles["daehee-services-title"]}>{d.servicesTitle}</h3>
          <p className={styles["daehee-services-intro"]}>{d.servicesIntro}</p>
          <div className={styles["daehee-programs"]}>
            {d.services.map((s) => (
              <div key={s.title} className={styles["dh-program"]}>
                <div className={styles["dh-program-media"]}>
                  <ChannelIcon icon={s.icon} />
                  <span className={styles["media-caption"]}>사진 준비 중</span>
                </div>
                <div className={styles["dh-program-content"]}>
                  <div className={styles["dh-program-heading"]}>
                    <ChannelIcon icon={s.icon} />
                    <h4 className={styles["dh-program-title"]}>{s.title}</h4>
                  </div>
                  <div className={styles["dh-program-list"]}>
                    {s.items.map((it) => (
                      <div key={it.subtitle}>
                        <p className={styles["dh-item-subtitle"]}>
                          {it.subtitle}
                        </p>
                        <p className={styles["dh-item-desc"]}>{it.desc}</p>
                      </div>
                    ))}
                  </div>
                  {s.callout && (
                    <div className={styles["dh-callout"]}>{s.callout}</div>
                  )}
                </div>
              </div>
            ))}
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
              <span className={styles["brand-name"]}>Glowy:</span>
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
