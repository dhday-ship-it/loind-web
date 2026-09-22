// Shared by the header mega menu and the Service page (Christian Business tab).

export const artisanCategories: { title: string; items: string[]; wide?: boolean }[] = [
  { title: "홈페이지/웹", items: ["반응형 공식 웹사이트"] },
  { title: "영상", items: ["설교 요약 릴스/쇼츠", "행사 홍보 영상", "강의영상제작", "유튜브 인트로/아웃트로"] },
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

export const riseRows = [
  { name: "사역 임팩트 펀드 운영", items: ["재원 조성 및 운용", "기금 운용 및 포트폴리오 관리"] },
  { name: "목적사업 운영", items: ["미래자립교회", "사역단체"] },
  { name: "성과·임팩트 관리", items: ["성과관리 및 확산"] },
];


export const christianGroups = [
  {
    name: "아티즌",
    nameKo: "기독교 아웃소싱(외주)",
    to: "/artisan",
    cards: artisanCategories.map((c) => ({ label: c.title, items: c.items })),
  },
  {
    name: "라이즈",
    nameKo: "크리스천 사역 인큐베이팅",
    to: "/rise",
    cards: riseRows.map((r) => ({ label: r.name, items: r.items })),
  },
];
