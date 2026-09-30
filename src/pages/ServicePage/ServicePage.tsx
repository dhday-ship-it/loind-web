import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ServicePage.module.css";
import { christianGroups } from "../../data/christianBusiness";
import {
  loerBrand,
  lodnBrand,
  videoProductionGenres,
  type ServiceCategory,
  type ServiceItemCard,
} from "../../data/serviceBrands";

const CARD_GRADIENTS = [
  "linear-gradient(155deg, #6a63e0, #8f8ff2)",
  "linear-gradient(155deg, #f2a93c, #f6c866)",
  "linear-gradient(155deg, #ea6f8e, #f2a0ac)",
  "linear-gradient(155deg, #4fb677, #7fd39b)",
];

type BrandKey = "loer" | "lodn" | "christian";

const GENRE_ICONS: Record<string, JSX.Element> = {
  인터뷰영상: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5v4" />
      <path d="M8.5 21.5h7" />
    </svg>
  ),
  스케치영상: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20.5 4.7 17l10-10 2.8 2.8-10 10-3.5.7Z" />
      <path d="M13.2 8.5 15.5 6l2.8 2.8-2.3 2.5" />
    </svg>
  ),
  강의영상: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="12" rx="2" />
      <path d="M9 20.5h6" />
      <path d="M12 16.5v4" />
      <path d="M7.5 12.5 10.5 9l2 2 3.5-4" />
    </svg>
  ),
  홍보영상: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5v3a1 1 0 0 0 1 1h2l4.5 3.2a1 1 0 0 0 1.6-.8V7.1a1 1 0 0 0-1.6-.8L6 9.5H4a1 1 0 0 0-1 1Z" />
      <path d="M15.5 9.5a3 3 0 0 1 0 5" />
      <path d="M18 7.3a6 6 0 0 1 0 9.4" />
    </svg>
  ),
};

function Verse({ text }: { text: string }) {
  return (
    <p
      style={{
        padding: "8px 0",
        fontSize: "16px",
        lineHeight: 1.8,
        color: "#555",
        wordBreak: "keep-all",
        textAlign: "center",
      }}
    >
      {text}
    </p>
  );
}

/** 영상 프로덕션 전용: 장르별 카드를 그리드로 한 번에 보여준다. */
function VideoProductionCard() {
  return (
    <div className={styles["genre-card-grid"]}>
      {videoProductionGenres.map((g, i) => (
        <Link key={g.name} to="/story" className={styles["genre-card"]}>
          <div
            className={styles["genre-card-top"]}
            style={{ background: CARD_GRADIENTS[i % CARD_GRADIENTS.length] }}
          >
            {g.image ? (
              <img src={g.image} alt="" className={styles["genre-card-image"]} />
            ) : (
              <span className={styles["genre-card-icon"]}>{GENRE_ICONS[g.name]}</span>
            )}
          </div>
          <div className={styles["genre-card-body"]}>
            <h4 className={styles["genre-card-title"]}>{g.name}</h4>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** 영상 프로덕션처럼 이미지 카드 그리드로 보여주는 범용 컴포넌트. */
function ItemCardGrid({ cards, note }: { cards: ServiceItemCard[]; note?: string }) {
  return (
    <>
      <div className={styles["genre-card-grid"]}>
        {cards.map((item, i) => (
          <Link key={item.name} to="/story" className={styles["genre-card"]}>
            <div
              className={styles["genre-card-top"]}
              style={{ background: CARD_GRADIENTS[i % CARD_GRADIENTS.length] }}
            >
              {item.image ? (
                <img src={item.image} alt="" className={styles["genre-card-image"]} />
              ) : (
                <span className={styles["genre-card-tbd"]}>TBD</span>
              )}
            </div>
            <div className={styles["genre-card-body"]}>
              <h4 className={styles["genre-card-title"]}>{item.name}</h4>
            </div>
          </Link>
        ))}
      </div>
      {note && (
        <p className={styles["cards-note"]}>
          {note.split("\n").map((line, i) => (
            <span key={i} className={i === 0 ? undefined : styles["cards-note-sub"]}>
              {line}
              {i < note.split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>
      )}
    </>
  );
}

/** LOER's service categories: 위 아이콘을 클릭하면 아래 내용이 바뀐다. */
function LoerServiceList({ list, title }: { list: ServiceCategory[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const current = list[selected];

  return (
    <div className={styles["service-tabs"]}>
      <h3 className={styles["service-tabs-title"]}>{title}</h3>
      <div className={styles["category-icon-row"]}>
        {list.map((c, i) => (
          <button
            key={c.cat}
            type="button"
            className={`${styles["category-icon-btn"]} ${i === selected ? styles.active : ""}`}
            onClick={() => setSelected(i)}
          >
            {c.icon && <img src={c.icon} alt="" />}
            <span>{c.cat}</span>
          </button>
        ))}
      </div>

      <div className={styles["service-panel"]}>
        {current.cat === "영상 프로덕션" ? (
          <VideoProductionCard />
        ) : (
          <ItemCardGrid cards={current.cards ?? []} note={current.cardsNote} />
        )}
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
        style={{ background: "#fff", paddingBottom: "6px" }}
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
          <LoerServiceList list={d.serviceList} title={d.sectionTitle} />
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
                  {group.to.startsWith("http") ? (
                    <a
                      href={group.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles["cb-link"]}
                    >
                      {group.name} 페이지 바로가기 <span aria-hidden>→</span>
                    </a>
                  ) : (
                    <Link to={group.to} className={styles["cb-link"]}>
                      {group.name} 페이지 바로가기 <span aria-hidden>→</span>
                    </Link>
                  )}
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
