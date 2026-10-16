// 회사(사업자) 정보 — 하단 푸터와 통합 개인정보처리방침에서 함께 사용
// ※ 아티즌 사이트(LOIND-아티즌/src/company.js)에도 같은 값이 있으니 바뀌면 함께 수정해주세요.
// ※ 비어 있는 값(bizNumber, phone)은 확인되면 채워주세요. 비어 있으면 화면에 표시되지 않습니다.
export const COMPANY = {
  name: "주식회사 로인드",
  ceo: "정대희",
  bizNumber: "", // 사업자등록번호 (예: 000-00-00000)
  address: "경기 부천시 원미구 소향로 131, 7층 726호 (중동워크리움)",
  phone: "", // 대표 전화
  email: "contact@loind.com",
  privacyOfficer: { name: "정대희", title: "대표이사", email: "contact@loind.com" },
};

// 통합 개인정보처리방침 주소 (로인드 그룹 전 서비스 공통)
export const PRIVACY_URL = "https://loind.com/privacy";
