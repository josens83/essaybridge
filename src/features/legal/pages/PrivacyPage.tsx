import { FiShield } from 'react-icons/fi';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <FiShield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">개인정보처리방침</h1>
          <p className="text-gray-600">
            EssayBridge는 회원님의 개인정보를 소중히 다룹니다
          </p>
          <p className="text-sm text-gray-500 mt-2">최종 수정일: 2025년 1월 16일</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose max-w-none">
            <section className="mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                EssayBridge(이하 "회사")는 개인정보보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록
                다음과 같이 개인정보 처리방침을 수립·공개합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제1조 (개인정보의 처리 목적)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li><strong>회원 가입 및 관리</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                    <li>회원자격 유지·관리, 서비스 부정이용 방지</li>
                    <li>각종 고지·통지, 고충처리 목적</li>
                  </ul>
                </li>
                <li><strong>서비스 제공</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>논술 첨삭 서비스 제공</li>
                    <li>온라인 강의 서비스 제공</li>
                    <li>1:1 입시 컨설팅 서비스 제공</li>
                    <li>맞춤형 서비스 제공, 본인 인증</li>
                  </ul>
                </li>
                <li><strong>요금 결제 및 정산</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>유료 서비스 이용에 따른 요금 결제</li>
                    <li>물품 배송, 환불 처리</li>
                  </ul>
                </li>
                <li><strong>마케팅 및 광고에의 활용</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>신규 서비스 개발 및 맞춤 서비스 제공</li>
                    <li>이벤트 및 광고성 정보 제공 및 참여 기회 제공</li>
                    <li>서비스의 유효성 확인, 접속 빈도 파악</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제2조 (개인정보의 처리 및 보유 기간)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
                <li>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                    <li><strong>회원 가입 및 관리:</strong> 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지)</li>
                    <li><strong>서비스 제공:</strong> 서비스 제공 완료 시까지</li>
                    <li><strong>대금 결제 및 재화 등의 공급:</strong> 대금 결제 및 재화 등의 공급 완료 시까지 (단, 전자상거래법에 따라 계약 또는 청약철회 등에 관한 기록은 5년간 보존)</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제3조 (처리하는 개인정보의 항목)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 다음의 개인정보 항목을 처리하고 있습니다:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li><strong>필수 항목</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>학생 회원: 이메일, 비밀번호, 이름, 학년, 목표 대학, 관심 학과</li>
                    <li>튜터 회원: 이메일, 비밀번호, 이름, 학력, 경력, 전문 분야</li>
                  </ul>
                </li>
                <li><strong>선택 항목</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>전화번호, 프로필 사진</li>
                  </ul>
                </li>
                <li><strong>서비스 이용 과정에서 자동으로 생성되어 수집되는 정보</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>IP 주소, 쿠키, 서비스 이용 기록, 방문 기록, 불량 이용 기록</li>
                  </ul>
                </li>
                <li><strong>결제 과정에서 수집되는 정보</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>신용카드 정보, 은행계좌 정보 등 (결제대행사를 통해 처리되며 회사는 최소한의 정보만 보유)</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제4조 (개인정보의 제3자 제공)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</li>
                <li>회사는 현재 개인정보를 제3자에게 제공하고 있지 않습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제5조 (개인정보처리의 위탁)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>결제 처리: PG사 (신용카드 결제, 계좌이체 등)</li>
                    <li>이메일 발송: 이메일 서비스 제공업체</li>
                    <li>클라우드 서버 호스팅: AWS, GCP 등</li>
                  </ul>
                </li>
                <li>회사는 위탁계약 체결 시 개인정보보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제6조 (정보주체의 권리·의무 및 행사 방법)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>개인정보 열람 요구</li>
                    <li>오류 등이 있을 경우 정정 요구</li>
                    <li>삭제 요구</li>
                    <li>처리정지 요구</li>
                  </ul>
                </li>
                <li>제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.</li>
                <li>정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</li>
                <li>제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제7조 (개인정보의 파기)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</li>
                <li>정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</li>
                <li>개인정보 파기의 절차 및 방법은 다음과 같습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li><strong>파기절차:</strong> 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
                    <li><strong>파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제8조 (개인정보의 안전성 확보 조치)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</li>
                <li>쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.</li>
                <li>쿠키의 사용 목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.</li>
                <li>쿠키의 설치·운영 및 거부: 웹브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.</li>
                <li>쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제10조 (개인정보 보호책임자)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">개인정보 보호책임자</p>
                <ul className="text-gray-700 space-y-1">
                  <li>성명: 홍길동</li>
                  <li>직책: CTO</li>
                  <li>이메일: privacy@essaybridge.com</li>
                  <li>전화번호: 1588-0000</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제11조 (개인정보 열람청구)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                정보주체는 개인정보보호법 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">개인정보 열람청구 접수·처리 부서</p>
                <ul className="text-gray-700 space-y-1">
                  <li>부서명: 개인정보보호팀</li>
                  <li>담당자: 김철수</li>
                  <li>이메일: privacy@essaybridge.com</li>
                  <li>전화번호: 1588-0000</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제12조 (권익침해 구제방법)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다:
              </p>
              <ul className="text-gray-700 space-y-2 ml-4">
                <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
                <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
                <li>대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
                <li>경찰청: (국번없이) 182 (ecrm.cyber.go.kr)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제13조 (개인정보 처리방침 변경)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>이 개인정보 처리방침은 2025년 1월 16일부터 적용됩니다.</li>
                <li>이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.</li>
              </ol>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>부칙</strong><br />
                본 개인정보처리방침은 2025년 1월 16일부터 시행됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            개인정보 처리방침에 대한 문의사항이 있으시면{' '}
            <a href="mailto:privacy@essaybridge.com" className="text-primary-600 hover:text-primary-700 font-medium">
              privacy@essaybridge.com
            </a>
            으로 연락주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
