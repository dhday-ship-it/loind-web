import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import styles from "./AboutPage.module.css";

/** CSS custom-property-friendly style object (for --label-color etc.). */
type CSSVarStyle = CSSProperties & { [key: `--${string}`]: string | number };

interface LabelData {
  id: string;
  name: string;
  color: string;
  note: string;
}

/** [left%, top%, rotateDeg] */
type LabelPosition = [number, number, number];

const LABELS: LabelData[] = [
  {
    id: "01",
    name: "FOUNDATION",
    color: "#9f91f2",
    note: "말씀과 기도로 굳건히 세워지는 영적 민감성",
  },
  {
    id: "02",
    name: "DESIGN",
    color: "#75cff0",
    note: "말씀을 근거로 세상에 필요한 선한 형태를 설계하는 감각",
  },
  {
    id: "03",
    name: "DELIVERY",
    color: "#94e6d4",
    note: "정체성과 고백을 온전한 비즈니스로 구현하여 제공하는 힘",
  },
  {
    id: "04",
    name: "EXPERIENCE",
    color: "#ffe471",
    note: "사회가 사랑의 가치를 학습하고 품격 있게 경험하도록 돕는 태도",
  },
  {
    id: "05",
    name: "IDENTITY",
    color: "#f5bd88",
    note: "성경적 기준과 실행이라는 선명한 차별성",
  },
  {
    id: "06",
    name: "SYSTEM",
    color: "#f49a93",
    note: "다짐을 넘어 사람이 살아낼 수 있도록 돕는 구조",
  },
  {
    id: "07",
    name: "PRIDE",
    color: "#f08cc3",
    note: "말씀이 삶이 되도록 돕는 일에 대한 자부심",
  },
  {
    id: "08",
    name: "OPEN",
    color: "#bce97f",
    note: "가치를 경험하고 싶은 누구에게나 열린 자세",
  },
  {
    id: "09",
    name: "LIVE",
    color: "#f4ad48",
    note: "누군가의 삶 안에서 말씀이 살아 움직이게 만드는 열정",
  },
  {
    id: "10",
    name: "COMMUNITY",
    color: "#d7d7d7",
    note: "함께 기준을 구현해 나가는 공동체의 힘",
  },
];

const POSITIONS: LabelPosition[] = [
  [7, 7, -12],
  [39, 3, 7],
  [72, 10, -7],
  [3, 33, 8],
  [38, 25, -8],
  [74, 34, 9],
  [7, 63, -10],
  [39, 60, 7],
  [70, 61, -9],
  [79, 76, 8],
];

const SECTION_IDS = [
  "introSection",
  "identitySection",
  "loindTopSection",
  "principleSection",
] as const;
type SectionId = (typeof SECTION_IDS)[number];

const DOT_ITEMS: {
  id: SectionId;
  label?: string;
  plain?: boolean;
  aria: string;
}[] = [
  { id: "introSection", plain: true, aria: "LOIND 로고 인트로로 이동" },
  { id: "identitySection", label: "LOIND", aria: "LOIND로 이동" },
  {
    id: "loindTopSection",
    label: "LOIND IDENTITY",
    aria: "LOIND IDENTITY로 이동",
  },
  {
    id: "principleSection",
    label: "LOIND PRINCIPLE",
    aria: "LOIND PRINCIPLE로 이동",
  },
];

