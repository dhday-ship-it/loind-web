import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent as ReactTransitionEvent,
} from "react";
import { Link } from "react-router-dom";
import { useStories } from "../../hooks/useStories";
import { displayCategory } from "../../types/story";
import styles from "./HomePage.module.css";

// ※ 바꿀 때 HomePage.module.css 의 fillGauge 애니메이션 시간도 같이 맞춰주세요.
const SLIDE_INTERVAL_MS = 9000;
const ROLLING_INTERVAL_MS = 3000;

// 아티즌 카드 안의 "어떤 파트너십이 필요하세요?" 배너 문구
// ※ 실제 서비스 항목(data/serviceBrands.ts 의 artisanBrand)과 맞춰둡니다.
const rollingItems: string[] = [
  "스케치·홍보영상이 필요하세요?",
  "인터뷰·강의영상이 필요하세요?",
  "로고·캐릭터 디자인이 필요하세요?",
  "포스터·배너 디자인이 필요하세요?",
  "판촉물 제작이 필요하세요?",
  "웹·앱 개발이 필요하세요?",
  "온·오프라인 세미나가 필요하세요?",
];

// 롤링 문구 순서와 같은 순서의 실제 작업 이미지 (아티즌 카드 오른쪽 카드 묶음)
const rollingImages: string[] = [
  "/img/video-genre-sketch.jpg",
  "/img/video-genre-interview-v3.jpg",
  "/img/design-logo.jpg",
  "/img/design-promo-goods-v3.jpg",
  "/img/design-promo-items.jpg",
  "/img/itdev-web-v2.jpg",
  "/img/seminar-offline.jpg",
];

interface HeroSlide {
  key: string;
  agent?: boolean; // true 면 이미지 카드 대신 에이전시 배너(파트너십 문구 + 태그 그래픽)를 보여준다
  campAd?: boolean; // true 면 WHOLEGEN 캠프 광고 배너를 보여준다
  ctaLabel?: string; // 하단 버튼 문구 (기본: 바로가기)
  logo?: string; // 카드 상단 부가설명(eyebrow) 자리에 넣을 로고. 없으면 eyebrow 텍스트를 보여준다
  logoHeight?: number; // 로고 이미지 높이(px). 파일마다 여백 비율이 달라 "LOIND" 글자 높이가 11px 로 같아지게 맞춘 값
  name: string;
  eyebrow: string;
  title: string;
  desc: string;
  image: string;
  to: string;
}

const heroSlides: HeroSlide[] = [
  {
    key: "artisan",
    agent: true,
    logo: "/img/logo-artisan.png",
    logoHeight: 12.1,
    name: "LOIND ARTISAN",
    eyebrow: "제작 스튜디오",
    title: "아티즌",
    desc: "탁월한 전문성으로 함께하는 모든 파트너들과 최고의 파트너십, 결과물을 만들어갑니다",
    image: "/INDEX_CREATIVE AGENCY.png",
    to: "https://artisan.loind.com",
  },
  {
    key: "lodn",
    logo: "/img/logo-lodn.png",
    logoHeight: 12,
    name: "LOIND LODN",
    eyebrow: "브랜드 콘텐츠",
    title: "로든",
    desc: "말씀을 근거로하는 콘텐츠로 인류의 경험을 만들어갑니다",
    image: "/INDEX_STUDIO.png",
    to: "/service",
  },
  {
    key: "rise",
    logo: "/img/logo-rise.png",
    logoHeight: 12,
    name: "LOIND RISE",
    eyebrow: "크리스천 비즈니스",
    title: "라이즈",
    desc: "크리스천이라는 신념 아래 모두의 기쁨이 되기 위한 마땅한 일들을 해나갑니다.",
    image: "/INDEX_DAEHEE.png",
    to: "/rise",
  },
  {
    // 광고 슬라이드: 2027 WHOLEGEN WINTER CAMP (디자인은 캠프 홈페이지 히어로를 따름)
    key: "wholegen",
    campAd: true,
    name: "WHOLEGEN WINTER CAMP",
    eyebrow: "캠프 안내",
    title: "2027 WHOLEGEN WINTER CAMP",
    desc: "2027.01.21—22 · 무박 2일 청소년 캠프 · 세상의 빛 동광교회 (부천)",
    image: "/img/wholegen-art.png",
    logo: "/img/logo-rise.png",
    logoHeight: 12,
    to: "https://wholegencamp.com",
    ctaLabel: "캠프 알아보기",
  },
];
const TOTAL_SLIDES = heroSlides.length;
// 양옆 카드가 이어 보이도록 [마지막 복제, ...원본, 첫번째 복제] 순서로 렌더
const loopSlides = [heroSlides[TOTAL_SLIDES - 1], ...heroSlides, heroSlides[0]];
// 복제 슬라이드(0, TOTAL_SLIDES+1) 바깥의 빈 칸으로는 절대 넘어가지 않게 막는다
const clampIndex = (i: number) => Math.min(Math.max(i, 0), TOTAL_SLIDES + 1);

