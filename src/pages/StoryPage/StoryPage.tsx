import { useEffect, useMemo, useState } from "react";
import { useStories } from "../../hooks/useStories";
import type { Story } from "../../types/story";
import styles from "./StoryPage.module.css";

const CATEGORIES = ["Creative Agency", "Creative Studio: LODN", "Impact"];
const PAGE_SIZE = 3;
const FEATURED_SLIDE_INTERVAL_MS = 5000;

type ModalTab = "brief" | "detail";

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
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<ModalTab>("brief");
  const [page, setPage] = useState(1);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredTransition, setFeaturedTransition] = useState(true);

  const featuredList = stories.slice(0, 3);
  // Append a clone of the first slide so the loop can always advance forward
  // instead of sliding backward when wrapping from the last slide to the first.
  const featuredSlides =
    featuredList.length > 1 ? [...featuredList, featuredList[0]] : featuredList;
  const recommendList = stories.filter((s) => s.is_recommended).slice(0, 5);

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

  useEffect(() => {
    setFeaturedIndex(0);
    setFeaturedTransition(true);
  }, [featuredList.length]);

  useEffect(() => {
    if (featuredList.length <= 1) return;
    const id = window.setInterval(() => {
      setFeaturedTransition(true);
      setFeaturedIndex((prev) => prev + 1);
    }, FEATURED_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [featuredList.length]);

  // After sliding onto the appended clone slide, snap back to the real first
  // slide with the transition disabled so the jump is invisible.
  function handleFeaturedTransitionEnd() {
    if (featuredIndex === featuredSlides.length - 1) {
      setFeaturedTransition(false);
      setFeaturedIndex(0);
    }
  }

  useEffect(() => {
    if (featuredTransition) return;
    const raf = requestAnimationFrame(() => setFeaturedTransition(true));
    return () => cancelAnimationFrame(raf);
  }, [featuredTransition]);

  function openModal(story: Story) {
    setOpenStoryId(story.id);
    setModalTab("brief");
  }

  function closeModal() {
    setOpenStoryId(null);
  }

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
  }, [openStoryId]);

  return (
    <>
      <section className={styles["featured-section"]}>
        <div className="container">
          <div className={styles["featured-slider"]}>
            <div
              className={styles["featured-slider-track"]}
              style={{
                transform: `translateX(-${featuredIndex * 100}%)`,
                transition: featuredTransition
                  ? undefined
                  : "none",
              }}
              onTransitionEnd={(e) => {
                if (e.propertyName === "transform") {
                  handleFeaturedTransitionEnd();
                }
              }}
            >
              {featuredSlides.map((story, i) => (
                <div
                  key={`${story.id}-${i}`}
                  className={styles["featured-grid"]}
                  onClick={() => openModal(story)}
                >
                  <div className={styles["featured-img-box"]}>
                    <img src={story.img} alt={story.title} />
                  </div>
                  <div className={styles["featured-txt-box"]}>
                    <p className={styles["featured-date"]}>
                      {formatDate(story.created_at)}
                    </p>
                    <h3 className={styles["featured-title"]}>
                      {story.title}
                    </h3>
                    <p className={styles["featured-desc"]}>
                      {story.text || ""}
                    </p>
                    <div className={styles["view-featured-detail"]}>
                      스토리 보기 →
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {featuredList.length > 1 && (
              <div className={styles["featured-dots"]}>
                {featuredList.map((story, i) => (
                  <span
                    key={story.id}
                    className={
                      i === featuredIndex % featuredList.length
                        ? styles.active
                        : undefined
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeaturedTransition(true);
                      setFeaturedIndex(i);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

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
              {openStory.link ? (
                <a
                  href={openStory.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles["modal-img-link"]}
                >
                  <img src={openStory.img} alt={openStory.title} />
                </a>
              ) : (
                <img src={openStory.img} alt={openStory.title} />
              )}
              <h2>{openStory.title}</h2>
              {openStory.text && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#777",
                    marginTop: "8px",
                    lineHeight: 1.6,
                  }}
                >
                  {openStory.text}
                </p>
              )}
              <div className={styles["modal-view-btns"]}>
                <button
                  type="button"
                  className={`${styles["modal-view-btn"]} ${modalTab === "brief" ? styles.active : ""}`}
                  onClick={() => setModalTab("brief")}
                >
                  간략보기
                </button>
                <button
                  type="button"
                  className={`${styles["modal-view-btn"]} ${modalTab === "detail" ? styles.active : ""}`}
                  onClick={() => setModalTab("detail")}
                >
                  자세히보기
                </button>
              </div>
              <div
                className={`${styles["modal-section"]} ${modalTab === "brief" ? styles.visible : ""}`}
              >
                {openStory.summary && (
                  <p style={{ color: "#444", lineHeight: 1.8, fontSize: "14px" }}>
                    {openStory.summary.split("\n").map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                )}
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
              <div
                className={`${styles["modal-section"]} ${modalTab === "detail" ? styles.visible : ""}`}
              >
                <p style={{ color: "#444", lineHeight: 1.8, fontSize: "14px" }}>
                  {openStory.detail
                    ? openStory.detail.split("\n").map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))
                    : "내용이 없습니다."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
