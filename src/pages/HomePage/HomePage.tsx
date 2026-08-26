import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useStories } from "../../hooks/useStories";
import styles from "./HomePage.module.css";

const TOTAL_SLIDES = 3;
const SLIDE_INTERVAL_MS = 6000;
const ROLLING_INTERVAL_MS = 3000;

const rollingItems: string[] = [
  "브랜딩 에이전시가 필요하세요?",
  "전략 컨설팅이 필요하세요?",
  "이벤트 프로덕션이 필요하세요?",
  "마케팅 에이전시가 필요하세요?",
  "엔터테인먼트 에이전시가 필요하세요?",
  "크리에이티브 에이전시가 필요하세요?",
  "디지털 / 테크 에이전시가 필요하세요?",
];

const hashTags: string[] = [
  "#브랜딩 에이전시",
  "#전략 컨설팅",
  "#이벤트 프로덕션",
  "#마케팅 에이전시",
  "#엔터테인먼트 에이전시",
  "#크리에이티브 에이전시",
  "#디지털 / 테크 에이전시",
];

type BrandKey = "agency" | "studio" | "impact";

interface BrandData {
  desc: ReactNode;
  caption: string;
  image: string;
}

// ※ 아래 설명/태그 문구는 임시 카피입니다 — 확정 카피로 교체해주세요.
// "LOIND PRINCIPLE" 텍스트에 about 페이지의 PRINCIPLE 섹션으로 가는 링크가 걸려 있습니다.
const principleLink = (
  <Link to="/about#principleSection" className={styles["principle-link"]}>
    LOIND PRINCIPLE
    <span className={styles.arrow}>↗</span>
  </Link>
);

const brandShowcaseData: Record<BrandKey, BrandData> = {
  agency: {
    desc: (
      <>
        {principleLink} 아래 함께하는 모든 파트너들과 최고의 파트너십, 최고의
        결과물을 만들어갑니다
      </>
    ),
    caption: "LOER 프로젝트 보기",
    image: "INDEX_CREATIVE AGENCY.png",
  },
  studio: {
    desc: (
      <>
        {principleLink}에 근거한 영감으로 웹, 영상, 음악 등 실행 가능한
        결과물로 인류의 경험을 만들어갑니다.
      </>
    ),
    caption: "LODN 프로젝트 보기",
    image: "INDEX_STUDIO.png",
  },
  impact: {
    desc: "크리스천이라는 신념 아래 모두의 기쁨이 되기 위한 마땅한 일들을 해나갑니다.",
    caption: "Impact 프로젝트 보기",
    image: "INDEX_DAEHEE.png",
  },
};

const brandListItems: { key: BrandKey; label: string }[] = [
  { key: "agency", label: "크리에이티브 에이전시" },
  { key: "studio", label: "크리에이티브 스튜디오" },
  { key: "impact", label: "임팩트" },
];