export default function AboutPage() {
  const [activeSection, setActiveSection] =
    useState<SectionId>("introSection");
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<LabelData | null>(null);

  const introRef = useRef<HTMLElement | null>(null);
  const identityRef = useRef<HTMLElement | null>(null);
  const loindTopRef = useRef<HTMLElement | null>(null);
  const principleRef = useRef<HTMLElement | null>(null);

  const sectionRefMap: Record<SectionId, RefObject<HTMLElement | null>> = {
    introSection: introRef,
    identitySection: identityRef,
    loindTopSection: loindTopRef,
    principleSection: principleRef,
  };

  const streamRow1Ref = useRef<HTMLDivElement | null>(null);
  const streamRow2Ref = useRef<HTMLDivElement | null>(null);

  const labelsLayerRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const heartShellRef = useRef<HTMLDivElement | null>(null);
  const heartRef = useRef<SVGSVGElement | null>(null);

  const timersRef = useRef<number[]>([]);

  // --- [스크롤 스냅] 이 페이지에서만 적용하고 언마운트 시 원복 ---
  useEffect(() => {
    document.documentElement.style.scrollSnapType = "y mandatory";
    return () => {
      document.documentElement.style.scrollSnapType = "";
      document.documentElement.style.removeProperty("--active");
    };
  }, []);

  // --- [카테고리 내비게이션 + 헤더 높이(--chrome-h) 동기화] ---
  useEffect(() => {
    const panels = SECTION_IDS.map(
      (id) => sectionRefMap[id].current,
    ).filter((el): el is HTMLElement => el !== null);

    function updateActiveSection() {
      if (!panels.length) return;
      const headerEl = document.querySelector<HTMLElement>("header");
      const refY = (headerEl?.offsetHeight ?? 96) + 2;
      let currentId = panels[0].id as SectionId;
      for (const panel of panels) {
        if (panel.getBoundingClientRect().top <= refY) {
          currentId = panel.id as SectionId;
        } else {
          break;
        }
      }
      setActiveSection(currentId);
    }

    function syncChromeHeight() {
      const headerEl = document.querySelector<HTMLElement>("header");
      const h = headerEl?.offsetHeight ?? 96;
      document.documentElement.style.setProperty("--chrome-h", `${h}px`);
      updateActiveSection();
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    }

    syncChromeHeight();
    window.addEventListener("resize", syncChromeHeight);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", syncChromeHeight);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.removeProperty("--chrome-h");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- [스크롤 등장 애니메이션] stream-row 두 개를 관찰 ---
  useEffect(() => {
    const rows = [streamRow1Ref.current, streamRow2Ref.current].filter(
      (el): el is HTMLDivElement => el !== null,
    );
    if (!rows.length) return;

    const rowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles["is-visible"]);
          }
        });
      },
      { threshold: 0.1 },
    );
    rows.forEach((row) => rowObserver.observe(row));
    return () => rowObserver.disconnect();
  }, []);

  // --- [하트 라벨] 진입 애니메이션 + 무한 흔들림(idle) 애니메이션 ---
  useEffect(() => {
    LABELS.forEach((_label, index) => {
      const [, targetY, rotate] = POSITIONS[index];
      const delay = 180 + index * 95;

      const entranceTimer = window.setTimeout(() => {
        const el = labelRefs.current[index];
        if (!el) return;
        el.animate(
          [
            {
              top: "-160px",
              opacity: 0,
              transform: `rotate(${rotate - 18}deg) scale(.9)`,
            },
            {
              top: `${targetY + 2}%`,
              opacity: 1,
              transform: `rotate(${rotate + 3}deg) scale(1.02)`,
              offset: 0.78,
            },
            {
              top: `${targetY}%`,
              opacity: 1,
              transform: `rotate(${rotate}deg) scale(1)`,
            },
          ],
          {
            duration: 950,
            easing: "cubic-bezier(.18,.76,.24,1)",
            fill: "forwards",
          },
        );
      }, delay);
      timersRef.current.push(entranceTimer);

      const idleTimer = window.setTimeout(() => {
        const el = labelRefs.current[index];
        if (!el) return;
        const x = (Math.random() - 0.5) * 14;
        const y = (Math.random() - 0.5) * 12;
        const r = rotate + (Math.random() - 0.5) * 4;
        el.animate(
          [
            { transform: `translate(0,0) rotate(${rotate}deg)` },
            { transform: `translate(${x}px,${y}px) rotate(${r}deg)` },
            { transform: `translate(0,0) rotate(${rotate}deg)` },
          ],
          {
            duration: 4700 + index * 130,
            iterations: Infinity,
            easing: "ease-in-out",
          },
        );
      }, delay + 1000);
      timersRef.current.push(idleTimer);
    });

    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  function handleLabelClick(index: number) {
    const label = LABELS[index];
    const source = labelRefs.current[index];
    const heartShell = heartShellRef.current;
    if (!source || !heartShell) return;

    const sourceRect = source.getBoundingClientRect();
    const targetRect = heartShell.getBoundingClientRect();
    const sourceTransform = getComputedStyle(source).transform;

    const clone = source.cloneNode(true) as HTMLButtonElement;
    clone.classList.add(styles["flying-label"]);
    Object.assign(clone.style, {
      left: `${sourceRect.left}px`,
      top: `${sourceRect.top}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`,
      transform: sourceTransform,
    });
    document.body.appendChild(clone);

    const dx =
      targetRect.left +
      targetRect.width / 2 -
      (sourceRect.left + sourceRect.width / 2);
    const dy =
      targetRect.top +
      targetRect.height / 2 -
      (sourceRect.top + sourceRect.height / 2);

    const flight = clone.animate(
      [
        {
          transform: `${sourceTransform} scale(1)`,
          opacity: 1,
          filter: "blur(0)",
        },
        {
          transform: `translate(${dx * 0.62}px, ${dy * 0.55}px) rotate(10deg) scale(.76)`,
          opacity: 1,
          offset: 0.58,
        },
        {
          transform: `translate(${dx}px, ${dy}px) rotate(82deg) scale(.08)`,
          opacity: 0,
          filter: "blur(2px)",
        },
      ],
      { duration: 900, easing: "cubic-bezier(.55,.02,.3,1)", fill: "forwards" },
    );
    flight.onfinish = () => clone.remove();

    source.animate(
      [{ opacity: 1 }, { opacity: 0.28, offset: 0.5 }, { opacity: 1 }],
      { duration: 760, easing: "ease" },
    );

    const absorbTimer = window.setTimeout(() => {
      setSelectedLabel(label);
      document.documentElement.style.setProperty("--active", label.color);
      heartRef.current?.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.035)" },
          { transform: "scale(.992)" },
          { transform: "scale(1)" },
        ],
        { duration: 640, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
    }, 610);
    timersRef.current.push(absorbTimer);
  }

  function handleDotClick(id: SectionId) {
    const target = sectionRefMap[id].current;
    if (!target) return;

    setActiveSection(id);
    setIsScrolling(true);

    let settled = false;
    const finishScroll = () => {
      if (settled) return;
      settled = true;
      setIsScrolling(false);
      window.removeEventListener("scrollend", finishScroll);
    };
    if ("onscrollend" in window) {
      window.addEventListener("scrollend", finishScroll, { once: true });
    }
    const fallbackTimer = window.setTimeout(finishScroll, 900);
    timersRef.current.push(fallbackTimer);

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <nav
        className={`${styles["dot-nav"]} ${isScrolling ? styles["is-scrolling"] : ""}`}
        id="dotNav"
      >
        {DOT_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={[
              styles["dot-nav-item"],
              item.plain ? styles["dot-plain"] : "",
              activeSection === item.id ? styles["active"] : "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-label={item.label}
            aria-label={item.aria}
            onClick={() => handleDotClick(item.id)}
          />
        ))}
      </nav>

      <main className={styles["snap-main"]}>
        {/* [메인 인트로] 텍스트 라벨 없이 점만 표시되는 최상단 로고 커버 영역 */}
        <div
          id="introSection"
          ref={(el) => {
            introRef.current = el;
          }}
          className={`${styles["snap-panel"]} ${styles["cover-sub-panel"]}`}
        >
          <div className={styles["container"]}>
            <img
              className={styles["cover-logo-img"]}
              src="/LOIND_LOGO.png"
              alt="LOIND Logo"
            />
          </div>
        </div>

        {/* [통합 레이어 1] LOIND IDENTITY 섹션 (이름의 의미 + CI 컬러) */}
        <section
          id="identitySection"
          ref={(el) => {
            identityRef.current = el;
          }}
        >
          <div className={styles["container"]}>
            <div className={styles["content-inner-box"]}>
              <div className={styles["identity-wrapper"]}>
                <div className={styles["identity-header-row"]}>
                  <div className={styles["identity-logo-col"]}>
                    <img
                      className={styles["identity-logo-img"]}
                      src="/LOIND_LOGO.png"
                      alt="LOIND Logo"
                    />
                  </div>
                  <div className={styles["identity-text-col"]}>
                    <h2>LOVE + BIND, LOIND</h2>
                    <p className={styles["identity-meaning-text"]}>
                      로인드는 하나님 사랑과 이웃 사랑의 묶음을 뜻합니다.
                      <br />
                      우리의 정체성은 이 사랑의 묶음에서 출발합니다.
                    </p>
                    <p className={styles["identity-meaning-text"]}>
                      종교와 일상이라는 이분법적 경계를 넘어,
                      <br />
                      두개의 사랑 위에 일과 습관, 삶의 양식을 만들어갑니다.
                      <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* [통합 레이어 1.5] LOIND 메인 콘텐츠 패널 */}
        <div
          id="loindTopSection"
          ref={(el) => {
            loindTopRef.current = el;
          }}
          className={styles["loind-top-mega-section"]}
        >
          <div
            className={`${styles["container"]} ${styles["loind-contents-block"]}`}
          >
            <div
              className={`${styles["content-inner-box"]} ${styles["world-draw-wrap"]}`}
            >
              {/* 스냅 패널 2: 브랜드 선언문 + CORPORATION 스트림 */}
              <section className={styles["content-snap-panel"]}>
                <div className={styles["loind-content-stream"]}>
                  <div ref={streamRow1Ref} className={styles["stream-row"]}>
                    <div className={styles["stream-text"]}>
                      <h3>
                        "우리는 말씀에 기준한 시스템을 만드는 일을 합니다."
                      </h3>
                      <p>
                        <span className={styles["txt-glow"]}>
                          "성경에 기초한 기준과 실행"
                        </span>
                        은 우리의 기준이며, <br />
                        우리가 만들어가는 모든 영향력이 지향하는
                        목표입니다.
                        <br />
                        <br />
                        말씀으로 영감을 얻어 정체성과 차별성을 세우고,
                        <br />
                        그것을 그저 생각과 다짐에 그치는 것이 아닌{" "}
                        <span className={styles["txt-glow"]}>
                          사람이 접하는 여러 시스템
                        </span>
                        으로
                        <br />
                        만들어내는 것이 우리의{" "}
                        <span className={styles["txt-glow"]}>
                          자부심이자, 존재 이유
                        </span>
                        입니다.
                      </p>
                    </div>
                    <div className={styles["stream-right-column"]}>
                      <div className={styles["stream-img-box"]}>
                        <img src="/about_1.png" alt="Execution System Image" />
                      </div>
                      <div className={styles["stream-arrow-indicator"]}>
                        ↓
                      </div>
                      <div className={styles["stream-extracted-label"]}>
                        <div className={styles["label-top"]}>
                          <span>006 /</span>
                          <span>SYSTEM</span>
                        </div>
                        <span className={styles["label-name"]}>
                          LOIND SYSTEM
                        </span>
                        <div className={styles["label-meta"]}>
                          <span>
                            ORIGIN:
                            <br />
                            PROCESS:
                            <br />
                            WEIGHT:
                          </span>
                          <span>
                            WORD / LIFE
                            <br />
                            FULLY LIVED
                            <br />
                            VARIABLE
                          </span>
                        </div>
                        <span className={styles["label-vertical"]}>
                          VALUE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 스냅 패널 3: 통합 하트 가치 인터랙션 스트림 */}
              <section className={styles["content-snap-panel"]}>
                <div
                  className={`${styles["loind-content-stream"]} ${styles["heart-demo"]}`}
                >
                  <div
                    ref={streamRow2Ref}
                    className={`${styles["stream-row"]} ${styles["reverse-layout"]}`}
                  >
                    {/* 좌측 단: 인터랙션 스테이지 무대 */}
                    <div className={styles["interaction-stage"]} id="stage">
                      <div className={styles["stage-grid"]} aria-hidden="true" />
                      <div
                        className={styles["labels-layer"]}
                        ref={labelsLayerRef}
                        id="labelsLayer"
                        aria-label="선택 가능한 라벨"
                      >
                        {LABELS.map((label, index) => {
                          const [left, , rotate] = POSITIONS[index];
                          const labelStyle: CSSVarStyle = {
                            "--label-color": label.color,
                            left: `${left}%`,
                            top: "-160px",
                            transform: `rotate(${rotate}deg)`,
                          };
                          return (
                            <button
                              key={label.id}
                              type="button"
                              ref={(el) => {
                                labelRefs.current[index] = el;
                              }}
                              className={styles["label-card"]}
                              aria-label={`${label.name} 라벨 선택`}
                              style={labelStyle}
                              onClick={() => handleLabelClick(index)}
                            >
                              <div className={styles["label-top"]}>
                                <span>00{label.id} /</span>
                                <span>{label.name}</span>
                              </div>
                              <span className={styles["label-name"]}>
                                LOIND SYSTEM
                              </span>
                              <div className={styles["label-meta"]}>
                                <span>
                                  ORIGIN:
                                  <br />
                                  PROCESS:
                                  <br />
                                  WEIGHT:
                                </span>
                                <span>
                                  WORD / LIFE
                                  <br />
                                  FULLY LIVED
                                  <br />
                                  VARIABLE
                                </span>
                              </div>
                              <span className={styles["label-vertical"]}>
                                VALUE
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className={styles["heart-stage"]}>
                        <div
                          className={styles["heart-shell"]}
                          id="heartShell"
                          ref={heartShellRef}
                        >
                          <svg
                            ref={heartRef}
                            className={`${styles["heart"]} ${selectedLabel ? styles["is-filled"] : ""}`}
                            viewBox="0 0 520 470"
                            role="img"
                            aria-label="선택한 라벨로 채워지는 하트"
                          >
                            <defs>
                              <clipPath id="heartClip">
                                <path d="M260 430C219 386 93 302 54 217C16 135 56 48 143 43C198 40 239 73 260 110C281 73 322 40 377 43C464 48 504 135 466 217C427 302 301 386 260 430Z" />
                              </clipPath>
                              <pattern
                                id="heartPattern"
                                width={205}
                                height={96}
                                patternUnits="userSpaceOnUse"
                                patternTransform="rotate(-7)"
                              >
                                <rect
                                  id="patternBg"
                                  width={205}
                                  height={96}
                                  fill={
                                    selectedLabel
                                      ? selectedLabel.color
                                      : "#ecebe7"
                                  }
                                />
                                <text
                                  id="patternCode"
                                  x={15}
                                  y={31}
                                  fontFamily="Courier New, monospace"
                                  fontSize={20}
                                  fontWeight={700}
                                  fill="#141414"
                                >
                                  {selectedLabel
                                    ? `00${selectedLabel.id} /`
                                    : "000 /"}
                                </text>
                                <text
                                  id="patternName"
                                  x={15}
                                  y={58}
                                  fontFamily="Courier New, monospace"
                                  fontSize={15}
                                  fontWeight={700}
                                  fill="#141414"
                                >
                                  {selectedLabel
                                    ? selectedLabel.name
                                    : "SELECT A LABEL"}
                                </text>
                                <text
                                  x={15}
                                  y={79}
                                  fontFamily="Courier New, monospace"
                                  fontSize={9}
                                  fontWeight={700}
                                  fill="#141414"
                                >
                                  ORIGIN: HEART / PROCESS: LIVED
                                </text>
                                <line
                                  x1={15}
                                  y1={87}
                                  x2={188}
                                  y2={87}
                                  stroke="#141414"
                                  strokeWidth={1}
                                  opacity={0.55}
                                />
                              </pattern>
                              <filter
                                id="paperGrain"
                                x="-10%"
                                y="-10%"
                                width="120%"
                                height="120%"
                              >
                                <feTurbulence
                                  type="fractalNoise"
                                  baseFrequency={0.9}
                                  numOctaves={2}
                                  seed={7}
                                  result="noise"
                                />
                                <feColorMatrix
                                  in="noise"
                                  type="saturate"
                                  values="0"
                                  result="grayNoise"
                                />
                                <feComponentTransfer
                                  in="grayNoise"
                                  result="softNoise"
                                >
                                  <feFuncA type="table" tableValues="0 0.08" />
                                </feComponentTransfer>
                                <feBlend
                                  in="SourceGraphic"
                                  in2="softNoise"
                                  mode="multiply"
                                />
                              </filter>
                            </defs>
                            <g clipPath="url(#heartClip)">
                              <rect
                                className={styles["heart-fill"]}
                                width={520}
                                height={470}
                                fill="url(#heartPattern)"
                              />
                              <rect
                                className={styles["heart-sheen"]}
                                width={520}
                                height={470}
                                fill="url(#heartPattern)"
                                opacity={0}
                              />
                            </g>
                            <path
                              className={styles["heart-outline"]}
                              d="M260 430C219 386 93 302 54 217C16 135 56 48 143 43C198 40 239 73 260 110C281 73 322 40 377 43C464 48 504 135 466 217C427 302 301 386 260 430Z"
                            />
                            <path
                              className={styles["heart-outline"]}
                              d="M260 430C219 386 93 302 54 217C16 135 56 48 143 43C198 40 239 73 260 110C281 73 322 40 377 43C464 48 504 135 466 217C427 302 301 386 260 430Z"
                            />
                            <path
                              className={styles["heart-inner-line"]}
                              d="M260 399C219 356 113 283 79 209C50 145 77 79 147 75C199 72 235 107 260 151C285 107 321 72 373 75C443 79 470 145 441 209C407 283 301 356 260 399Z"
                            />
                            <g className={styles["heart-notes"]}>
                              <text x={24} y={29}>
                                SYSTEM / 001
                              </text>
                              <text x={408} y={29}>
                                STATE / ACTIVE
                              </text>
                              <line x1={105} y1={27} x2={164} y2={61} />
                              <line x1={405} y1={35} x2={364} y2={68} />
                            </g>
                          </svg>
                          <div
                            className={styles["heart-shadow"]}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 우측 단: 철학 설명 메인 텍스트 + 피드백 가치 보드 */}
                    <div className={styles["stream-text"]}>
                      <p>
                        우리는 그 시스템을 경험한 사람들이
                        <br />
                        <span className={styles["txt-glow"]}>
                          "말씀의 가치에 자연스럽게 다가가는 세상"
                        </span>
                        을 꿈꿉니다. <br />
                        <br />
                        이는 크리스천만이 아닌, <br />
                        <span className={styles["txt-glow"]}>
                          말씀의 가치를 경험하고 싶은 그 누구에게나
                        </span>{" "}
                        열려 있습니다.
                      </p>

                      <div className={styles["stage-caption"]} aria-live="polite">
                        <span className={styles["caption-index"]}>
                          {selectedLabel ? selectedLabel.id : ""}
                        </span>
                        <div>
                          {selectedLabel ? (
                            <h3>{selectedLabel.name}</h3>
                          ) : (
                            <h3>
                              누군가의 삶 안에서{" "}
                              <span className={styles["txt-glow"]}>
                                말씀이 살아 움직이는 것
                              </span>
                              ,<br />
                              그것이 우리{" "}
                              <span className={styles["txt-glow"]}>
                                LOIND가 소망하는 세상
                              </span>
                              입니다.
                            </h3>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* 두 구획을 나누는 미니멀 라인 구분 선 레이아웃 */}
          <div className={styles["section-divider"]}>
            <div className={styles["line"]} />
          </div>
        </div>

        {/* [통합 레이어 2] LOIND PRINCIPLE 섹션 */}
        <section
          id="principleSection"
          ref={(el) => {
            principleRef.current = el;
          }}
        >
          <div className={styles["container"]}>
            <div className={styles["content-inner-box"]}>
              <div className={styles["scatter-stage-wrapper"]} id="scatterStage">
                <div className={styles["scatter-stage-title"]}>
                  <h2>LOIND PRINCIPLE</h2>
                </div>
                <div className={styles["scatter-cards-arena"]} id="cardsArena">
                  <div className={styles["scatter-card"]}>
                    <div className={styles["card-graphic-icon"]}>+×</div>
                    <div className={styles["card-title-group"]}>
                      <h3 className={styles["std-card-main-title"]}>
                        Foundation
                      </h3>
                      <div className={styles["std-card-sub-title"]}>
                        세워짐
                      </div>
                    </div>
                    <p className={styles["std-card-main-desc"]}>
                      우리는 크리스천으로 세워졌습니다. 이 정체성은
                      흔들리지 않는 뿌리이며, 우리의 모든 생각과 행동은
                      여기에서 비롯됩니다.
                    </p>
                  </div>
                  <div className={styles["scatter-card"]}>
                    <div className={styles["card-graphic-icon"]}>{"<>"}</div>
                    <div className={styles["card-title-group"]}>
                      <h3 className={styles["std-card-main-title"]}>
                        Design
                      </h3>
                      <div className={styles["std-card-sub-title"]}>
                        빚음
                      </div>
                    </div>
                    <p className={styles["std-card-main-desc"]}>
                      그 뿌리에서 무엇을 흘려보낼지를 찾습니다. 말씀을
                      통해 전할 가치를 발견하고, 그것을 담아낼 그릇을
                      선한 형태로 빚어냅니다.
                    </p>
                  </div>
                  <div className={styles["scatter-card"]}>
                    <div className={styles["card-graphic-icon"]}>{"{}"}</div>
                    <div className={styles["card-title-group"]}>
                      <h3 className={styles["std-card-main-title"]}>
                        Delivery
                      </h3>
                      <div className={styles["std-card-sub-title"]}>
                        흘려보냄
                      </div>
                    </div>
                    <p className={styles["std-card-main-desc"]}>
                      빚어낸 것을 세상으로 흘려보냅니다. 우리 안에
                      머무는 가치가 아니라, 사람과 사람 사이로 삶의
                      자리마다 실제로 닿게 합니다.
                    </p>
                  </div>
                  <div className={styles["scatter-card"]}>
                    <div className={styles["card-graphic-icon"]}>;</div>
                    <div className={styles["card-title-group"]}>
                      <h3 className={styles["std-card-main-title"]}>
                        Experience
                      </h3>
                      <div className={styles["std-card-sub-title"]}>
                        채워짐+세워짐
                      </div>
                    </div>
                    <p className={styles["std-card-main-desc"]}>
                      우리는 그 가치를 경험한 사람이 또 하나의 뿌리로
                      세워지도록 이끕니다. 그렇게 세워진 이들과 함께
                      세상을 채워갑니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
