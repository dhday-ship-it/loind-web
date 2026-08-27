import { useEffect, useState } from "react";
import styles from "./ImageAlbum.module.css";

interface ImageAlbumProps {
  images: string[];
  alt: string;
  /** 이미지가 1장이고 href가 있으면 이미지를 링크로 감쌉니다. */
  href?: string;
  /** modal: 팝업용(높이 제한 작음) / page: 상세 페이지용(크게) */
  size?: "modal" | "page";
}

export default function ImageAlbum({
  images,
  alt,
  href,
  size = "modal",
}: ImageAlbumProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  if (images.length === 0) return null;

  const safeIndex = Math.min(index, images.length - 1);
  const multiple = images.length > 1;
  const img = (
    <img
      src={images[safeIndex]}
      alt={alt}
      className={styles.img}
      loading="lazy"
    />
  );

  return (
    <div className={`${styles.album} ${styles[size]}`}>
      {href && !multiple ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {img}
        </a>
      ) : (
        img
      )}

      {multiple && (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={() =>
              setIndex((i) => (i - 1 + images.length) % images.length)
            }
            aria-label="이전 이미지"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            aria-label="다음 이미지"
          >
            ›
          </button>
          <span className={styles.count}>
            {safeIndex + 1} / {images.length}
          </span>
          <div className={styles.dots}>
            {images.map((src, i) => (
              <span
                key={src + i}
                className={i === safeIndex ? styles.active : undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