function formatStoryDate(date: Date): string {
  const y = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${y}.${mm}.${dd}`;
}

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gaugeKey, setGaugeKey] = useState(0);
  const [restartSignal, setRestartSignal] = useState(0);
  const [rollingIndex, setRollingIndex] = useState(0);
  const [activeBrand, setActiveBrand] = useState<BrandKey>("agency");

  const { stories } = useStories(3);

  // --- Hero carousel auto-advance ---
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TOTAL_SLIDES);
      setGaugeKey((k) => k + 1);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isPlaying, restartSignal]);

  // --- Rolling tagline cross-fade ---
  useEffect(() => {
    const id = window.setInterval(() => {
      setRollingIndex((prev) => (prev + 1) % rollingItems.length);
    }, ROLLING_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const handleDotClick = (index: number) => {
    if (isPlaying) {
      setCurrentIndex(index);
      setGaugeKey((k) => k + 1);
      setRestartSignal((s) => s + 1);
    } else {
      setCurrentIndex(index);
    }
  };

  const handlePauseToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const activeBrandData = brandShowcaseData[activeBrand];

  return (
    <>
      <section className={styles["hero-section"]}>
        <div className="container">
          <div className={styles["hero-carousel-container"]}>
            <div
              className={styles["hero-slider-track"]}
              style={{
                transform: `translateX(-${currentIndex * (100 / TOTAL_SLIDES)}%)`,
              }}
            >
              <div className={`${styles["hero-slide"]} ${styles["slide-agent"]}`}>
                <div className={styles["hero-content"]}>
                  <span className={styles["service-tag"]}>Service</span>
                  <h1 className={styles["hero-title"]}>
                    어떤 파트너십이 필요하세요?
                  </h1>

                  <div className={styles["search-bubble"]}>
                    <span>✨</span>
                    <div className={styles["rolling-wrapper"]}>
                      {rollingItems.map((text, i) => (
                        <div
                          key={text}
                          className={`${styles["rolling-item"]} ${
                            i === rollingIndex ? styles.active : ""
                          }`}
                        >
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles["hash-tags"]}>
                    {hashTags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div className={styles["hero-image"]}>
                  <div className={styles["double-tag-container"]}>
                    <div className={styles["unified-tag-hole"]}></div>
                    <div className={styles["main-tag-base"]}>
                      <div className={styles["main-tag-logo"]}>
                        LOIND
                        <br />
                        AGENCY
                      </div>
                    </div>
                    <div className={styles["sub-tag-overlap"]}>
                      <div className={styles["sub-tag-text"]}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles["hero-slide"]} ${styles["slide-image"]}`}>
                <img src="/img/1.png" alt="Dream for Dreamer" />
              </div>

              <div className={`${styles["hero-slide"]} ${styles["slide-image"]}`}>
                <img src="/img/2.png" alt="Coram Deo New Album" />
              </div>
            </div>

            <div className={styles["banner-controls"]}>
              <div
                className={`${styles["control-dots"]} ${
                  !isPlaying ? styles.paused : ""
                }`}
              >
                <div className={styles["control-dots"]}>
                  {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                    <span
                      key={
                        i === currentIndex ? `active-${i}-${gaugeKey}` : `dot-${i}`
                      }
                      className={i === currentIndex ? styles.active : ""}
                      onClick={() => handleDotClick(i)}
                    ></span>
                  ))}
                </div>
              </div>
              <div className={styles["control-pause"]} onClick={handlePauseToggle}>
                {isPlaying ? "||" : "▶"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles["carousel-section"]}>
        <div className={`container ${styles["carousel-container-boxed"]}`}>
          <div className={styles["section-header"]}>
            <p className={styles["section-desc"]}>LOIND BRAND</p>
          </div>

          <div className={styles["brand-showcase"]}>
            <div className={styles["brand-list"]}>
              {brandListItems.map((item) => (
                <div
                  key={item.key}
                  className={`${styles["brand-list-item"]} ${
                    activeBrand === item.key ? styles.active : ""
                  }`}
                  onClick={() => setActiveBrand(item.key)}
                >
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className={styles["brand-detail"]}>
              <p className={styles["brand-detail-desc"]}>
                {activeBrandData.desc}
              </p>
              <div className={styles["brand-detail-image"]}>
                {activeBrandData.image && (
                  <img
                    className={styles["brand-detail-photo"]}
                    src={`/${activeBrandData.image}`}
                    alt={activeBrandData.caption}
                    style={{ display: "block" }}
                  />
                )}
                <span className={styles["brand-detail-caption"]}>
                  {activeBrandData.caption} <span>›</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles["story-section"]}>
        <div className="container">
          <div className={styles["story-header"]}>
            <h2>Stories</h2>
            <Link to="/story" className={styles["view-all"]}>
              VIEW ALL STORIES ➔
            </Link>
          </div>
          <div className={styles["card-grid-3"]}>
            {stories.map((story) => {
              const dateText = formatStoryDate(new Date(story.created_at));
              return (
                <Link
                  key={story.id}
                  to="/story"
                  className={styles["story-card"]}
                >
                  <div className={styles["story-thumb-wrapper"]}>
                    <img
                      src={story.img}
                      className={styles["story-thumb"]}
                      alt={story.title}
                    />
                  </div>
                  <div
                    style={{
                      padding: "0 20px 20px 20px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <div className={styles["story-meta"]}>
                      <span className={styles["story-cat"]}>
                        {story.category}
                      </span>
                      <p className={styles["story-date"]}>{dateText}</p>
                    </div>
                    <h3 className={styles["story-title"]}>{story.title}</h3>
                    <p className={styles["story-desc"]}>{story.text}</p>
                    <div className={styles["story-footer"]}>
                      <div className={styles["story-tags"]}>
                        <span className={styles["story-tag-item"]}>
                          {story.category}
                        </span>
                      </div>
                      <div className={styles["story-arrow-click"]}>➔</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
