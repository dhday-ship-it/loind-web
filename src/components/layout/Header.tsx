import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

interface HeaderProps {
  /** "sticky" auto-hides the header on downward scroll (used on the About page). */
  variant?: "static" | "sticky";
}

const artisanCategories: { title: string; items: string[]; wide?: boolean }[] = [
  { title: "홈페이지/웹", items: ["반응형 공식 웹사이트"] },
  { title: "영상", items: ["설교 요약 릴스/쇼츠", "행사 홍보 영상", "유튜브 인트로/아웃트로"] },
  {
    title: "굿즈/기념품",
    items: ["수련회 단체 티셔츠", "성경책 커버", "창립기념/세례·성찬 기념품", "커스텀 굿즈"],
  },
  { title: "기타", items: ["로비 현판", "간판"] },
  { title: "인쇄", items: [] },
  {
    title: "디자인",
    wide: true,
    items: [
      "주보",
      "헌금봉투",
      "현수막(강단/외벽)",
      "배너·X배너·롤업배너",
      "수련회/행사 포스터",
      "초청장",
      "로고 디자인",
      "명함",
      "교회 소식지·뉴스레터",
      "말씀카드",
      "SNS카드뉴스",
      "각종 썸네일",
    ],
  },
];

const generalBusiness = [
  { name: "Creative Agency", items: ["영상프로덕션", "디자인", "IT-개발 에이전시", "이벤트"] },
  { name: "Creative Studio", items: ["음악", "영상", "IP 비즈니스"] },
];

const riseRows = [
  { name: "사역 임팩트 펀드 운영", items: ["재원 조성 및 운용", "기금 운용 및 포트폴리오 관리"] },
  { name: "목적사업 운영", items: ["미래자립교회", "사역단체"] },
  { name: "성과·임팩트 관리", items: ["성과관리 및 확산"] },
];

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

