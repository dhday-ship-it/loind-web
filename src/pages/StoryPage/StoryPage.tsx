import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  PointerEvent as ReactPointerEvent,
  TransitionEvent as ReactTransitionEvent,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageAlbum from "../../components/ImageAlbum/ImageAlbum";
import { useStories } from "../../hooks/useStories";
import { getStoryImages, type Story } from "../../types/story";
import styles from "./StoryPage.module.css";

const CATEGORIES = ["Creative Agency", "Creative Studio: LODN", "Impact"];
const PAGE_SIZE = 3;
const FEATURED_SLIDE_INTERVAL_MS = 5000;

function formatDate(isoDate: string | undefined): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const y = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}.${MM}.${dd}`;
}

export default function StoryPage() {
  const { stories, loading, error } = useStories();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredAnimate, setFeaturedAnimate] = useState(true);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const draggedRef = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const recommendedStories = stories.filter((s) => s.is_recommended);
  // 상단 배너는 추천소식(is_recommended) 목록으로 채웁니다. 없으면 최신 3개로 대체.
  const bannerList =
    recommendedStories.length > 0 ? recommendedStories : stories.slice(0, 3);
  const recommendList = recommendedStories.slice(0, 5);

  const storyData = useMemo(() => {
    const grouped: Record<string, Story[]> = {};
    stories.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  }, [stories]);

  const currentList = storyData[activeCategory] || [];
  const totalPages = Math.max(1, Math.ceil(currentList.length / PAGE_SIZE));
  const pagedList = currentList.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const openStory = openStoryId
    ? (stories.find((s) => s.id === openStoryId) ?? null)
    : null;

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const bannerCount = bannerList.length;
  // 맨 앞 슬라이드 복제본을 끝에 붙여 정방향으로 무한 순환시킨다.
  const bannerSlides =
    bannerCount > 1 ? [...bannerList, bannerList[0]] : bannerList;

  useEffect(() => {
    setFeaturedIndex(0);
    setFeaturedAnimate(true);
  }, [bannerCount]);

  useEffect(() => {
    if (bannerCount <= 1 || isDragging) return;
    const id = window.setInterval(() => {
      setFeaturedAnimate(true);
      setFeaturedIndex((prev) => prev + 1);
    }, FEATURED_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [bannerCount, isDragging]);

  // 복제 슬라이드에 도달하면 트랜지션 없이 첫 슬라이드로 스냅.
  function handleBannerTransitionEnd(e: ReactTransitionEvent<HTMLDivElement>) {
    if (e.propertyName !== "transform") return;
    if (featuredIndex >= bannerSlides.length - 1) {
      setFeaturedAnimate(false);
      setFeaturedIndex(0);
    }
  }

  useEffect(() => {
    if (featuredAnimate) return;
    const raf = requestAnimationFrame(() => setFeaturedAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [featuredAnimate]);

  // 탭(클릭)과 드래그 구분: 이동 거리가 DRAG_THRESHOLD_PX 를 넘으면 드래그로 간주.
  const DRAG_THRESHOLD_PX = 8;

  function handleBannerPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragStartX.current = e.clientX;
    draggedRef.current = false;
    if (bannerCount > 1) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }

  function handleBannerPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (!draggedRef.current && Math.abs(delta) > DRAG_THRESHOLD_PX) {
      draggedRef.current = true;
      setIsDragging(true);
    }
    if (draggedRef.current && bannerCount > 1) setDragDelta(delta);
  }

  function handleBannerPointerUp() {
    if (dragStartX.current === null) return;
    dragStartX.current = null;

    // 드래그가 아니면 탭 → 현재 슬라이드 자세히보기로 이동
    if (!draggedRef.current) {
      const story = bannerList[featuredIndex % bannerCount];
      if (story) navigate(`/story/${story.id}`);
      return;
    }

    const width = sliderRef.current?.offsetWidth ?? 1;
    const threshold = Math.min(120, width * 0.15);
    let next = featuredIndex;
    if (dragDelta <= -threshold)
      next = Math.min(featuredIndex + 1, bannerSlides.length - 1);
    else if (dragDelta >= threshold) next = Math.max(featuredIndex - 1, 0);
    setFeaturedAnimate(true);
    setFeaturedIndex(next);
    setDragDelta(0);
    setIsDragging(false);
  }

  function handleBannerPointerCancel() {
    dragStartX.current = null;
    draggedRef.current = false;
    setDragDelta(0);
    setIsDragging(false);
  }

  function openModal(story: Story) {
    setOpenStoryId(story.id);
    if (searchParams.has("story") && searchParams.get("story") !== story.id) {
      searchParams.delete("story");
      setSearchParams(searchParams, { replace: true });
    }
  }

  const closeModal = useCallback(() => {
    setOpenStoryId(null);
    if (searchParams.has("story")) {
      searchParams.delete("story");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // 메인페이지 등에서 ?story=<id> 로 들어오면 해당 스토리 팝업을 자동으로 엽니다.
  useEffect(() => {
    const targetId = searchParams.get("story");
    if (!targetId || loading) return;
    const target = stories.find((s) => s.id === targetId);
    if (target) {
      setOpenStoryId(target.id);
    }
  }, [searchParams, stories, loading]);

  useEffect(() => {
    if (!openStoryId) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openStoryId, closeModal]);

  return (
    <>
      {bannerCount > 0 && (
        <section className={styles["featured-section"]}>
          <div className="container">
            <div className={styles["featured-slider"]} ref={sliderRef}>
              <div
                className={`${styles["featured-track"]} ${
                  isDragging ? styles.dragging : ""
                }`}
                style={{
                  transform: `translateX(calc(${-featuredIndex * 100}% + ${dragDelta}px))`,
                  transition: isDragging || !featuredAnimate ? "none" : undefined,
                }}
                onPointerDown={handleBannerPointerDown}
                onPointerMove={handleBannerPointerMove}
                onPointerUp={handleBannerPointerUp}
                onPointerCancel={handleBannerPointerCancel}
                onTransitionEnd={handleBannerTransitionEnd}
              >
                {bannerSlides.map((story, idx) => (
                  <div
                    key={`${story.id}-${idx}`}
                    className={styles["featured-slide"]}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(`/story/${story.id}`);
                    }}
                  >
                    <img
                      src={story.img}
                      alt={story.title}
                      draggable={false}
                    />
                    <div className={styles["featured-overlay"]}>
                      <h3>{story.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {bannerCount > 1 && (
              <div className={styles["featured-dots"]}>
                {bannerList.map((story, i) => (
                  <span
                    key={story.id}
                    className={
                      i === featuredIndex % bannerCount
                        ? styles.active
                        : undefined
                    }
                    onClick={() => {
                      setFeaturedAnimate(true);
                      setFeaturedIndex(i);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="container">
        <div className={styles["filter-section"]}>
          <ul className={styles.sub}>
            {CATEGORIES.map((cat) => (
              <li
                key={cat}
                className={cat === activeCategory ? styles.on : undefined}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container">
        <div className={styles["layout-grid"]}>
          <div className={styles["story-list-col"]}>
            <ul className={styles["story-board"]}>
              {loading ? (
                <li className={styles.empty}>데이터를 불러오는 중...</li>
              ) : error ? (
                <li className={styles.empty}>서버 연결 오류가 발생했습니다.</li>
              ) : currentList.length === 0 ? (
                <li className={styles.empty}>
                  '{activeCategory}' 카테고리에 등록된 스토리가 없습니다.
                </li>
              ) : (
                pagedList.map((item) => (
                  <li key={item.id} onClick={() => openModal(item)}>
                    <div className={styles["list-txt"]}>
                      <p className={styles["list-date"]}>
                        {formatDate(item.created_at)}
                      </p>
                      <h4>{item.title}</h4>
                    </div>
                    <div className={styles["list-img"]}>
                      <img src={item.img} alt={item.title} loading="lazy" />
                    </div>
                  </li>
                ))
              )}
            </ul>
            {!loading && !error && totalPages > 1 && (
              <nav className={styles.pagination}>
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    className={page === i + 1 ? styles.active : undefined}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  ›
                </button>
              </nav>
            )}
          </div>
          <aside className={styles.sidebar}>
            <div className={styles["side-box"]}>
              <p className={styles["side-title"]}>추천 소식</p>
              <ul className={styles["recommend-list"]}>
                {recommendList.map((item) => (
                  <li key={item.id} onClick={() => openModal(item)}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div
        className={`${styles["modal_overlay"]} ${openStory ? styles.active : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className={styles["modal_content"]}>
          {openStory && (
            <div className={styles["modal_body"]}>
              <div className={styles["modal-album"]}>
                <ImageAlbum
                  images={getStoryImages(openStory)}
                  alt={openStory.title}
                  href={openStory.link}
                  size="modal"
                />
              </div>
              <h2>{openStory.title}</h2>
              {openStory.text && (
                <p className={styles["modal-lead"]}>{openStory.text}</p>
              )}
              {openStory.summary && (
                <div className={styles["modal-section"]}>
                  <p style={{ color: "#444", lineHeight: 1.8, fontSize: "14px" }}>
                    {openStory.summary.split("\n").map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              )}
              <div className={styles["modal-actions"]}>
                <button
                  type="button"
                  className={styles["modal-detail-btn"]}
                  onClick={() => {
                    closeModal();
                    navigate(`/story/${openStory.id}`);
                  }}
                >
                  자세히보기 →
                </button>
                {openStory.link && (
                  <a
                    href={openStory.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles["modal-link-btn"]}
                  >
                    프로젝트 바로가기 →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
