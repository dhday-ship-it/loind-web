import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ImageAlbum from "../../components/ImageAlbum/ImageAlbum";
import { useStories } from "../../hooks/useStories";
import { getStoryImages } from "../../types/story";
import styles from "./StoryDetailPage.module.css";

function formatDate(isoDate: string | undefined): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const y = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}.${MM}.${dd}`;
}

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { stories, loading, error } = useStories();
  const story = stories.find((s) => s.id === id) ?? null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  return (
    <div className="container">
      <div className={styles.wrap}>
        <Link to="/story" className={styles.back}>
          ← 스토리 목록으로
        </Link>

        {loading ? (
          <p className={styles.state}>불러오는 중...</p>
        ) : error ? (
          <p className={styles.state}>서버 연결 오류가 발생했습니다.</p>
        ) : !story ? (
          <p className={styles.state}>스토리를 찾을 수 없습니다.</p>
        ) : (
          <article className={styles.article}>
            <div className={styles.meta}>
              <span className={styles.cat}>{story.category}</span>
              <span className={styles.date}>
                {formatDate(story.created_at)}
              </span>
            </div>
            <h1 className={styles.title}>{story.title}</h1>
            {story.text && <p className={styles.lead}>{story.text}</p>}

            <div className={styles.album}>
              <ImageAlbum
                images={getStoryImages(story)}
                alt={story.title}
                size="page"
              />
            </div>

            <div className={styles.body}>
              {story.detail || "등록된 상세 내용이 없습니다."}
            </div>

            {story.link && (
              <a
                href={story.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkBtn}
              >
                프로젝트 바로가기 →
              </a>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
