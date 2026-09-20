import { useMemo, useState } from "react";
import styles from "./CreatorGroundPage.module.css";

interface RequestEntry {
  at: string;
  author: string;
  title: string;
  body: string;
}

interface Project {
  id: string;
  name: string;
  active: boolean;
  brief: string;
  requests: RequestEntry[];
}

interface CalendarEvent {
  date: string;
  time: string;
  title: string;
}

const initialProjects: Project[] = [
  {
    id: "awesome",
    name: "어썸스쿨 (AI 대과기대)",
    active: true,
    brief: "",
    requests: [
      {
        at: "2026.05.19 09:00",
        author: "관리자",
        title: "의뢰",
        body: "안녕하세요, 대희님! 어썸스쿨 김지수입니다. 찬종님께 번호 전달받아 연락드렸습니다.\n저희 프로그램 촬영팀으로 협업해 주셔서 다시 한번 감사드립니다!\n\n[촬영 개요]\n\n장소: 대전과학기술대학교 내\n\n과업: 프로그램 3종 기획/촬영/편집 (영상 1편 제작)\n\n일정: * 코딩교육 1회 / AI웹툰교육 1회 / 해커톤 캠프 1회\n\n해커톤 캠프 시 캠프 촬영 + 부스 운영 + 학과장 인터뷰 포함 (가장 분량이 많습니다)\n\n비용: 총 300만 원 (VAT 포함)\n\n선금 150만 원 / 잔금 150만 원 분할 지급 가능하실까요?\n\n편집: 캠프 종료 후 2주 내 완료 요청",
      },
    ],
  },
  { id: "aero", name: "항공우주 주니어 토요…", active: true, brief: "", requests: [] },
  { id: "whole", name: "WHOLGENCAMP", active: false, brief: "", requests: [] },
];

const doneProjects = ["완료 프로젝트 A", "완료 프로젝트 B", "완료 프로젝트 C", "완료 프로젝트 D"];