export default function Header({ variant = "static" }: HeaderProps) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState<"intro" | "pledged" | "service">("service");
  const lastScrollY = useRef(0);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (variant !== "sticky") return;

    lastScrollY.current = window.scrollY;
    function onScroll() {
      const currentY = window.scrollY;
      const scrolledDown = currentY > lastScrollY.current;
      setHidden(scrolledDown && currentY > 80);
      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const header = (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <div className={styles.brandArea}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="그룹사 메뉴 열기"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuTab("service");
              setMenuOpen((v) => !v);
            }}
          >
            <span className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen : ""}`} />
          </button>
          <div className={styles.logo} onClick={() => navigate("/")}>
            LOIND
          </div>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/about" className={navLinkClassName}>
            About
          </NavLink>
          <NavLink to="/service" className={navLinkClassName}>
            Service
          </NavLink>
          <NavLink to="/story" className={navLinkClassName}>
            Story
          </NavLink>
          <NavLink to="/contact" className={navLinkClassName}>
            Contact
          </NavLink>
          <div className={styles.navSeparator} />
          <a
            href="https://www.loindworks.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            Works
          </a>
        </nav>
      </div>
      {menuOpen && (
        <>
          <div className={styles.menuBackdrop} onClick={() => setMenuOpen(false)} />
          <div className={styles.menuPanel}>
            <div className={`container ${styles.menuPanelInner}`}>
              <div className={styles.menuSideCol}>
                <button
                  type="button"
                  className={`${styles.menuTabCard} ${menuTab === "service" ? styles.menuTabActive : ""}`}
                  onClick={() => setMenuTab("service")}
                >
                  <span className={styles.menuEyebrow}>SERVICE</span>
                  <span className={styles.menuCardTitle}>서비스 항목</span>
                </button>
                <div className={styles.menuSideDivider} />
                <button
                  type="button"
                  className={`${styles.menuTabCard} ${menuTab === "intro" ? styles.menuTabActive : ""}`}
                  onClick={() => setMenuTab("intro")}
                >
                  <span className={styles.menuEyebrow}>ABOUT</span>
                  <span className={styles.menuCardTitle}>그룹 소개</span>
                </button>
                <button
                  type="button"
                  className={`${styles.menuTabCard} ${menuTab === "pledged" ? styles.menuTabActive : ""}`}
                  onClick={() => setMenuTab("pledged")}
                >
                  <span className={styles.menuEyebrow}>LOIND</span>
                  <span className={styles.menuCardTitle}>PLEDGED</span>
                </button>
              </div>

              <div className={styles.menuMainCol}>
                {menuTab === "intro" && (
                  <section className={styles.menuPanelBlock}>
                    <h4 className={styles.menuBlockTitle}>그룹 소개</h4>
                    <p className={styles.menuIntroText}>
                      로인드는 크리에이티브 에이전시, 크리에이티브 스튜디오, 임팩트 브랜드 등 여러 브랜드를 통해
                      크리스천 정체성을 담은 사업을 운영하며, 각자의 자리에서 세상에 선한 영향력을 전합니다.
                    </p>
                    <Link to="/about" className={styles.menuGoLink} onClick={closeMenu}>
                      그룹 소개 페이지 보기 →
                    </Link>
                  </section>
                )}

                {menuTab === "pledged" && (
                  <section className={styles.menuPanelBlock}>
                    <h4 className={styles.menuBlockTitle}>LOIND PLEDGED</h4>
                    <p className={styles.menuIntroText}>준비 중입니다.</p>
                  </section>
                )}

                {menuTab === "service" && (
                  <>
                    <section className={styles.menuPanelBlock}>
                      <h4 className={styles.menuBlockTitle}>일반비즈니스</h4>
                      <div className={styles.menuGroupGrid}>
                        {generalBusiness.map((row) => (
                          <div key={row.name} className={`${styles.menuHRow} ${styles.menuCat}`}>
                            <div className={styles.menuHRowTitle}>
                              <span className={styles.menuPill}>{row.name}</span>
                            </div>
                            <div className={styles.menuInline}>
                              {row.items.map((item) => (
                                <p key={item} className={styles.menuColItem}>{item}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className={styles.menuPanelBlock}>
                      <h4 className={styles.menuBlockTitle}>크리스천비즈니스</h4>

                      <Link to="/artisan" className={styles.menuSubBar} onClick={closeMenu}>
                        <span className={styles.menuSubBarName}>아티즌, 기독교 아웃소싱(외주)</span>
                        <span className={styles.menuSubBarGo}>페이지 바로가기 →</span>
                      </Link>
                      <div className={styles.menuCatGrid}>
                        {artisanCategories.map((cat) => (
                          <div
                            key={cat.title}
                            className={`${styles.menuCat} ${cat.wide ? styles.menuCatWide : ""}`}
                          >
                            <p className={`${styles.menuColTitle} ${cat.items.length === 0 ? styles.menuColTitleMuted : ""}`}>
                              {cat.title}
                            </p>
                            <div className={cat.wide ? styles.menuCatItemsWide : styles.menuCatItems}>
                              {cat.items.map((item) => (
                                <p key={item} className={styles.menuColItem}>{item}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={styles.menuSubDivider} />

                      <Link to="/rise" className={styles.menuSubBar} onClick={closeMenu}>
                        <span className={styles.menuSubBarName}>라이즈, 크리스천 사역 인큐베이팅</span>
                        <span className={styles.menuSubBarGo}>페이지 바로가기 →</span>
                      </Link>
                      <div className={styles.menuRiseGrid}>
                        {riseRows.map((row) => (
                          <div key={row.name} className={styles.menuCat}>
                            <p className={styles.menuColTitle}>{row.name}</p>
                            <div className={styles.menuInline}>
                              {row.items.map((item) => (
                                <p key={item} className={styles.menuColItem}>{item}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );

  if (variant === "sticky") {
    return (
      <div
        className={`${styles.stickyChrome} ${hidden ? styles.chromeHidden : ""}`}
      >
        {header}
      </div>
    );
  }

  return header;
}