function SlideLink({ to, className, children }: { to: string; className: string; children: ReactNode }) {
  return to.startsWith("http") ? (
    <a href={to} className={className} target="_blank" rel="noopener noreferrer">{children}</a>
  ) : (
    <Link to={to} className={className}>{children}</Link>
  );
}

type BrandKey = "artisan" | "lodn" | "rise";

interface BrandData {
  desc: ReactNode;
  caption: string;
  image: string;
}

// ※ 아래 설명/태그 문구는 임시 카피입니다 — 확정 카피로 교체해주세요.
const brandShowcaseData: Record<BrandKey, BrandData> = {
  artisan: {
    desc: "탁월한 전문성으로 함께하는 모든 파트너들과 최고의 파트너십, 결과물을 만들어갑니다",
    caption: "아티즌 프로젝트 보기",
    image: "INDEX_CREATIVE AGENCY.png",
  },
  lodn: {
    desc: "말씀을 근거로하는 콘텐츠로 인류의 경험을 만들어갑니다",
    caption: "LODN 프로젝트 보기",
    image: "INDEX_STUDIO.png",
  },
  rise: {
    desc: "크리스천이라는 신념 아래 모두의 기쁨이 되기 위한 마땅한 일들을 해나갑니다.",
    caption: "크리스천 비즈니스 프로젝트 보기",
    image: "INDEX_DAEHEE.png",
  },
};

const brandListItems: { key: BrandKey; label: string }[] = [
  { key: "artisan", label: "제작 스튜디오 : 아티즌" },
  { key: "lodn", label: "브랜드 콘텐츠 : 로든" },
  { key: "rise", label: "크리스천 비즈니스 : 라이즈" },
];