const initialEvents: CalendarEvent[] = [
  { date: "2026-09-05", time: "16:00", title: "항공우주 2회차 촬영" },
  { date: "2026-09-12", time: "16:00", title: "항공우주 3회차 촬영" },
  { date: "2026-09-16", time: "16:00", title: "항공우주 1차 납품" },
  { date: "2026-09-18", time: "16:00", title: "항공우주 최종본 납품" },
  { date: "2026-09-19", time: "00:00", title: "아해바 반응형, 추가기능 작업 마감" },
  { date: "2026-09-19", time: "16:00", title: "항공우주 4회차 사진촬영" },
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function CreatorGroundPage() {
  const today = useMemo(() => new Date(), []);
  const [tab, setTab] = useState<"overview" | "calendar">("overview");
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState(initialProjects[0].id);
  const [showDone, setShowDone] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "" });

  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toKey(today));
  const [view, setView] = useState<"month" | "week">("month");
  const [events, setEvents] = useState(initialEvents);
  const [addingEvent, setAddingEvent] = useState(false);
  const [eventDraft, setEventDraft] = useState({ date: toKey(today), time: "16:00", title: "" });

  const project = projects.find((p) => p.id === selectedId) ?? projects[0];

  const eventDates = useMemo(() => new Set(events.map((e) => e.date)), [events]);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    let start = new Date(year, month, 1);
    let count = new Date(year, month + 1, 0).getDate() + start.getDay();
    if (view === "week") {
      const base = new Date(selectedDate);
      start = new Date(base.getFullYear(), base.getMonth(), base.getDate() - base.getDay());
      count = 7;
    } else {
      start = new Date(year, month, 1 - start.getDay());
      count = Math.ceil(count / 7) * 7;
    }
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return { date: d, key: toKey(d), inMonth: d.getMonth() === month };
    });
  }, [cursor, view, selectedDate]);

  const monthEvents = events
    .filter((e) => e.date.startsWith(`${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}`))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  function moveMonth(delta: number) {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  }

  function submitRequest() {
    if (!draft.title.trim() && !draft.body.trim()) return;
    const now = new Date();
    const at = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? { ...p, requests: [...p.requests, { at, author: "관리자", title: draft.title.trim() || "요청", body: draft.body.trim() }] }
          : p,
      ),
    );
    setDraft({ title: "", body: "" });
    setAdding(false);
  }

  function submitEvent() {
    if (!eventDraft.title.trim() || !eventDraft.date) return;
    setEvents((prev) => [...prev, { ...eventDraft, title: eventDraft.title.trim() }]);
    setEventDraft({ ...eventDraft, title: "" });
    setAddingEvent(false);
  }

  const calendar = (
    <aside className={styles.calendarPane}>
      <div className={styles.calHead}>
        <div className={styles.calNav}>
          <button type="button" aria-label="이전 달" onClick={() => moveMonth(-1)}>‹</button>
          <strong>{cursor.getMonth() + 1}월 {cursor.getFullYear()}</strong>
          <button type="button" aria-label="다음 달" onClick={() => moveMonth(1)}>›</button>
        </div>
        <button type="button" className={styles.pillBtn} onClick={() => setAddingEvent((v) => !v)}>
          + 일정
        </button>
      </div>

      {addingEvent && (
        <div className={styles.eventForm}>
          <input type="date" value={eventDraft.date} onChange={(e) => setEventDraft({ ...eventDraft, date: e.target.value })} />
          <input type="time" value={eventDraft.time} onChange={(e) => setEventDraft({ ...eventDraft, time: e.target.value })} />
          <input
            type="text"
            placeholder="일정 제목"
            value={eventDraft.title}
            onChange={(e) => setEventDraft({ ...eventDraft, title: e.target.value })}
          />
          <button type="button" className={styles.primaryBtn} onClick={submitEvent}>추가</button>
        </div>
      )}

      <div className={styles.segment}>
        <button type="button" className={view === "month" ? styles.segActive : ""} onClick={() => setView("month")}>월</button>
        <button type="button" className={view === "week" ? styles.segActive : ""} onClick={() => setView("week")}>주</button>
      </div>

      <div className={styles.calGrid}>
        {WEEKDAYS.map((w, i) => (
          <span key={i} className={styles.calWeekday}>{w}</span>
        ))}
        {cells.map((c) => {
          const isToday = c.key === toKey(today);
          const isSel = c.key === selectedDate;
          return (
            <button
              key={c.key}
              type="button"
              className={`${styles.calDay} ${c.inMonth ? "" : styles.calOut} ${isToday ? styles.calToday : ""} ${isSel && !isToday ? styles.calSelected : ""}`}
              onClick={() => setSelectedDate(c.key)}
            >
              {c.date.getDate()}
              {eventDates.has(c.key) && <i className={styles.calDot} />}
            </button>
          );
        })}
      </div>

      <div className={styles.eventList}>
        <p className={styles.eventListTitle}>이달의 일정</p>
        {monthEvents.length === 0 && <p className={styles.empty}>등록된 일정이 없습니다.</p>}
        {monthEvents.map((e, i) => (
          <p key={i} className={styles.eventRow}>
            <span className={styles.eventTime}>{e.date.slice(5).replace("-", ".")} {e.time}</span>
            <span className={styles.eventTitle}>{e.title}</span>
          </p>
        ))}
      </div>
    </aside>
  );

  return (
    <div className={styles.stage}>
      <div className={styles.app}>
        <aside className={styles.sidebar}>
          <div className={styles.sideLogo}>
            <img src="/LOIND_LOGO.png" alt="LOIND Creator Ground" />
          </div>
          <nav className={styles.sideNav}>
            <button type="button" className={tab === "overview" ? styles.navActive : ""} onClick={() => setTab("overview")}>
              <span className={styles.navIcon}>▥</span> Overview
            </button>
            <button type="button" className={tab === "calendar" ? styles.navActive : ""} onClick={() => setTab("calendar")}>
              <span className={styles.navIcon}>▦</span> Calendar
            </button>
          </nav>
          <div className={styles.sideUser}>
            <span className={styles.avatar}>관</span>
            <span>관리자</span>
          </div>
        </aside>

        <main className={styles.main}>
          <p className={styles.eyebrow}>LOIND CREATOR GROUND</p>
          <h1 className={styles.greeting}>Hey there, 관리자!</h1>
          <p className={styles.greetingSub}>오늘도 좋은 하루 되세요.</p>
          <div className={styles.banner} />

          {tab === "overview" ? (
            <div className={styles.overview}>
              <section className={styles.listPanel}>
                <h2>Overview</h2>
                <p className={styles.panelSub}>항목</p>
                <div className={styles.projectList}>
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`${styles.projectItem} ${p.id === project.id ? styles.projectActive : ""}`}
                      onClick={() => {
                        setSelectedId(p.id);
                        setAdding(false);
                      }}
                    >
                      <span className={styles.folder}>▭</span>
                      <span className={styles.projectName}>{p.name}</span>
                      <i className={`${styles.statusDot} ${p.active ? styles.statusOn : ""}`} />
                    </button>
                  ))}
                </div>
                <button type="button" className={styles.doneToggle} onClick={() => setShowDone((v) => !v)}>
                  {showDone ? "▾" : "▸"} 완료 {doneProjects.length}개
                </button>
                {showDone &&
                  doneProjects.map((name) => (
                    <p key={name} className={styles.doneItem}>{name}</p>
                  ))}
              </section>

              <section className={styles.detailPanel}>
                <h2>{project.name}</h2>
                <div className={styles.block}>
                  <h3>의뢰서내용</h3>
                  <p className={styles.empty}>{project.brief || "등록된 내용이 없습니다."}</p>
                </div>
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h3>요청사항내용</h3>
                    <button type="button" className={styles.pillBtn} onClick={() => setAdding((v) => !v)}>
                      + 추가
                    </button>
                  </div>
                  {adding && (
                    <div className={styles.requestForm}>
                      <input
                        type="text"
                        placeholder="제목"
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      />
                      <textarea
                        placeholder="요청사항을 입력하세요"
                        rows={4}
                        value={draft.body}
                        onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                      />
                      <button type="button" className={styles.primaryBtn} onClick={submitRequest}>등록</button>
                    </div>
                  )}
                  <div className={styles.requestScroll}>
                    {project.requests.length === 0 && <p className={styles.empty}>등록된 요청사항이 없습니다.</p>}
                    {project.requests.map((r, i) => (
                      <article key={i} className={styles.request}>
                        <p className={styles.requestMeta}>
                          {r.at} <span>{r.author}</span>
                        </p>
                        <p className={styles.requestTitle}>{r.title}</p>
                        <p className={styles.requestBody}>{r.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className={styles.calendarTab}>
              <p className={styles.panelSub}>오른쪽 캘린더에서 일정을 확인하고 추가할 수 있어요.</p>
            </div>
          )}
        </main>

        {calendar}
      </div>
    </div>
  );
}
