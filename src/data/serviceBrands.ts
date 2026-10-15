// Data for the Service page's brand-switcher content.
// Ported from legacy/service.html's `brandData` object.

export interface ServiceItemCard {
  name: string;
  image?: string;
}

export interface ServiceCategory {
  cat: string;
  catSub?: string; // 카테고리 이름 아래 작은 보조 문구 (예: "(+납품 서비스)")
  cards?: ServiceItemCard[];
  cardsNote?: string;
  icon?: string;
}

export interface ArtisanBrand {
  standard: string;
  bannerTitle: string;
  sectionTitle: string;
  serviceList: ServiceCategory[];
}

export interface VideoProcessStep {
  name: string;
  included: boolean;
}

export interface VideoGenre {
  name: string;
  image?: string;
  processes: VideoProcessStep[];
}

// 영상 프로덕션: 장르 선택 → 필요한 공정을 보여주는 구성.
export const videoProductionGenres: VideoGenre[] = [
  {
    name: "스케치영상",
    image: "/img/video-genre-sketch.jpg",
    processes: [
      { name: "촬영", included: true },
      { name: "모션·그래픽", included: true },
    ],
  },
  {
    name: "강의영상",
    image: "/img/video-genre-lecture.jpg",
    processes: [
      { name: "촬영", included: true },
      { name: "모션·그래픽", included: false },
    ],
  },
  {
    name: "홍보영상",
    image: "/img/video-genre-promo.jpg",
    processes: [
      { name: "촬영", included: true },
      { name: "모션·그래픽", included: true },
    ],
  },
  {
    name: "인터뷰영상",
    image: "/img/video-genre-interview-v3.jpg",
    processes: [
      { name: "촬영", included: true },
      { name: "모션·그래픽", included: false },
    ],
  },
];

export interface LodnFeature {
  image: string;
  alt: string;
  title: string;
  desc: string;
}

export interface LodnBrand {
  bannerTitle: string;
  standard: string;
  features: LodnFeature[];
}

export const artisanBrand: ArtisanBrand = {
  standard:
    '"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters" [Colossians 3:23]',
  bannerTitle: "아티즌",
  sectionTitle: "주요 비즈니스 및 서비스",
  serviceList: [
    {
      cat: "영상 프로덕션",
      icon: "/icons/video-production.png",
    },
    {
      cat: "디자인",
      catSub: "(+납품 서비스)",
      icon: "/icons/design.png",
      cards: [
        { name: "로고 디자인", image: "/img/design-logo.jpg" },
        { name: "캐릭터 디자인", image: "/img/design-character-v2.jpg" },
        { name: "포스터·배너 디자인", image: "/img/design-promo-goods-v3.jpg" },
        { name: "각종 판촉물", image: "/img/design-promo-items.jpg" },
      ],
      cardsNote:
        "인쇄 서비스까지 지원하고 있습니다.\n(디자인부터 납품까지 합리적인 가격으로 만나보세요)",
    },
    {
      cat: "IT개발(앱,웹)",
      icon: "/icons/it-dev.png",
      cards: [
        { name: "웹 개발(+관리)", image: "/img/itdev-web-v2.jpg" },
        { name: "앱 개발(관리)" },
      ],
    },
    {
      cat: "온라인·오프라인 세미나",
      icon: "/icons/seminar.png",
      cards: [
        { name: "오프라인 세미나", image: "/img/seminar-offline.jpg" },
        { name: "온라인세미나(웹 세미나)", image: "/img/seminar-online.jpg" },
      ],
    },
  ],
};

export const lodnBrand: LodnBrand = {
  bannerTitle: "로든",
  standard:
    '"Let everything that has breath praise the Lord. Praise the Lord." (Psalm 150:6)',
  features: [
    {
      image: "/LODN.S.M.png",
      alt: "음악콘텐츠",
      title: "음악콘텐츠",
      desc: "오리지널 음원과 사운드 콘텐츠를 기획하고 제작합니다.",
    },
    {
      image: "/LODN.S.V.png",
      alt: "영상콘텐츠",
      title: "영상 콘텐츠",
      desc: "몰입감 있는 영상 콘텐츠로 이야기를 전합니다.",
    },
    {
      image: "/LODN.S.IP.png",
      alt: "IP비즈니스",
      title: "IP 비즈니스",
      desc: "자체 IP를 발굴하고 다양한 채널로 확장합니다.",
    },
  ],
};

