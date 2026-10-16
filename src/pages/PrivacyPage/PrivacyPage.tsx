import { useEffect } from "react";
import { COMPANY } from "../../data/company";
import styles from "./PrivacyPage.module.css";

// 로인드 그룹 통합 개인정보처리방침 (loind.com/privacy)
// 공통 내용은 한 번만, 서비스마다 다른 수집 항목·목적·보유 기간은 [서비스별 처리 내용]에 서비스 단위로 추가한다.
// ※ 새 서비스가 개인정보를 받기 시작하면 SERVICES 에 항목을 추가하고, 시행일을 갱신해주세요.
const EFFECTIVE_DATE = "2026년 10월 16일";

interface ServiceRecord {
  name: string; // 서비스 이름
  site: string; // 정보를 받는 곳
  required: string;
  optional?: string;
  extra?: string;
  purpose: string[];
  retention: string;
}

const SERVICES: ServiceRecord[] = [
  {
    name: "아티즌 (LOIND ARTISAN) — 작업 의뢰",
    site: "artisan.loind.com 의뢰 신청서",
    required: "성함, 연락처(휴대전화 번호), 의뢰 내용",
    optional: "이메일, 소속(교회·단체·회사명), 참고 파일",
    extra: "실물 납품을 선택한 경우: 받으실 주소, 받는 분 성함·연락처",
    purpose: [
      "의뢰 접수 확인 및 상담, 견적 안내",
      "작업 진행 상황 안내 및 결과물 전달",
      "실물 제작물의 배송",
      "문의 응대 및 분쟁이 생겼을 때 사실 확인",
    ],
    retention: "의뢰 완료(또는 취소)일로부터 1년",
  },
];

const PROCESSORS = [
  { name: "Supabase Inc.", task: "서비스 데이터 저장 (데이터베이스, 서울 리전)" },
  { name: "Vercel Inc.", task: "웹사이트·서버 운영, 첨부 파일 저장" },
  { name: "Google LLC", task: "접수 알림 메일 발송 (Gmail)" },
];

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className={`container ${styles.privacy}`}>
      <p className={styles.eyebrow}>Privacy Policy</p>
      <h1 className={styles.title}>개인정보처리방침</h1>
      <p className={styles.lead}>
        {COMPANY.name}(이하 ‘회사’)는 로인드 홈페이지와 아티즌·로든·라이즈 등 회사가 운영하는 모든 서비스(이하 ‘서비스’)에서
        이용자의 개인정보를 소중히 다루며, 「개인정보 보호법」 등 관련 법령을 지킵니다. 이 방침은 회사의 모든 서비스에 공통으로
        적용되며, 서비스마다 다른 내용은 ‘서비스별 처리 내용’에 따로 적었습니다.
      </p>

      <section>
        <h2>1. 서비스별 처리 내용</h2>
        <p>회사는 아래 서비스에서, 적힌 목적에 필요한 만큼만 개인정보를 받습니다.</p>
        {SERVICES.map((s) => (
          <div key={s.name} className={styles.service}>
            <h3>{s.name}</h3>
            <dl>
              <dt>수집하는 곳</dt>
              <dd>{s.site}</dd>
              <dt>수집 항목</dt>
              <dd>
                <b>필수</b> {s.required}
                {s.optional && (
                  <>
                    <br />
                    <b>선택</b> {s.optional}
                  </>
                )}
                {s.extra && (
                  <>
                    <br />
                    {s.extra}
                  </>
                )}
              </dd>
              <dt>이용 목적</dt>
              <dd>
                <ul>
                  {s.purpose.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </dd>
              <dt>보유 기간</dt>
              <dd>{s.retention} (관련 법령에 따라 보관이 필요한 경우 그 기간까지)</dd>
            </dl>
          </div>
        ))}
        <p className={styles.muted}>
          로인드 홈페이지(loind.com)는 방문자에게 개인정보를 입력받지 않습니다. 서비스 이용 과정에서 접속 기록, 브라우저 정보 같은
          정보가 자동으로 만들어져 저장될 수 있습니다.
        </p>
      </section>

      <section>
        <h2>2. 법령에 따른 보관</h2>
        <p>관련 법령에 따라 보관해야 하는 정보는 아래 기간 동안 보관합니다.</p>
        <ul>
          <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
          <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (같은 법)</li>
          <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (같은 법)</li>
        </ul>
      </section>

      <section>
        <h2>3. 개인정보의 제3자 제공</h2>
        <p>
          회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만 실물 제작물 배송을 위해 택배사에 받는 분의
          성함·연락처·주소를 전달하는 경우, 그리고 법령에 따라 요구되는 경우는 예외로 합니다.
        </p>
      </section>

      <section>
        <h2>4. 개인정보 처리의 위탁</h2>
        <p>회사는 원활한 서비스 운영을 위해 아래와 같이 개인정보 처리 업무를 맡기고 있습니다.</p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>위탁받는 자</th>
              <th>위탁 업무</th>
            </tr>
          </thead>
          <tbody>
            {PROCESSORS.map((p) => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>{p.task}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>5. 개인정보의 파기</h2>
        <p>
          보유 기간이 지나거나 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자 파일은 복구할 수 없는 방법으로 삭제하고, 종이
          문서는 분쇄하거나 소각합니다.
        </p>
      </section>

      <section>
        <h2>6. 이용자의 권리</h2>
        <p>
          이용자는 언제든지 자신의 개인정보를 열람·정정·삭제하거나 처리 정지를 요청할 수 있습니다. 아래 개인정보 보호책임자에게
          이메일로 요청하시면 지체 없이 처리하겠습니다.
        </p>
      </section>

      <section>
        <h2>7. 개인정보 보호책임자</h2>
        <ul>
          <li>
            성명: {COMPANY.privacyOfficer.name} ({COMPANY.privacyOfficer.title})
          </li>
          <li>
            이메일: <a href={`mailto:${COMPANY.privacyOfficer.email}`}>{COMPANY.privacyOfficer.email}</a>
          </li>
        </ul>
        <p className={styles.muted}>
          개인정보 침해에 대한 신고나 상담이 필요하시면 개인정보침해신고센터(privacy.kisa.or.kr, 국번없이 118),
          개인정보분쟁조정위원회(kopico.go.kr, 1833-6972)에 문의하실 수 있습니다.
        </p>
      </section>

      <section>
        <h2>8. 방침의 변경</h2>
        <p>이 방침은 {EFFECTIVE_DATE}부터 적용됩니다. 내용이 바뀌면 시행 7일 전부터 이 페이지에 알려드립니다.</p>
      </section>
    </main>
  );
}
