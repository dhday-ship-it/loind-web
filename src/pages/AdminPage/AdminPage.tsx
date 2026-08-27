import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabase";
import {
  getStoryImages,
  type Story,
  type StoryPayload,
} from "../../types/story";
import styles from "./AdminPage.module.css";

const CATEGORY_OPTIONS = [
  "Creative Agency",
  "Creative Studio: LODN",
  "Impact",
];

type AdminView = "list" | "new" | "order";

const VIEW_META: Record<AdminView, { title: string; sub: string }> = {
  list: { title: "Stories.", sub: "등록된 스토리 관리" },
  new: { title: "New Story.", sub: "새 스토리 작성" },
  order: { title: "Home Order.", sub: "메인페이지 노출 순서" },
};

function AdminPage() {
  const navigate = useNavigate();

  // Login state
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // 어드민 화면 전환 (기본: 스토리 목록)
  const [view, setView] = useState<AdminView>("list");

  // Archive list state
  const [stories, setStories] = useState<Story[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [archiveCategory, setArchiveCategory] = useState<string>("ALL");
  const [archivePage, setArchivePage] = useState(1);
  const ARCHIVE_PAGE_SIZE = 6;

  // Form state
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [title, setTitle] = useState("");
  // 이미지 앨범: 이미 확정된 URL 목록 + 업로드 대기 중인 파일 목록
  const [images, setImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [imgUrl, setImgUrl] = useState("");
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [isHomeFeatured, setIsHomeFeatured] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("PUBLISH STORY");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const HOME_FEATURED_LIMIT = 3;
  const homeFeaturedCount = stories.filter((s) => s.is_home_featured).length;

  // 메인페이지 노출 순서대로 정렬된 목록
  const featuredOrdered = [...stories]
    .filter((s) => s.is_home_featured)
    .sort(
      (a, b) =>
        a.home_order - b.home_order ||
        (a.created_at < b.created_at ? 1 : -1),
    );

  // Archive 목록 필터/페이지네이션
  const filteredStories =
    archiveCategory === "ALL"
      ? stories
      : stories.filter((s) => s.category === archiveCategory);
  const archiveTotalPages = Math.max(
    1,
    Math.ceil(filteredStories.length / ARCHIVE_PAGE_SIZE),
  );
  const safeArchivePage = Math.min(archivePage, archiveTotalPages);
  const pagedStories = filteredStories.slice(
    (safeArchivePage - 1) * ARCHIVE_PAGE_SIZE,
    safeArchivePage * ARCHIVE_PAGE_SIZE,
  );

  useEffect(() => {
    setArchivePage(1);
  }, [archiveCategory]);

  const fetchStories = useCallback(async (): Promise<void> => {
    setListLoading(true);
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setStories((data ?? []) as Story[]);
    setListLoading(false);
  }, []);

  const handleLogin = async (): Promise<void> => {
    if (!password) {
      setLoginError("비밀번호를 입력하세요.");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: "dhday@loind.com",
      password,
    });
    if (!error) {
      setLoggedIn(true);
      fetchStories();
    } else {
      setLoginError("비밀번호가 올바르지 않습니다.");
      setLoginLoading(false);
      setPassword("");
      passwordInputRef.current?.focus();
    }
  };

  const handlePasswordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length) {
      setPendingFiles((prev) => [...prev, ...selected]);
    }
    e.target.value = "";
  };

  const handleAddImageUrl = () => {
    const url = imgUrl.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setImgUrl("");
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    setImages((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!title) {
      alert("제목을 입력하세요.");
      return;
    }
    if (isHomeFeatured) {
      const alreadyFeatured = editId
        ? (stories.find((s) => s.id === editId)?.is_home_featured ?? false)
        : false;
      if (!alreadyFeatured && homeFeaturedCount >= HOME_FEATURED_LIMIT) {
        alert(
          `메인페이지 노출 스토리는 최대 ${HOME_FEATURED_LIMIT}개까지 선택할 수 있습니다. 다른 스토리를 먼저 해제하세요.`,
        );
        return;
      }
    }
    if (images.length === 0 && pendingFiles.length === 0) {
      alert("이미지를 한 장 이상 등록하세요.");
      return;
    }
    setSubmitting(true);
    setSubmitLabel("PUBLISHING...");
    try {
      const uploadedUrls: string[] = [];
      for (const f of pendingFiles) {
        const ext = f.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("story-images")
          .upload(path, f);
        if (uploadError) throw uploadError;
        uploadedUrls.push(
          supabase.storage.from("story-images").getPublicUrl(path).data
            .publicUrl,
        );
      }
      const finalImages = [...images, ...uploadedUrls];
      const existing = editId
        ? stories.find((s) => s.id === editId)
        : undefined;
      let homeOrder = existing?.home_order ?? 0;
      if (isHomeFeatured && !existing?.is_home_featured) {
        const maxOrder = stories
          .filter((s) => s.is_home_featured)
          .reduce((m, s) => Math.max(m, s.home_order), 0);
        homeOrder = maxOrder + 1;
      }
      const payload: StoryPayload = {
        category,
        title,
        img: finalImages[0] ?? "",
        images: finalImages,
        text,
        summary,
        detail,
        link,
        is_recommended: isRecommended,
        is_home_featured: isHomeFeatured,
        home_order: homeOrder,
      };
      const { error } = editId
        ? await supabase.from("stories").update(payload).eq("id", editId)
        : await supabase.from("stories").insert(payload);
      if (error) throw error;
      await fetchStories();
      resetForm();
      setView("list");
      window.scrollTo({ top: 0 });
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCategory(CATEGORY_OPTIONS[0]);
    setTitle("");
    setImages([]);
    setPendingFiles([]);
    setImgUrl("");
    setText("");
    setLink("");
    setSummary("");
    setDetail("");
    setIsRecommended(false);
    setIsHomeFeatured(false);
    setEditId(null);
    setSubmitting(false);
    setSubmitLabel("PUBLISH STORY");
  };

  const startNewStory = () => {
    resetForm();
    setView("new");
    window.scrollTo({ top: 0 });
  };

  const handleEdit = (story: Story) => {
    setCategory(story.category);
    setTitle(story.title);
    setImages(getStoryImages(story));
    setPendingFiles([]);
    setImgUrl("");
    setText(story.text);
    setLink(story.link || "");
    setSummary(story.summary || "");
    setDetail(story.detail);
    setIsRecommended(story.is_recommended);
    setIsHomeFeatured(story.is_home_featured);
    setEditId(story.id);
    setSubmitLabel("UPDATE STORY");
    setView("new");
    window.scrollTo({ top: 0 });
  };

  const handleToggleHomeFeatured = async (story: Story): Promise<void> => {
    const next = !story.is_home_featured;
    if (next && homeFeaturedCount >= HOME_FEATURED_LIMIT) {
      alert(
        `메인페이지 노출 스토리는 최대 ${HOME_FEATURED_LIMIT}개까지 선택할 수 있습니다. 다른 스토리를 먼저 해제하세요.`,
      );
      return;
    }
    const patch: { is_home_featured: boolean; home_order?: number } = {
      is_home_featured: next,
    };
    if (next) {
      const maxOrder = stories
        .filter((s) => s.is_home_featured)
        .reduce((m, s) => Math.max(m, s.home_order), 0);
      patch.home_order = maxOrder + 1;
    }
    const { error } = await supabase
      .from("stories")
      .update(patch)
      .eq("id", story.id);
    if (error) {
      alert(error.message);
      return;
    }
    fetchStories();
  };

  // 메인페이지 노출 순서 변경 — 선택된 스토리 전체에 1..n 순번을 다시 부여
  const handleMoveFeatured = async (
    index: number,
    dir: -1 | 1,
  ): Promise<void> => {
    const target = index + dir;
    if (target < 0 || target >= featuredOrdered.length) return;
    const reordered = [...featuredOrdered];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    for (let i = 0; i < reordered.length; i++) {
      const { error } = await supabase
        .from("stories")
        .update({ home_order: i + 1 })
        .eq("id", reordered[i].id);
      if (error) {
        alert(error.message);
        return;
      }
    }
    fetchStories();
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Remove this story?")) return;
    await supabase.from("stories").delete().eq("id", id);
    fetchStories();
  };

  const handleCancel = () => {
    resetForm();
    setView("list");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setPassword("");
  };

  return (
    <div className={styles.page}>
      {!loggedIn && (
        <div className={styles["login-screen"]}>
          <div className={styles["login-box"]}>
            <h1>Admin.</h1>
            <p>LOIND Content Management</p>
            <div className={styles["login-field"]}>
              <label>Password</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                ref={passwordInputRef}
              />
            </div>
            <p className={styles["login-error"]}>{loginError}</p>
            <button
              className={styles["login-btn"]}
              onClick={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </div>
        </div>
      )}

      {loggedIn && (
        <div className={styles["admin-content"]}>
          <aside className={styles["sidebar-nav"]}>
            <div
              className={styles["sidebar-brand"]}
              onClick={() => navigate("/")}
            >
              LOIND
            </div>
            <p className={styles["sidebar-sub"]}>Content Admin</p>

            <button
              type="button"
              className={view === "list" ? styles.active : ""}
              onClick={() => setView("list")}
            >
              스토리 목록
            </button>
            <button
              type="button"
              className={view === "new" ? styles.active : ""}
              onClick={startNewStory}
            >
              새 스토리 작성
            </button>
            <button
              type="button"
              className={view === "order" ? styles.active : ""}
              onClick={() => setView("order")}
            >
              메인 노출 순서
            </button>

            <div className={styles["sidebar-divider"]} />

            <Link to="/story">사이트 스토리 보기 ↗</Link>

            <div className={styles["sidebar-spacer"]} />

            <button
              type="button"
              className={styles["logout-btn"]}
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </aside>
          <main>
            <section className={styles.hero}>
              <h1>
                {view === "new" && editId ? "Edit Story." : VIEW_META[view].title}
              </h1>
              <p>{VIEW_META[view].sub}</p>
            </section>
            {view === "new" && (
            <section
              id="admin-editor"
              className={styles["editor-container"]}
            >
              <div className={styles["input-block"]}>
                <label>Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles["input-block"]}>
                <label>Story Title</label>
                <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className={styles["asset-group"]}>
                <label className={styles["asset-label"]}>
                  VISUAL ASSET — 여러 장 등록 시 상세 팝업에서 슬라이드로 노출
                  됩니다 (첫 번째가 대표 이미지)
                </label>
                <div
                  className={styles["asset-box"]}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <p>
                    {pendingFiles.length > 0
                      ? `READY: ${pendingFiles.length}개 파일 업로드 대기`
                      : "SELECT LOCAL IMAGE(S)"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles["file-input"]}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                <div className={styles["input-block"]}>
                  <div className={styles["image-url-row"]}>
                    <input
                      type="text"
                      placeholder="또는 이미지 URL 주소를 입력 후 추가"
                      value={imgUrl}
                      onChange={(e) => setImgUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className={styles["image-add-btn"]}
                      onClick={handleAddImageUrl}
                    >
                      추가
                    </button>
                  </div>
                </div>
                {(images.length > 0 || pendingFiles.length > 0) && (
                  <ul className={styles["image-list"]}>
                    {images.map((src, i) => (
                      <li key={src + i}>
                        <img src={src} alt="" />
                        <span className={styles["image-list-name"]}>
                          {i === 0 && (
                            <strong className={styles["image-cover-tag"]}>
                              대표
                            </strong>
                          )}
                          {src.split("/").pop()}
                        </span>
                        <div className={styles["image-list-actions"]}>
                          <button
                            type="button"
                            onClick={() => moveImage(i, -1)}
                            disabled={i === 0}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(i, 1)}
                            disabled={i === images.length - 1}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className={styles["del-btn"]}
                            onClick={() => removeImage(i)}
                          >
                            삭제
                          </button>
                        </div>
                      </li>
                    ))}
                    {pendingFiles.map((f, i) => (
                      <li key={f.name + i}>
                        <span className={styles["image-list-name"]}>
                          ⬆ {f.name}{" "}
                          <em className={styles["image-pending-tag"]}>
                            업로드 대기
                          </em>
                        </span>
                        <div className={styles["image-list-actions"]}>
                          <button
                            type="button"
                            className={styles["del-btn"]}
                            onClick={() => removePendingFile(i)}
                          >
                            삭제
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles["input-block"]}>
                <label>Short Summary</label>
                <input
                  type="text"
                  placeholder="한 줄 요약 문구 (상단 피처드 소개글)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <div className={styles["input-block"]}>
                <label>Link URL — 연결 링크 (선택)</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div className={styles["input-block"]}>
                <label>Brief View — 간략보기 내용 (팝업)</label>
                <textarea
                  placeholder="스토리 팝업에 표시될 간략 내용을 입력하세요..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
              <div className={styles["input-block"]}>
                <label>Detailed Narrative — 자세히보기 내용 (상세 페이지)</label>
                <textarea
                  placeholder="자세히보기 상세 페이지에 표시될 내용을 입력하세요..."
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                />
              </div>
              <label className={styles["recommend-toggle"]}>
                <input
                  type="checkbox"
                  checked={isRecommended}
                  onChange={(e) => setIsRecommended(e.target.checked)}
                />
                스토리 페이지 추천 게시물로 노출
              </label>
              <label className={styles["recommend-toggle"]}>
                <input
                  type="checkbox"
                  checked={isHomeFeatured}
                  onChange={(e) => setIsHomeFeatured(e.target.checked)}
                />
                메인페이지 스토리로 노출 (최대 {HOME_FEATURED_LIMIT}개 · 현재{" "}
                {homeFeaturedCount}/{HOME_FEATURED_LIMIT})
              </label>
              <div>
                <button
                  className={styles["btn-primary"]}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitLabel}
                </button>
                {editId && (
                  <button
                    className={styles["cancel-edit"]}
                    onClick={handleCancel}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </section>
            )}
            {view === "order" && (
            <section
              id="admin-home-order"
              className={styles["archive-section"]}
            >
              <div className={styles["archive-header"]}>
                <h2>Home Order.</h2>
                <span className={styles["archive-count"]}>
                  메인페이지 노출 {homeFeaturedCount}/{HOME_FEATURED_LIMIT}
                </span>
              </div>
              {featuredOrdered.length === 0 ? (
                <p className={styles["loading-text"]}>
                  메인페이지 노출로 선택된 스토리가 없습니다. '스토리 목록'에서
                  '메인 노출'을 눌러 추가하세요.
                </p>
              ) : (
                <ol className={styles["home-order-list"]}>
                  {featuredOrdered.map((story, i) => (
                    <li key={story.id}>
                      <span className={styles["home-order-num"]}>{i + 1}</span>
                      <img src={story.img} alt={story.title} />
                      <span className={styles["home-order-title"]}>
                        {story.title}
                      </span>
                      <div className={styles["image-list-actions"]}>
                        <button
                          type="button"
                          onClick={() => handleMoveFeatured(i, -1)}
                          disabled={i === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveFeatured(i, 1)}
                          disabled={i === featuredOrdered.length - 1}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className={styles["del-btn"]}
                          onClick={() => handleToggleHomeFeatured(story)}
                        >
                          해제
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
            )}
            {view === "list" && (
            <section
              id="admin-archive"
              className={styles["archive-section"]}
            >
              <div className={styles["archive-header"]}>
                <h2>Archive.</h2>
                <span className={styles["archive-count"]}>
                  총 {filteredStories.length}건
                </span>
              </div>
              <div className={styles["archive-filter"]}>
                {["ALL", ...CATEGORY_OPTIONS].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles["archive-filter-btn"]} ${
                      archiveCategory === cat ? styles.active : ""
                    }`}
                    onClick={() => setArchiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div id="story_list">
                {listLoading ? (
                  <p className={styles["loading-text"]}>Loading archive...</p>
                ) : pagedStories.length === 0 ? (
                  <p className={styles["loading-text"]}>
                    해당 분류의 스토리가 없습니다.
                  </p>
                ) : (
                  pagedStories.map((story) => (
                    <div className={styles["archive-item"]} key={story.id}>
                      <img src={story.img} alt={story.title} />
                      <div className={styles["archive-item-info"]}>
                        <h4>
                          {story.is_recommended && (
                            <span title="추천 게시물">★ </span>
                          )}
                          {story.is_home_featured && (
                            <span title="메인페이지 노출">🏠 </span>
                          )}
                          {story.title}
                        </h4>
                        <p>{story.category}</p>
                      </div>
                      <div className={styles["archive-actions"]}>
                        <button
                          className={styles["edit-btn"]}
                          onClick={() => handleToggleHomeFeatured(story)}
                        >
                          {story.is_home_featured ? "메인 해제" : "메인 노출"}
                        </button>
                        <button
                          className={styles["edit-btn"]}
                          onClick={() => handleEdit(story)}
                        >
                          EDIT
                        </button>
                        <button
                          className={styles["del-btn"]}
                          onClick={() => handleDelete(story.id)}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {!listLoading && archiveTotalPages > 1 && (
                <nav className={styles["archive-pagination"]}>
                  <button
                    type="button"
                    disabled={safeArchivePage === 1}
                    onClick={() =>
                      setArchivePage((p) => Math.max(1, p - 1))
                    }
                  >
                    ‹
                  </button>
                  {Array.from({ length: archiveTotalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={
                        safeArchivePage === i + 1 ? styles.active : ""
                      }
                      onClick={() => setArchivePage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={safeArchivePage === archiveTotalPages}
                    onClick={() =>
                      setArchivePage((p) =>
                        Math.min(archiveTotalPages, p + 1),
                      )
                    }
                  >
                    ›
                  </button>
                </nav>
              )}
            </section>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