function formatStoryDate(date: Date): string {
  const y = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${y}.${mm}.${dd}`;
}

export default function HomePage() {
  // currentIndex 는 loopSlides 기준 위치(1..TOTAL_SLIDES 가 원본). 0 / TOTAL_SLIDES+1 은 복제본으로,
  // 도달하면 애니메이션 없이 반대편 원본으로 스냅해 무한 루프를 만든다.
  const [currentIndex, setCurrentIndex] = useState(1);
  const [heroAnimate, setHeroAnimate] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gaugeKey, setGaugeKey] = useState(0);
  const [restartSignal, setRestartSignal] = useState(0);
  const [activeBrand, setActiveBrand] = useState<BrandKey>("artisan");
  const [rollingIndex, setRollingIndex] = useState(0);
  // 롤링 문구 폭을 재서 말풍선 폭을 부드럽게 늘이고 줄인다 (auto 폭은 트랜지션이 안 되므로)
  const rollingItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [rollingWidth, setRollingWidth] = useState<number>();

  // 메인페이지 노출 스토리는 어드민에서 선택합니다(최대 3개).
  // 아직 선택된 스토리가 없으면 최신 3개로 대체 노출합니다.
  const { stories: featuredStories } = useStories(3, { homeFeatured: true });
  const { stories: latestStories } = useStories(3);
  const stories = featuredStories.length > 0 ? featuredStories : latestStories;

  // --- Hero carousel auto-advance ---
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setHeroAnimate(true);
      setCurrentIndex((prev) => clampIndex(prev + 1));
      setGaugeKey((k) => k + 1);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isPlaying, restartSignal]);

  // 복제 슬라이드에 도착하면 애니메이션 없이 같은 모양의 원본 슬라이드로 순간이동
  function snapFromClone() {
    if (currentIndex > TOTAL_SLIDES) {
      setHeroAnimate(false);
      setCurrentIndex(1);
    } else if (currentIndex < 1) {
      setHeroAnimate(false);
      setCurrentIndex(TOTAL_SLIDES);
    }
  }

  function handleHeroTransitionEnd(e: ReactTransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    snapFromClone();
  }

  // 백그라운드 탭 등에서 transitionend 가 오지 않아도 복제 슬라이드에 머물지 않도록 보험
  useEffect(() => {
    if (currentIndex >= 1 && currentIndex <= TOTAL_SLIDES) return;
    const id = window.setTimeout(snapFromClone, 800);
    return () => window.clearTimeout(id);
  });

  useEffect(() => {
    if (heroAnimate) return;
    // 스냅된 위치가 먼저 그려진 뒤에 트랜지션을 다시 켜도록 두 프레임 기다린다
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setHeroAnimate(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [heroAnimate]);

  // --- 에이전시 배너 롤링 문구 cross-fade ---
  useEffect(() => {
    const id = window.setInterval(() => {
      setRollingIndex((prev) => (prev + 1) % rollingItems.length);
    }, ROLLING_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const el = rollingItemRefs.current[rollingIndex];
      if (el) setRollingWidth(el.offsetWidth);
    };
    measure();
    // 웹폰트 로딩·반응형 글자 크기 변경 후에도 폭을 다시 잰다
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [rollingIndex]);

  // 수동 이동 시 자동재생 타이머·게이지를 처음부터 다시 시작
  const goTo = (index: number) => {
    setHeroAnimate(true);
    setCurrentIndex(clampIndex(index));
    setGaugeKey((k) => k + 1);
    if (isPlaying) setRestartSignal((s) => s + 1);
  };

  const handlePauseToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const activeBrandData = brandShowcaseData[activeBrand];
  const activeDot = (((currentIndex - 1) % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES;

  const agentBannerInner = (
    <>
      <div className={styles["hero-content"]}>
        <img
          className={`${styles["service-tag"]} ${styles["card-logo"]}`}
          src={heroSlides[0].logo}
          alt={heroSlides[0].name}
          style={{ height: heroSlides[0].logoHeight }}
        />
        <h1 className={styles["hero-title"]}>어떤 파트너십이 필요하세요?</h1>

        <div className={styles["search-bubble"]}>
          <span>✨</span>
          <div className={styles["rolling-wrapper"]} style={{ width: rollingWidth }}>
            {rollingItems.map((text, i) => (
              <div
                key={text}
                ref={(el) => {
                  rollingItemRefs.current[i] = el;
                }}
                className={`${styles["rolling-item"]} ${i === rollingIndex ? styles.active : ""}`}
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 오른쪽: 실제 작업 이미지 3장을 겹친 카드 묶음. 맨 앞 카드는 지금 롤링 문구의 작업 */}
      <div className={styles["work-stack"]} aria-hidden="true">
        {[2, 1, 0].map((offset) => {
          const idx = (rollingIndex + offset) % rollingImages.length;
          return (
            <div key={offset} className={`${styles["work-card"]} ${styles[`work-card-${offset}`]}`}>
              <img key={idx} src={rollingImages[idx]} alt="" />
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      <section className={styles["hero-section"]}>
        <div className={styles["hero-panel"]}>
          <div className={styles["hero-viewport"]}>
            <div
              className={`${styles["hero-track"]} ${heroAnimate ? "" : styles["no-anim"]}`}
              style={{
                transform: `translateX(calc(var(--hero-offset) - ${currentIndex} * (var(--hero-slide-w) + var(--hero-gap))))`,
              }}
              onTransitionEnd={handleHeroTransitionEnd}
            >
              {loopSlides.map((slide, i) => (
                <div
                  key={`${slide.key}-${i}`}
                  className={`${styles["hero-slide"]} ${i === currentIndex ? styles.current : ""}`}
                  aria-hidden={i !== currentIndex}
                >
                  {slide.agent ? (
                    <div className={`${styles["hero-card"]} ${styles["hero-card-agent"]}`}>
                      {agentBannerInner}
                    </div>
                  ) : slide.campAd ? (
                    <div className={`${styles["hero-card"]} ${styles["hero-card-camp"]}`}>
                      <div className={styles["camp-bg"]} aria-hidden="true" />
                      <div className={styles["camp-figure"]} aria-hidden="true" />
                      <div className={styles["camp-main"]}>
                        {slide.logo && (
                          <img
                            className={`${styles["card-logo"]} ${styles["camp-logo"]}`}
                            src={slide.logo}
                            alt="LOIND RISE"
                            style={{ height: slide.logoHeight }}
                          />
                        )}
                        <h2 className={styles["camp-wordmark"]} aria-label={slide.title}>
                          <span className={styles["camp-w1"]} aria-hidden="true">WHOLEGEN</span>
                          <span className={styles["camp-w2"]} aria-hidden="true">
                            <i className={styles["camp-step"]} />
                            WINTER
                          </span>
                          <span className={styles["camp-w3"]} aria-hidden="true">CAMP</span>
                        </h2>
                        <p className={styles["camp-date"]}>2027.01.21—22</p>
                        <p className={styles["camp-place"]}>
                          <mark className={styles["camp-hl"]}>무박 2일 청소년 캠프</mark> · 세상의 빛 동광교회 (부천)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles["hero-card"]}>
                      <div className={styles["hero-card-image"]}>
                        <img src={slide.image} alt={slide.title} />
                      </div>
                      <div className={styles["hero-card-body"]}>
                        {slide.logo ? (
                          <img
                            className={styles["card-logo"]}
                            src={slide.logo}
                            alt={slide.name}
                            style={{ height: slide.logoHeight }}
                          />
                        ) : (
                          <span className={styles["hero-card-eyebrow"]}>{slide.eyebrow}</span>
                        )}
                        <h2 className={styles["hero-card-title"]}>{slide.title}</h2>
                        <p className={styles["hero-card-desc"]}>{slide.desc}</p>
                      </div>
                    </div>
                  )}

                  <SlideLink to={slide.to} className={styles["hero-cta"]}>
                    {slide.ctaLabel ?? "바로가기"}
                  </SlideLink>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={`${styles["hero-arrow"]} ${styles.prev}`}
              aria-label="이전 브랜드"
              onClick={() => goTo(currentIndex - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles["hero-arrow"]} ${styles.next}`}
              aria-label="다음 브랜드"
              onClick={() => goTo(currentIndex + 1)}
            >
              ›
            </button>
          </div>

          <div className={styles["banner-controls"]}>
            <div className={`${styles["control-dots"]} ${!isPlaying ? styles.paused : ""}`}>
              {heroSlides.map((slide, i) => (
                <span
                  key={i === activeDot ? `active-${i}-${gaugeKey}` : `dot-${i}`}
                  className={i === activeDot ? styles.active : ""}
                  onClick={() => goTo(i + 1)}
                  aria-label={slide.title}
                ></span>
              ))}
            </div>
            <div className={styles["control-pause"]} onClick={handlePauseToggle}>
              {isPlaying ? "||" : "▶"}
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
                  to={`/story?story=${story.id}`}
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
                        {displayCategory(story.category)}
                      </span>
                      <p className={styles["story-date"]}>{dateText}</p>
                    </div>
                    <h3 className={styles["story-title"]}>{story.title}</h3>
                    <p className={styles["story-desc"]}>{story.text}</p>
                    <div className={styles["story-footer"]}>
                      <div className={styles["story-tags"]}>
                        <span className={styles["story-tag-item"]}>
                          {displayCategory(story.category)}
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
