// Data for the Service page's brand-switcher content.
// Ported from legacy/service.html's `brandData` object.

export interface ServiceSubgroup {
  label: string;
  items: string[];
}

export interface ServiceCategory {
  cat: string;
  groups: ServiceSubgroup[];
  icon?: string;
}

export interface LoerBrand {
  standard: string;
  bannerTitle: string;
  sectionTitle: string;
  serviceList: ServiceCategory[];
}

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

export interface DaeheeBanner {
  image: string;
  dDay: string;
  title: string;
  topicLabel: string;
  topic: string;
  verseLabel: string;
  verse: string;
  dateLabel: string;
  date: string;
}

export interface ValueDetailItem {
  label: string;
  detail: string;
}

export interface ValueItem {
  icon: DaeheeIcon;
  name: string;
  nameKo?: string;
  topic: string;
  verse: string;
  desc: string;
  details?: ValueDetailItem[];
}

export interface DaeheeStage {
  name: string;
  line: string;
  desc: string;
  image?: string;
}

export type DaeheeIcon = "fund" | "space" | "community" | "app";

export interface DaeheeServiceItem {
  subtitle: string;
  desc: string;
}

export interface DaeheeService {
  icon: DaeheeIcon;
  title: string;
  items: DaeheeServiceItem[];
  callout?: string;
}

export interface DaeheeBrand {
  subTitle: string;
  bannerTitle: string;
  standardLevel: number;
  standard: string;
  intro: string;
  banner: DaeheeBanner;
  schedule: ValueItem[];
  stages: DaeheeStage[];
  servicesEyebrow: string;
  servicesTitle: string;
  servicesIntro: string;
  services: DaeheeService[];
}

export const loerBrand: LoerBrand = {
  standard:
    '"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters" [Colossians 3:23]',
  bannerTitle: "크리에이티브 에이전시",
  sectionTitle: "주요 비즈니스 및 서비스",
  serviceList: [
    {
      cat: "영상 프로덕션",
      icon: "/icons/video-production.png",
      groups: [
        {
          label: "콘텐츠 영상",
          items: [
            "인터뷰 영상",
            "다큐멘터리",
            "뮤직비디오",
            "브랜드 필름",
            "광고·CF 영상",
            "유튜브 콘텐츠 제작",
            "프로모션 영상",
            "제품 소개 영상",
            "라이브 커머스 영상",
            "강의영상 제작",
          ],
        },
        {
          label: "모션·그래픽",
          items: ["2D 모션 그래픽", "3D 모션 그래픽", "타이포 모션", "CGI 합성", "애니메이션 영상"],
        },
        {
          label: "촬영",
          items: ["행사·컨퍼런스 촬영", "드론 촬영", "제품 촬영"],
        },
        {
          label: "후반작업·사운드",
          items: ["영상 편집·색보정", "자막·더빙", "상업 음향"],
        },
      ],
    },
    {
      cat: "디자인",
      icon: "/icons/design.png",
      groups: [
        {
          label: "브랜딩",
          items: ["브랜드 아이덴티티(BI/CI)", "로고 디자인", "캐릭터 디자인"],
        },
        {
          label: "마케팅·콘텐츠 디자인",
          items: [
            "상세페이지 디자인",
            "포스터·배너 디자인",
            "카탈로그·브로슈어 디자인",
            "SNS 콘텐츠 디자인",
            "인포그래픽",
            "편집 디자인(출판물)",
          ],
        },
        {
          label: "제품·공간",
          items: ["패키지 디자인", "굿즈 기획", "공간·전시 디자인"],
        },
        {
          label: "디지털 UX",
          items: ["UI/UX 디자인"],
        },
      ],
    },
    {
      cat: "IT개발(앱,웹)",
      icon: "/icons/it-dev.png",
      groups: [
        {
          label: "웹·앱 개발",
          items: ["반응형 웹사이트 제작", "앱 개발", "쇼핑몰 구축", "랜딩페이지 제작", "퍼블리싱"],
        },
        {
          label: "시스템·연동",
          items: ["관리자(어드민) 시스템 개발", "API 연동", "서버·인프라 구축", "챗봇 개발"],
        },
        {
          label: "AI·운영",
          items: ["생성형 AI 활용", "유지보수"],
        },
      ],
    },
    {
      cat: "온라인·오프라인 세미나",
      icon: "/icons/seminar.png",
      groups: [
        {
          label: "온라인",
          items: ["웨비나 기획·운영", "라이브 스트리밍", "온라인 강연 진행", "온라인 설문·투표 운영", "녹화본 편집·아카이빙"],
        },
        {
          label: "오프라인",
          items: [
            "세미나·강연 기획",
            "컨퍼런스 기획",
            "워크숍 진행",
            "패널 토론 진행",
            "현장 진행",
            "행사 사회·MC 섭외",
            "오프라인 대관·장소 섭외",
          ],
        },
        {
          label: "부가 서비스",
          items: ["발표자료·굿즈 제작 연계", "다국어 동시통역 지원"],
        },
      ],
    },
  ],
};

