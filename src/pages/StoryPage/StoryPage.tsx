import { useEffect, useMemo, useState } from "react";
import type { Timestamp } from "firebase/firestore";
import { useStories } from "../../hooks/useStories";
import type { Story } from "../../types/story";
import styles from "./StoryPage.module.css";

const CATEGORIES = ["Creative Agency", "Creative Studio: LODN", "Impact"];

type ModalTab = "brief" | "detail";

function formatDate(ts: Timestamp | undefined): string {
  if (!ts) return "";
  const d = ts.toDate();
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

  const featured = stories.length ? stories[0] : null;
  const recommendList = stories.slice(0, 4);

  const storyData = useMemo(() => {
    const grouped: Record<string, Story[]> = {};
    stories.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  }, [stories]);

  const currentList = storyData[activeCategory] || [];
  const openStory = openStoryId
    ? (stories.find((s) => s.id === openStoryId) ?? null)
    : null;

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
          <div className={styles["featured-grid"]}>
            {featured && (
              <>
                <div className={styles["featured-img-box"]}>
                  <img src={featured.img} alt={featured.title} />
                </div>
                <div className={styles["featured-txt-box"]}>
                  <p className={styles["featured-date"]}>
                    {formatDate(featured.createdAt)}
                  </p>
                  <h3 className={styles["featured-title"]}>
                    {featured.title}
                  </h3>
                  <p className={styles["featured-desc"]}>
                    {featured.text || ""}
                  </p>
                  <div
                    className={styles["view-featured-detail"]}
                    onClick={() => openModal(featured)}
                  >
                    스토리 보기 →
                  </div>
                </div>
              </>
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
              currentList.map((item) => (
                <li key={item.id} onClick={() => openModal(item)}>
                  <div className={styles["list-txt"]}>
                    <p className={styles["list-date"]}>
                      {formatDate(item.createdAt)}
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
