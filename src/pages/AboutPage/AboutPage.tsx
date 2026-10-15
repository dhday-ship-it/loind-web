import { useRef } from "react";
import styles from "./AboutPage.module.css";

const leadershipItems = [
  {
    name: "정대희",
    title: "CEO",
    photo: "/daeheejeong.JPG",
    quote: "하나님과 사람에게 기쁨이 되는 일을 합니다.",
    bio: "Love Bind, LOIND.\n로인드라는 이름은 하나님 사랑, 이웃 사랑으로 묶인 공동체를 뜻합니다.\n이 귀한 가치의 향기를 세상 속에 만들어가는 것이 우리 공동체의 목적이자 동기입니다.\n우리는 하나님 안에서 이 기쁨을 발견하고 만들어가는 약속의 공동체가 되어갈 것을 소망합니다.",
    career: [
      { year: "2026", text: "주식회사 로인드 CEO" },
      { year: "2024", text: "주식회사 온블 CEO" },
      { year: "2023", text: "엘로이 미래자립교회 임팩트 사업 Director" },
      { year: "2022", text: "총신대학교 졸업" },
    ],
  },
];

// LOIND Color System (2026 개정안 · 최종 확정)
const brandColors = [
  { role: "Primary", name: "블루그레이", hex: "#8FA8C4" },
  { role: "Secondary 01", name: "딥 아이스 네이비블루", hex: "#55689B" },
  { role: "Secondary 02", name: "화이트", hex: "#F6FAFD" },
  { role: "Secondary 03", name: "블랙", hex: "#000000" },
];

export default function AboutPage() {
  const introRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <main className={styles["snap-main"]}>
        {/* [히어로] About 메인 */}
        <div
          id="introSection"
          ref={(el) => {
            introRef.current = el;
          }}
          className={`${styles["snap-panel"]} ${styles["about-hero"]}`}
        >
          <div className={styles["about-hero-content"]}>
            <div className={styles["about-hero-top"]}>
              <p className={styles["about-hero-subtitle"]}>Creating Joy for God and People</p>
              <h1 className={styles["about-hero-title"]}>LOIND Corporation</h1>
              <p className={styles["about-hero-intro"]}>
                LOIND는 하나님과 사람에게 기쁨이 되는 브랜드와 서비스를 만듭니다.
              </p>
            </div>
          </div>
        </div>

        {/* One Identity, Many Forms */}
        <section className={styles["about-sections"]}>
          <div className={styles["about-section-divider"]} />

          <div className={styles["about-section-block"]}>
            <div className={styles["about-section-label"]}>
              <span className={styles["about-section-dot"]} />
              <span>One Identity, Many Forms</span>
            </div>
            <div className={styles["about-section-content"]}>
              <h3 className={styles["about-section-heading"]}>하나의 정체성, 다양한 방식</h3>
              <p className={styles["about-section-desc"]}>
                LOIND의 출발점은 하나님께 속한 존재라는 사실에 있습니다.
                <br />
                우리는 이 정체성에서 출발해 브랜드, 콘텐츠, 디지털 경험과 서비스 등 다양한 방식으로 사람들에게 유익한 가치를
                만듭니다.
              </p>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className={styles["leadership-section"]}>
          <div className={styles["leadership-inner"]}>
            <div className={styles["about-section-label"]}>
              <span className={styles["about-section-dot"]} />
              <span>Leadership</span>
            </div>
            <div className={styles["leadership-list"]}>
              {leadershipItems.map((person) => (
                <div key={person.name} className={styles["leadership-card"]}>
                  <div className={styles["leadership-photo"]}>
                    <img src={person.photo} alt={person.name} />
                  </div>
                  <div className={styles["leadership-info"]}>
                    <h3 className={styles["leadership-name"]}>
                      {person.name} <span>|</span> {person.title}
                    </h3>
                    <p className={styles["leadership-quote"]}>
                      {person.quote}
                    </p>
                    <div className={styles["leadership-block"]}>
                      <h4 className={styles["leadership-block-title"]}>
                        소개
                      </h4>
                      <p className={styles["leadership-bio"]}>{person.bio}</p>
                    </div>
                    <div className={styles["leadership-block"]}>
                      <h4 className={styles["leadership-block-title"]}>
                        주요 경력
                      </h4>
                      <div className={styles["leadership-career"]}>
                        {person.career.map((c, i) => (
                          <div
                            key={`${c.year}-${i}`}
                            className={styles["leadership-career-row"]}
                          >
                            <span
                              className={styles["leadership-career-year"]}
                            >
                              {c.year}
                            </span>
                            <span
                              className={styles["leadership-career-text"]}
                            >
                              {c.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporation */}
        <section className={styles["corp-section"]}>
          <div className={styles["corp-inner"]}>
            <div className={styles["about-section-label"]}>
              <span className={styles["about-section-dot"]} />
              <span>Corporation</span>
            </div>
            <div className={styles["corp-brand"]}>
              <img
                className={styles["corp-logo"]}
                src="/img/logo-loind-corp.png"
                alt="LOIND Corporation"
              />
              <div>
                <h3 className={styles["corp-name"]}>LOIND Corporation</h3>
                <p className={styles["corp-desc"]}>
                  로인드는 제작 스튜디오 아티즌, 브랜드 콘텐츠 로든, 크리스천 비즈니스 라이즈 등 여러 브랜드를
                  통해 크리스천 정체성을 담은 사업을 전개하고 있습니다.
                </p>
                {/* 브랜드 컬러 */}
                <ul className={styles["corp-colors"]}>
                  <li className={styles["corp-colors-label"]}>Brand Color</li>
                  {brandColors.map((color) => (
                    <li key={color.hex} title={`${color.name} ${color.hex}`}>
                      <span className={styles["corp-swatch"]} style={{ background: color.hex }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