export const lodnBrand: LodnBrand = {
  bannerTitle: "Studio LODN",
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

export const daeheeBrand: DaeheeBrand = {
  subTitle: "IMPACT BRAND",
  bannerTitle: "Impact",
  standardLevel: 2,
  standard: "TBD",
  intro:
    "Impact는 LOIND의 임팩트 브랜드입니다. 기쁨은 머무르지 않는다고 믿습니다. 한 사람에게서 시작된 기쁨은 삶이 되고, 결국 곁으로 번져나갑니다.",
  banner: {
    image: "/INDEX_DAEHEE.png",
    dDay: "D-129",
    title: "Impact",
    topicLabel: "",
    topic: "",
    verseLabel: "",
    verse: "",
    dateLabel: "",
    date: "하나님과 사람 사이에서 축복의 통로 쓰임받는 일들을 만들어갑니다",
  },
  schedule: [
    {
      icon: "fund",
      name: "Plord: Christian life Movement",
      nameKo: "플로드: 크리스천 라이프 무브먼트",
      topic: "",
      verse: "",
      desc: "",
      details: [
        { label: "크리스천 플랫폼 : 닛시", detail: "TBD" },
        { label: "미래자립교회 : 야하드", detail: "TBD" },
      ],
    },
  ],
  stages: [
    {
      name: "누림",
      line: "먼저, 있는 그대로 누립니다",
      desc: "조건 없이 주어지는 기쁨을 발견하고 받아들이는 시작",
      image: "/DH_G.png",
    },
    {
      name: "됨",
      line: "그 기쁨이 삶의 모양이 됩니다",
      desc: "누린 기쁨이 태도가 되고, 하루의 선택이 되는 과정",
      image: "/DH_M.png",
    },
  ],
  servicesEyebrow: "번짐의 통로",
  servicesTitle: "기쁨이 흘러가는 네 가지 통로",
  servicesIntro:
    "Impact는 아래 네 가지 통로를 통해 누군가에게서 시작된 기쁨이 실제로 흘러가도록 만듭니다.",
  services: [
    {
      icon: "fund",
      title: "기금",
      items: [
        {
          subtitle: "지속 가능한 나눔의 재원",
          desc: "후원과 협력을 통해 모인 기금으로 Impact의 활동을 지속적으로 운영합니다.",
        },
        {
          subtitle: "필요 중심의 배분",
          desc: "공간 운영, 모임 지원, 자립 프로그램 등 실제 필요가 있는 곳에 우선 사용됩니다.",
        },
      ],
      callout:
        "모인 기금은 Impact가 운영하는 공간과 커뮤니티 모임, 자립을 위한 프로그램에 직접 쓰입니다. 기쁨은 흘러갈 때 비로소 완성된다는 믿음이 기금 운영의 기준입니다.",
    },
    {
      icon: "space",
      title: "공간",
      items: [
        {
          subtitle: "머무를 수 있는 거점",
          desc: "사람이 모이고 쉬며 서로를 알아갈 수 있는 물리적 공간을 마련합니다.",
        },
        {
          subtitle: "지역에 맞는 운영",
          desc: "지역 사회의 필요와 상황에 맞춰 공간의 쓰임을 유연하게 조정합니다.",
        },
      ],
    },
    {
      icon: "community",
      title: "커뮤니티 모임",
      items: [
        {
          subtitle: "정기 모임",
          desc: "삶에 스며든 기쁨을 나누고 서로의 이야기를 확인하는 정기적인 자리를 만듭니다.",
        },
        {
          subtitle: "관계의 지속",
          desc: "한 번의 만남에 그치지 않고, 꾸준히 이어지는 관계를 지원합니다.",
        },
      ],
    },
    {
      icon: "app",
      title: "앱",
      items: [
        {
          subtitle: "일상 속 연결",
          desc: "언제 어디서든 Impact의 활동과 모임 소식에 참여할 수 있는 디지털 창구입니다.",
        },
        {
          subtitle: "참여의 진입점",
          desc: "처음 Impact를 접하는 사람도 쉽게 흐름에 합류할 수 있도록 돕습니다.",
        },
      ],
    },
  ],
};
