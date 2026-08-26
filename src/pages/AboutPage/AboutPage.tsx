import { useRef, useState } from "react";
import styles from "./AboutPage.module.css";

const leadershipItems = [
  {
    name: "정대희",
    title: "CEO",
    photo: "/daeheejeong.JPG",
    quote: "하나님과 사람에게 큰 기쁨이 되는 일을 합니다.",
    bio: "Love Bind, LOIND.\n로인드라는 이름은 하나님 사랑, 이웃 사랑으로 묶인 공동체를 뜻합니다.\n이 귀한 가치의 향기를 세상 속에 만들어가는 것이 우리 공동체의 목적이자 동기입니다.\n우리는 하나님 안에서 이 기쁨을 발견하고 만들어가는 약속의 공동체가 되어갈 것을 소망합니다.",
    career: [
      { year: "2026", text: "주식회사 로인드 CEO" },
      { year: "2024", text: "주식회사 온블 CEO" },
      { year: "2023", text: "엘로이 미래자립교회 임팩트 사업 Director" },
      { year: "2022", text: "총신대학교 졸업" },
    ],
  },
];

export default function AboutPage() {
  const introRef = useRef<HTMLElement | null>(null);
  const [verseOpen, setVerseOpen] = useState(false);
  const [missionVerseOpen, setMissionVerseOpen] = useState(false);

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
              <h1 className={styles["about-hero-title"]}>LOIND Corporation</h1>
              <p className={styles["about-hero-subtitle"]}>
                우리는 크리스천으로서 크리스천의 방식으로 일을 합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Principle + Calling + Vision + Mission */}
        <section className={styles["about-sections"]}>
          <div className={styles["about-section-divider"]} />

          <div className={styles["about-section-block"]}>
            <div className={styles["about-section-label"]}>
              <span className={styles["about-section-dot"]} />
              <span>Principle</span>
            </div>
            <div className={styles["principle-pillars"]}>
              <span className={styles["pillar-text"]}>of GOD</span>
              <span className={styles["pillar-arrow"]}>→</span>
              <span className={styles["pillar-text"]}>from GOD</span>
              <span className={styles["pillar-arrow"]}>→</span>
              <span className={styles["pillar-text"]}>for GOD</span>
            </div>
          </div>

          <div className={styles["about-section-divider"]} />

          <div className={styles["about-section-block"]}>
            <div className={styles["about-section-label"]}>
              <span className={styles["about-section-dot"]} />
              <span>Calling</span>
            </div>
            <div className={styles["about-section-content"]}>
              <h3 className={styles["about-section-heading"]}>of GOD</h3>
              <p className={styles["about-section-desc"]}>
                다른 어떤 수식어도 필요 없이, 오직 하나님 한 분께 속했다는 사실 하나로 우리의 존재를 정의합니다. 
                <b>Requiring no other descriptions, our existence is defined solely by the fact that we belong to God.</b>
              </p>
            </div>
          </div>

          <div className={styles["about-section-arrow"]}>↓</div>

          <div className={styles["about-section-block"]}>
            <div className={styles["about-section-label"]}>
              <span className={styles["about-section-dot"]} />
              <span>Vision</span>
            </div>
            <div className={styles["about-section-content"]}>
              <h3 className={styles["about-section-heading"]}>from GOD</h3>
              <p className={styles["about-section-desc"]}>
                그렇기에 우리는 하나님으로부터 주어진 뜻과 마음이 세상 가운데 이루어지기를 소망합니다
                <b>Therefore, we long for the purpose and heart given by God to be realized in this world.</b>
              </p>
              <button
                type="button"
                className={styles["verse-toggle"]}
                aria-expanded={verseOpen}
                onClick={() => setVerseOpen((open) => !open)}
              >
                <span>자세히 보기</span>
                <span
                  className={`${styles["verse-toggle-icon"]} ${verseOpen ? styles.open : ""}`}
                >
                  ⌄
                </span>
              </button>
              <div
                className={`${styles["verse-panel"]} ${verseOpen ? styles.open : ""}`}
              >
                <div className={styles["verse-panel-inner"]}>
                  <p className={styles["about-section-verse"]}>
                    "나의 거룩한 산 모든 곳에서 해됨도 없고 상함도 없을 것이니 이는 물이 바다를 덮음 같이 여호와를 아는 지식이 세상에 충만할 것임이니라" (이사야 11:9)
                  </p>
                  <p
                    className={`${styles["about-section-verse"]} ${styles["about-section-verse-highlight"]}`}
                  >
                    우리의 비전은 부르심을 입은 축복의 통로로서, 하나님 나라와 복음을 온 땅에 확장하는 데 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles["about-section-arrow"]}>↓</div>

          <div className={styles["about-section-block"]}>
            <div className={styles["about-section-label"]}>
              <span className={styles["about-section-dot"]} />
              <span>Mission</span>
            </div>
            <div className={styles["about-section-content"]}>
              <h3 className={styles["about-section-heading"]}>for GOD</h3>
              <p className={styles["about-section-desc"]}>그 소망을 위해, 우리는 각자의 역할로 하나님을 위해 세상을 섬기고 선한 변화를 만들어가는 사명을 살아냅니다.<b>For that hope, in our respective roles, we live out our mission to serve the world and create good change for God.</b></p>
              <button
                type="button"
                className={styles["verse-toggle"]}
                aria-expanded={missionVerseOpen}
                onClick={() => setMissionVerseOpen((open) => !open)}
              >
                <span>자세히 보기</span>
                <span
                  className={`${styles["verse-toggle-icon"]} ${missionVerseOpen ? styles.open : ""}`}
                >
                  ⌄
                </span>
              </button>
              <div
                className={`${styles["verse-panel"]} ${missionVerseOpen ? styles.open : ""}`}
              >
                <div className={styles["verse-panel-inner"]}>
                  <p className={styles["about-section-verse"]}>
                    "여호와의 말씀이 희귀하여 이상이 흔히 보이지 않았더라" (사무엘상 3:1)
                  </p>
                  <p className={styles["about-section-verse"]}>
                    제사장 엘리의 시대, 백성뿐 아니라 제사장마저 영적 분별력을 잃어버린 악한 시대였습니다. 그때 하나님은 사무엘을 하나님의 뜻을 향한 통로로 부르셨습니다.
                  </p>
                  <p className={styles["about-section-verse"]}>
                    하나님의 마음에 합한 자, 영적으로 어두운 시대에도 하나님의 뜻을 사모하고 하나님을 사랑하며 말씀을 주야로 묵상하는 자가 생기면 하나님은 그를 불러 사용하십니다.
                  </p>
                  <p
                    className={`${styles["about-section-verse"]} ${styles["about-section-verse-highlight"]}`}
                  >
                    이렇게 부르심을 받은 한 사람이 공동체를 변화시키고, 그렇게 변화된 공동체들이 모여 마침내 온 세상에 여호와를 아는 지식이 가득하게 됩니다.
                  </p>
                  <div className={styles["mission-diagram"]}>
                    <div className={styles["mission-diagram-step"]}>
                      <span className={styles["mission-diagram-num"]}>01</span>
                      <p className={styles["mission-diagram-label"]}>
                        말씀이 희귀한 시대
                        <span>(삼상 3:1) 그 어느 때보다 말씀과 기도를 쉽게 접할 수 있는 풍요로운 환경이지만, 역설적으로 말씀과 기도를 멀리하는 현대의 영적 암흑기를 살아가고 있습니다.</span>
                      </p>
                    </div>
                    <div className={styles["mission-diagram-step"]}>
                      <span className={styles["mission-diagram-num"]}>02</span>
                      <p className={styles["mission-diagram-label"]}>
                        부르심
                        <span>(삼상 3:3~10) 그러나 하나님의 등불은 아직 꺼지지 않았습니다. 하나님께서는 세상을 향한 구원의 사랑을 이루시기 위해, 어둠 속에서도 하나님을 사랑하고 말씀을 사모하는 자를 부르십니다.</span>
                      </p>
                    </div>
                    <div className={styles["mission-diagram-step"]}>
                      <span className={styles["mission-diagram-num"]}>03</span>
                      <p className={styles["mission-diagram-label"]}>
                        세워진 한 사람
                        <span>(삼상 3:11)부르심에 응답할 때 하나님의 마음에 합한 자가 바로 섭니다. 주님의 뜻을 세상에 흘려보낼 거룩한 통로가 세워집니다.</span>
                      </p>
                    </div>
                    <div className={styles["mission-diagram-step"]}>
                      <span className={styles["mission-diagram-num"]}>04</span>
                      <p className={styles["mission-diagram-label"]}>
                        공동체의 변화
                        <span>(삼상 3:19~21) 말씀 위에 바로 선 '변화된 한 사람'은 자신에게 머물지 않고, 자신이 속한 공동체와 이웃을 깨우고 새롭게 변화시키는 강력한 통로가 됩니다.</span>
                      </p>
                    </div>
                    <div className={styles["mission-diagram-step"]}>
                      <span className={styles["mission-diagram-num"]}>05</span>
                      <p className={styles["mission-diagram-label"]}>
                        충만한 지식
                        <span>(삼상 3:21, 사 11:9) 살아 숨 쉬는 하나님의 말씀이 세상 속으로 흘러넘쳐, 마침내 온 땅에 여호와를 아는 지식이 가득해지도록 우리는 각자에게 주신 비전과 사명을 끝까지 살아냅니다.</span>
                        
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles["about-section-arrow"]}>↓</div>

        {/* Culture / Way of Working */}
        <section className={styles["culture-section"]}>
          <div className={styles["culture-inner"]}>
            <div className={styles["culture-divider"]} />
            <div className={styles["culture-label"]}>
              <span className={styles["culture-dot"]} />
              <span>일하는 방식 (Way of Working)</span>
            </div>
            <div className={styles["culture-cards"]}>
              <div className={styles["culture-banner"]}>
                <p className={styles["culture-banner-text"]}>
                  우리는 말씀에 근거하여 크리스천 정체성에 따라 일합니다.
                </p>
              </div>
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
                src="/LOIND_LOGO.png"
                alt="LOIND"
              />
              <div>
                <h3 className={styles["corp-name"]}>LOIND Corporation</h3>
                <p className={styles["corp-desc"]}>
                  로인드는 크리에이티브 에이전시, 크리에이티브 스튜디오, 임팩트 브랜드 등 여러 브랜드를 통해 크리스천
                  정체성을 담은 사업을 운영하며, 각자의 자리에서 세상에 선한
                  영향력을 전합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
