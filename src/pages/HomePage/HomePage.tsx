import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
  type TransitionEvent as ReactTransitionEvent,
} from "react";
import { Link } from "react-router-dom";
import { useStories } from "../../hooks/useStories";
import { displayCategory } from "../../types/story";
import styles from "./HomePage.module.css";

// 한 슬라이드에 머무는 시간. 아티즌 슬라이드는 카테고리 4개가 한 번씩 다 나오도록 더 길게 (slideDuration 참고)
// 게이지 길이는 각 슬라이드 시간에 맞춰 자동으로 바뀐다 (--gauge-ms)
const SLIDE_INTERVAL_MS = 9000;
const ROLLING_INTERVAL_MS = 3000;

// 아티즌 카드: 4개 카테고리 대표 작업. image 는 큰 사진(가로형), thumb 는 동그란 썸네일용 정사각형
const artisanWorks = [
  { label: "영상 프로덕션", image: "/img/orbs/promo-wide.jpg", thumb: "/img/orbs/promo.jpg" },
  { label: "디자인", sub: "(+납품 서비스)", image: "/img/design-promo-items.jpg", thumb: "/img/orbs/goods.jpg" },
  { label: "IT개발", image: "/img/orbs/web-wholegen-wide.jpg", thumb: "/img/orbs/web-wholegen.jpg" },
  { label: "온·오프 세미나", image: "/img/seminar-offline.jpg", thumb: "/img/orbs/seminar.jpg" },
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
  to: string; // 바로가기: 브랜드 홈페이지 (http 로 시작하면 새 탭)
}

// ※ 아래 설명/태그 문구는 임시 카피입니다 — 확정 카피로 교체해주세요.
const brandShowcaseData: Record<BrandKey, BrandData> = {
  artisan: {
    desc: "탁월한 전문성으로 함께하는 모든 파트너들과 최고의 파트너십, 결과물을 만들어갑니다",
    caption: "아티즌 프로젝트 보기",
    image: "INDEX_CREATIVE AGENCY.png",
    to: "https://artisan.loind.com",
  },
  lodn: {
    desc: "말씀을 근거로하는 콘텐츠로 인류의 경험을 만들어갑니다",
    caption: "LODN 프로젝트 보기",
    image: "INDEX_STUDIO.png",
    // TODO: 로든 홈페이지 주소가 정해지면 교체
    to: "/service",
  },
  rise: {
    desc: "크리스천이라는 신념 아래 모두의 기쁨이 되기 위한 마땅한 일들을 해나갑니다.",
    caption: "크리스천 비즈니스 프로젝트 보기",
    image: "INDEX_DAEHEE.png",
    // TODO: 라이즈 홈페이지 주소가 정해지면 교체
    to: "/rise",
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

  // 메인페이지 노출 스토리는 어드민에서 선택합니다(최대 3개).
  // 아직 선택된 스토리가 없으면 최신 3개로 대체 노출합니다.
  const { stories: featuredStories } = useStories(3, { homeFeatured: true });
  const { stories: latestStories } = useStories(3);
  const stories = featuredStories.length > 0 ? featuredStories : latestStories;

  // --- Hero carousel auto-advance ---
  // 슬라이드마다 머무는 시간이 다를 수 있어 interval 대신 매번 timeout 을 건다
  const slideIndex = (((currentIndex - 1) % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES;
  const isArtisanSlide = !!heroSlides[slideIndex].agent;
  const slideDuration = isArtisanSlide ? ROLLING_INTERVAL_MS * artisanWorks.length : SLIDE_INTERVAL_MS;
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setTimeout(() => {
      setHeroAnimate(true);
      setCurrentIndex((prev) => clampIndex(prev + 1));
      setGaugeKey((k) => k + 1);
    }, slideDuration);
    return () => window.clearTimeout(id);
    // gaugeKey: 다음 슬라이드로 넘어가거나 직접 이동할 때마다 새로 시작
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, restartSignal, gaugeKey]);

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

  // --- 아티즌 카테고리 순환 ---
  // 아티즌 슬라이드에 들어올 때마다 첫 카테고리부터 시작해서, 넘어가기 전까지 4개가 한 번씩 다 나온다
  useEffect(() => {
    if (!isArtisanSlide) return;
    setRollingIndex(0);
    const id = window.setInterval(() => {
      setRollingIndex((prev) => (prev + 1) % artisanWorks.length);
    }, ROLLING_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isArtisanSlide, gaugeKey]);

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
      {/* 왼쪽: 지금 작업을 담은 큰 원 */}
      <div className={styles["dish-wrap"]}>
        <div className={styles["dish"]} aria-hidden="true">
          {artisanWorks.map((w, i) => (
            <img key={w.image} src={w.image} alt="" className={i === rollingIndex ? styles["dish-on"] : ""} />
          ))}
        </div>
      </div>

      {/* 오른쪽: 로고 + 두 줄 제목 + 카테고리 썸네일 */}
      <div className={styles["hero-content"]}>
        <img
          className={`${styles["service-tag"]} ${styles["card-logo"]}`}
          src={heroSlides[0].logo}
          alt={heroSlides[0].name}
          style={{ height: heroSlides[0].logoHeight }}
        />
        <h1 className={styles["dish-title"]}>어떤 파트너십이 필요하세요?</h1>
        {/* 카테고리 썸네일 (누르면 큰 원이 바뀜) */}
        <div className={styles["dish-thumbs"]}>
          {artisanWorks.map((w, i) => (
            <button
              key={w.image}
              type="button"
              className={`${styles["dish-thumb"]} ${i === rollingIndex ? styles["dish-thumb-on"] : ""}`}
              onClick={() => setRollingIndex(i)}
            >
              <img src={w.thumb} alt="" />
              <span>{w.label}</span>
              {"sub" in w && <small className={styles["dish-thumb-sub"]}>{w.sub}</small>}
            </button>
          ))}
        </div>
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
                  style={i === activeDot ? ({ "--gauge-ms": `${slideDuration}ms` } as CSSProperties) : undefined}
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
              <SlideLink to={activeBrandData.to} className={styles["brand-detail-image"]}>
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
              </SlideLink>
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
