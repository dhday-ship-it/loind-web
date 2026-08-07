import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import type { Story, StoryPayload } from "../../types/story";
import styles from "./AdminPage.module.css";

const CATEGORY_OPTIONS = [
  "Creative Agency",
  "Creative Studio: LODN",
  "Impact",
];

function AdminPage() {
  const navigate = useNavigate();

  // Login state
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Archive list state
  const [stories, setStories] = useState<Story[]>([]);
  const [listLoading, setListLoading] = useState(false);

  // Form state
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [title, setTitle] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState("SELECT LOCAL IMAGE");
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("PUBLISH STORY");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStories = useCallback(async (): Promise<void> => {
    setListLoading(true);
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const list: Story[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<Story, "id">;
      return { id: docSnap.id, ...data };
    });
    setStories(list);
    setListLoading(false);
  }, []);

  const handleLogin = async (): Promise<void> => {
    if (!password) {
      setLoginError("비밀번호를 입력하세요.");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, "dhday@loind.com", password);
      setLoggedIn(true);
      fetchStories();
    } catch {
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
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileStatus(`READY: ${selected.name.substring(0, 15)}...`);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!title) {
      alert("제목을 입력하세요.");
      return;
    }
    setSubmitting(true);
    setSubmitLabel("PUBLISHING...");
    try {
      let url = imgUrl;
      if (file) {
        const sRef = ref(storage, `images/${Date.now()}_${file.name}`);
        const upload = await uploadBytes(sRef, file);
        url = await getDownloadURL(upload.ref);
      }
      const payload: StoryPayload = {
        category,
        title,
        img: url,
        text,
        summary,
        detail,
        link,
        createdAt: new Date(),
      };
      if (editId) {
        await updateDoc(doc(db, "stories", editId), payload);
      } else {
        await addDoc(collection(db, "stories"), payload);
      }
      window.location.reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  };

  const handleEdit = (story: Story) => {
    setCategory(story.category);
    setTitle(story.title);
    setImgUrl(story.img);
    setText(story.text);
    setLink(story.link || "");
    setSummary(story.summary || "");
    setDetail(story.detail);
    setEditId(story.id);
    setSubmitLabel("UPDATE STORY");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Remove this story?")) return;
    await deleteDoc(doc(db, "stories", id));
    fetchStories();
  };

  const handleCancel = () => {
    window.location.reload();
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
          <header>
            <div className={styles.brand} onClick={() => navigate("/story")}>
              LOIND
            </div>
            <nav>
              <Link to="/about">ABOUT</Link>
              <Link to="/service">SERVICE</Link>
              <Link to="/story" className={styles.active}>
                STORY
              </Link>
              <Link to="/contact">CONTACT</Link>
            </nav>
          </header>
          <main>
            <section className={styles.hero}>
              <h1>Admin.</h1>
              <p>Manage and Curate Brand Content</p>
            </section>
            <section className={styles["editor-container"]}>
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
                <label className={styles["asset-label"]}>VISUAL ASSET</label>
                <div
                  className={styles["asset-box"]}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <p>{fileStatus}</p>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles["file-input"]}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                <div className={styles["input-block"]}>
                  <input
                    type="text"
                    placeholder="또는 이미지 URL 주소를 입력하세요"
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                  />
                </div>
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
                <label>Brief View — 간략보기 내용</label>
                <textarea
                  placeholder="간략보기 탭에 표시될 내용을 입력하세요..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
              <div className={styles["input-block"]}>
                <label>Detailed Narrative — 자세히보기 내용</label>
                <textarea
                  placeholder="자세히보기 탭에 표시될 상세 내용을 입력하세요..."
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                />
              </div>
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
            <section className={styles["archive-section"]}>
              <div className={styles["archive-header"]}>
                <h2>Archive.</h2>
              </div>
              <div id="story_list">
                {listLoading ? (
                  <p className={styles["loading-text"]}>Loading archive...</p>
                ) : (
                  stories.map((story) => (
                    <div className={styles["archive-item"]} key={story.id}>
                      <img src={story.img} alt={story.title} />
                      <div className={styles["archive-item-info"]}>
                        <h4>{story.title}</h4>
                        <p>{story.category}</p>
                      </div>
                      <div className={styles["archive-actions"]}>
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
            </section>
          </main>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
