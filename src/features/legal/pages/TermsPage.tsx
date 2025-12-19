import { FiFileText } from 'react-icons/fi';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <FiFileText className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">이용약관</h1>
          <p className="text-gray-600">
            EssayBridge 서비스 이용약관
          </p>
          <p className="text-sm text-gray-500 mt-2">최종 수정일: 2025년 1월 16일</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관은 EssayBridge(이하 "회사")가 제공하는 논술 첨삭 및 입시 컨설팅 서비스(이하 "서비스")의 이용과 관련하여
                회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제2조 (정의)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>"서비스"란 회사가 제공하는 논술 첨삭, 온라인 강의, 입시 컨설팅, 커뮤니티 등 모든 서비스를 의미합니다.</li>
                <li>"회원"이란 본 약관에 동의하고 회사와 이용계약을 체결한 자를 말합니다.</li>
                <li>"학생 회원"이란 논술 첨삭 및 컨설팅 서비스를 이용하는 회원을 말합니다.</li>
                <li>"튜터 회원"이란 논술 첨삭 및 컨설팅 서비스를 제공하는 회원을 말합니다.</li>
                <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 이메일 주소를 말합니다.</li>
                <li>"비밀번호"란 회원의 비밀 보호를 위해 회원 자신이 설정한 문자와 숫자의 조합을 말합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.</li>
                <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
                <li>약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 공지하며, 중요한 변경사항의 경우 30일 전에 공지합니다.</li>
                <li>회원이 변경된 약관에 동의하지 않을 경우, 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제4조 (회원가입)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회원가입은 이용자가 본 약관의 내용에 동의한 후 회원가입 신청을 하고 회사가 이를 승인함으로써 체결됩니다.</li>
                <li>회원가입 신청 시 제공되는 정보는 실제 정보와 일치해야 하며, 허위 정보 제공 시 서비스 이용이 제한될 수 있습니다.</li>
                <li>만 14세 미만의 아동은 회원가입을 할 수 없습니다.</li>
                <li>회사는 다음 각 호에 해당하는 경우 회원가입을 승인하지 않을 수 있습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                    <li>허위 정보를 기재하거나 회사가 요구하는 내용을 기재하지 않은 경우</li>
                    <li>이전에 회원 자격을 상실한 적이 있는 경우</li>
                    <li>기타 회원으로 등록하는 것이 회사의 기술상 또는 업무상 현저히 지장이 있다고 판단되는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제5조 (서비스의 제공)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사는 다음과 같은 서비스를 제공합니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>논술 첨삭 서비스</li>
                    <li>온라인 강의 서비스</li>
                    <li>1:1 입시 컨설팅 서비스</li>
                    <li>학습 커뮤니티 서비스</li>
                    <li>기타 회사가 추가 개발하거나 제휴 계약 등을 통해 제공하는 서비스</li>
                  </ul>
                </li>
                <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
                <li>회사는 시스템 점검, 보수, 교체 등 필요한 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제6조 (유료 서비스)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사는 무료 및 유료 서비스를 제공하며, 유료 서비스 이용 시 해당 요금을 지불해야 합니다.</li>
                <li>유료 서비스의 요금 및 결제 방법은 각 서비스 페이지에 명시됩니다.</li>
                <li>유료 서비스는 월간 또는 연간 정기결제 방식으로 제공되며, 자동갱신을 원칙으로 합니다.</li>
                <li>회원이 유료 서비스 이용을 해지할 경우, 해당 결제 주기 종료일까지 서비스가 제공됩니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제7조 (환불 정책)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>유료 서비스 결제 후 7일 이내에 서비스를 이용하지 않은 경우 전액 환불이 가능합니다.</li>
                <li>서비스 이용 후에는 잔여 기간에 대해 일할 계산하여 환불하되, 이미 제공된 첨삭 및 컨설팅 서비스 비용은 공제됩니다.</li>
                <li>회원의 귀책사유로 인한 해지의 경우 환불이 제한될 수 있습니다.</li>
                <li>환불은 결제 수단에 따라 3~7영업일이 소요될 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제8조 (회원의 의무)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회원은 다음 행위를 하여서는 안 됩니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>신청 또는 변경 시 허위 내용의 등록</li>
                    <li>타인의 정보 도용</li>
                    <li>회사가 게시한 정보의 변경</li>
                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                    <li>회사 및 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>회사 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                    <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                  </ul>
                </li>
                <li>회원은 관계 법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항을 준수해야 합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제9조 (회사의 의무)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사는 관련 법령과 본 약관을 준수하며, 지속적이고 안정적인 서비스 제공을 위해 최선을 다합니다.</li>
                <li>회사는 회원의 개인정보 보호를 위해 보안 시스템을 구축하며 개인정보처리방침을 공시하고 준수합니다.</li>
                <li>회사는 서비스 이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정할 경우 이를 처리합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제10조 (저작권의 귀속)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.</li>
                <li>회원이 서비스 내에 게시한 게시물의 저작권은 해당 회원에게 귀속됩니다.</li>
                <li>회원은 서비스를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 등 기타 방법으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제11조 (계약 해지 및 이용 제한)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회원은 언제든지 회원 탈퇴를 통해 이용계약을 해지할 수 있습니다.</li>
                <li>회사는 회원이 본 약관을 위반한 경우 사전 통보 후 계약을 해지하거나 서비스 이용을 제한할 수 있습니다.</li>
                <li>회사는 회원이 3개월 이상 서비스를 이용하지 않은 경우 회원 정보 보호를 위해 이용을 제한할 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제12조 (면책 조항)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
                <li>회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</li>
                <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않습니다.</li>
                <li>회사는 회원이 게재한 정보, 자료, 사실의 신뢰도, 정확성 등에 대해서는 책임을 지지 않습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제13조 (분쟁 해결)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>회사와 회원 간 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.</li>
                <li>본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.</li>
              </ol>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>부칙</strong><br />
                본 약관은 2025년 1월 16일부터 시행됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            이용약관에 대한 문의사항이 있으시면{' '}
            <a href="mailto:support@essaybridge.com" className="text-primary-600 hover:text-primary-700 font-medium">
              support@essaybridge.com
            </a>
            으로 연락주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
