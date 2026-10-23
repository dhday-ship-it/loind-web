import { useEffect, useRef, useState } from "react";
import "./PrayPage.css";

// 기도하는 공간 (/pray) — 라이즈 사이트의 기도하는 공간(LOIND-라이즈 src/components/Pray.jsx)에서 시작한 페이지.
//   아티즌·라이즈 코드를 가져오지 않고 이 파일에 따로 복사해 둠 (React 중복 문제 방지).
//   라이즈는 '함께 기도하는 교회', 로인드는 '기도제목'으로 내용이 다름.
//   위: 현재 시각 · 찬양 듣기 / 아래: 기도제목 (주기도문 → 주의 나라 → 분야 4개 → 구체적인 사역)
// 주기도문 (개역개정) — 기도제목 제목 바로 아래. 바깥 배열 = 문단, 안쪽 = 줄
const LORDS_PRAYER = [
  ["하늘에 계신 우리 아버지여"],
  ["이름이 거룩히 여김을 받으시오며 나라가 임하시오며", "뜻이 하늘에서 이루어진 것 같이 땅에서도 이루어지이다"],
  ["오늘 우리에게 일용할 양식을 주시옵고 우리가 우리에게 죄 지은 자를 사하여 준 것 같이 우리 죄를 사하여 주시옵고 우리를 시험에 들게 하지 마시옵고 다만 악에서 구하시옵소서"],
  ["대개 나라와 권세와 영광이 아버지께 영원히 있사옵나이다 아멘"],
];

// 기도제목 — 분야별 박스, 한 문장씩
const PRAYERS: { field: string; items: string[] }[] = [
  {
    field: "주의 나라를 위해",
    items: [
      "아버지의 뜻이 이 땅 가운데 이뤄지게 하옵소서.",
    ],
  },
  {
    field: "리더십을 위해",
    items: [
      "어떤 일이 닥쳐와도 끝까지 주께 순종하며 기쁨으로 이 길을 걷게 하옵소서.",
    ],
  },
  {
    field: "사역을 위해",
    items: [
      "하나님의 뜻 안에서 사역이 끊기지 않고 이어지게 하옵소서.",
      "하는 모든 일에서 우리가 아닌 하나님이 드러나게 하옵소서.",
      "그 일 안에서 우리에게 기쁨이 넘치게 하옵소서.",
      "하나님이 뜻하신 대로 쓰임받는 우리가 되게 하옵소서.",
    ],
  },
  {
    field: "사역팀을 위해",
    items: [
      "서로를 사랑으로 세워 주며 하나 되어 일하게 하옵소서.",
      "각자에게 주신 달란트가 하나님을 위해 기쁘게 쓰이게 하옵소서.",
      "지치지 않고 말씀과 기도 안에서 힘을 얻게 하옵소서.",
    ],
  },
  {
    field: "함께하는 이들을 위해",
    items: [
      "우리와 함께하는 모든 이들에게 하나님의 은혜와 평안이 넘치게 하옵소서.",
      "만남과 협력이 서로를 세우고 하나님께 영광이 되게 하옵소서.",
      "우리가 섬기는 이들이 하나님의 사랑을 경험하게 하옵소서.",
    ],
  },
];

// 구체적인 사역을 위해 — 분야 박스들 아래, 넓은 박스 하나 (사명 이름 + 기도)
const MISSIONS = [
  {
    title: "사람을 세우는 사명",
    text: "먼저 우리가 '축복의 통로'가 되게 하시고, 다른 이들을 '축복의 통로'로 세우게 하옵소서.",
  },
  {
    title: "세상 가운데 세워진 기업으로서의 사명",
    text: "세상 가운데서 하나님의 이름으로 하나님의 일을 선포하며, 쓰임받는 공동체로서 기쁨을 누리게 하옵소서.",
  },
];

// 찬양: '함께 계셨네' 피아노 반주 (https://youtu.be/TSvwOg-YAN4) — 영상은 숨기고 소리만
// 브라우저 정책상 소리 있는 자동 재생은 막혀 있어서, 방문자가 한 번 눌러야 재생됨
const VIDEO_ID = "TSvwOg-YAN4";

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(v: number): void;
  destroy(): void;
}
interface YTNamespace {
  Player: new (el: HTMLElement, opts: object) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT as YTNamespace);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
}

function PrayMusic() {
  const holder = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");

  useEffect(() => () => player.current?.destroy(), []);

  const toggle = async () => {
    if (state === "playing") {
      player.current?.pauseVideo();
      setState("paused");
      return;
    }
    if (player.current) {
      player.current.playVideo();
      setState("playing");
      return;
    }
    if (!holder.current) return;
    setState("loading");
    const YT = await loadYouTubeApi();
    player.current = new YT.Player(holder.current, {
      videoId: VIDEO_ID,
      playerVars: { autoplay: 1, loop: 1, playlist: VIDEO_ID, controls: 0, playsinline: 1 },
      events: {
        onReady: (e: { target: YTPlayer }) => {
          e.target.setVolume(70);
          e.target.playVideo();
        },
        onStateChange: (e: { data: number }) => {
          if (e.data === YT.PlayerState.PLAYING) setState("playing");
          if (e.data === YT.PlayerState.PAUSED) setState("paused");
        },
      },
    });
  };

  const playing = state === "playing";
  return (
    <div className={`pm ${playing ? "is-playing" : ""}`}>
      <button type="button" className="pm-link" onClick={toggle} aria-pressed={playing}>
        <span className="pm-eq" aria-hidden="true"><i /><i /><i /><i /></span>
        {state === "loading" ? "불러오는 중" : playing ? "찬양 멈추기" : "찬양 듣기"}
      </button>
      {/* 소리만 나오도록 화면 밖에 숨긴 유튜브 플레이어 */}
      <div className="pm-hidden" aria-hidden="true"><div ref={holder} /></div>
    </div>
  );
}

// 현재 시각 (크고 얇은 글자, 가운데 : 은 깜빡임)
function NowClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const date = now.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
  return (
    <div className="pr-now">
      <b>{hh}<i>:</i>{mm}</b>
      <small>{date}</small>
    </div>
  );
}

export default function PrayPage() {
  // 이 페이지에 있는 동안만 검정 바탕 (나갈 때 원래대로)
  useEffect(() => {
    document.documentElement.dataset.page = "pray";
    return () => {
      delete document.documentElement.dataset.page;
    };
  }, []);

  return (
    <main className="pr-page">
      <div className="pr">
        <section className="pr-quiet" aria-labelledby="pr-title">
          <h1 id="pr-title">기도하는 공간</h1>
          <NowClock />
          <PrayMusic />
        </section>

        <section className="pr-prayers" aria-labelledby="pr-prayers-title">
          <h2 id="pr-prayers-title">기도제목</h2>
          <p className="pr-lord">
            {LORDS_PRAYER.map((para) => (
              <span key={para[0]}>
                {para.map((line, i) => (
                  <span key={line}>{i > 0 && <br />}{line}</span>
                ))}
              </span>
            ))}
          </p>
          <ul>
            {PRAYERS.map((f) => (
              <li key={f.field}>
                <h3>[{f.field}]</h3>
                <div className="pr-box">
                  {f.items.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="pr-mission">
            <h3>[구체적인 사역을 위해]</h3>
            <div className="pr-box">
              {MISSIONS.map((m) => (
                <div key={m.title}>
                  <b>{m.title}</b>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
