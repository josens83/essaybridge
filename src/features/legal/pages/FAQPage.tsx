import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'service', label: '서비스 이용' },
    { id: 'pricing', label: '요금제' },
    { id: 'essay', label: '논술 첨삭' },
    { id: 'course', label: '온라인 강의' },
    { id: 'consulting', label: '컨설팅' },
    { id: 'payment', label: '결제/환불' },
    { id: 'account', label: '계정 관리' },
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'service',
      question: 'EssayBridge는 어떤 서비스인가요?',
      answer: 'EssayBridge는 대학 입시를 준비하는 학생들을 위한 종합 논술 첨삭 및 컨설팅 플랫폼입니다. 전문 튜터의 1:1 논술 첨삭, 입시 전략 컨설팅, 온라인 강의, 그리고 학생들을 위한 커뮤니티를 제공합니다.',
    },
    {
      id: '2',
      category: 'service',
      question: '회원가입은 어떻게 하나요?',
      answer: '홈페이지 상단의 "회원가입" 버튼을 클릭하시면 됩니다. 이메일 주소와 기본 정보를 입력하시고, 학생 또는 튜터 중 본인의 역할을 선택하시면 가입이 완료됩니다.',
    },
    {
      id: '3',
      category: 'pricing',
      question: '요금제는 어떻게 되나요?',
      answer: '무료, 베이직(월 99,000원), 프리미엄(월 199,000원) 총 3가지 요금제를 제공합니다. 무료 플랜은 기본적인 커뮤니티 이용이 가능하며, 베이직과 프리미엄 플랜은 논술 첨삭, 온라인 강의, 컨설팅 등의 서비스를 제공합니다. 연간 결제 시 20% 할인 혜택이 있습니다.',
    },
    {
      id: '4',
      category: 'pricing',
      question: '무료 체험이 가능한가요?',
      answer: '네, 가능합니다. 회원가입 후 베이직 또는 프리미엄 요금제를 선택하시면 첫 7일간 무료로 이용하실 수 있습니다. 체험 기간 동안 언제든지 취소 가능하며, 취소 시 요금이 청구되지 않습니다.',
    },
    {
      id: '5',
      category: 'essay',
      question: '논술 첨삭은 얼마나 걸리나요?',
      answer: '일반적으로 논술 제출 후 2~3일 이내에 첨삭이 완료됩니다. 프리미엄 플랜 가입자의 경우 우선 첨삭 서비스가 제공되어 24~48시간 이내에 첨삭을 받으실 수 있습니다.',
    },
    {
      id: '6',
      category: 'essay',
      question: '첨삭은 어떤 방식으로 진행되나요?',
      answer: '전문 튜터가 제출하신 논술을 꼼꼼히 검토하여 문법, 논리, 표현, 구조, 내용 등 5가지 항목으로 나누어 첨삭합니다. 각 부분에 대한 상세한 코멘트와 함께 전체적인 평가 및 개선 방향을 제시해드립니다.',
    },
    {
      id: '7',
      category: 'essay',
      question: '같은 논술을 여러 번 첨삭받을 수 있나요?',
      answer: '네, 가능합니다. 첨삭을 받은 후 수정한 논술을 다시 제출하시면 재첨삭을 받으실 수 있습니다. 단, 요금제에 따라 월별 첨삭 가능 횟수가 제한될 수 있습니다.',
    },
    {
      id: '8',
      category: 'course',
      question: '온라인 강의는 어떻게 수강하나요?',
      answer: '"온라인 강의" 메뉴에서 원하시는 강의를 선택하고 수강 신청을 하시면 됩니다. 베이직 플랜 이상 가입자는 대부분의 강의를 무료로 수강하실 수 있으며, 일부 프리미엄 강의는 별도 결제가 필요할 수 있습니다.',
    },
    {
      id: '9',
      category: 'course',
      question: '강의 영상은 언제든지 볼 수 있나요?',
      answer: '네, 수강 신청한 강의는 언제든지 반복해서 시청하실 수 있습니다. 모바일, 태블릿, PC 등 다양한 기기에서 학습이 가능하며, 진도율도 자동으로 저장됩니다.',
    },
    {
      id: '10',
      category: 'consulting',
      question: '컨설팅은 어떻게 신청하나요?',
      answer: '"입시 컨설팅" 메뉴에서 원하시는 컨설턴트와 상담 유형을 선택하신 후, 희망하시는 날짜와 시간을 예약하시면 됩니다. 프리미엄 플랜 가입자는 월 4회까지 무료로 컨설팅을 받으실 수 있습니다.',
    },
    {
      id: '11',
      category: 'consulting',
      question: '컨설팅은 어떤 방식으로 진행되나요?',
      answer: '화상 회의 또는 전화 상담 중 선택하실 수 있습니다. 1회당 50분간 진행되며, 입시 전략, 학과 선택, 논술 전략, 자기소개서 작성 등 다양한 주제로 상담이 가능합니다.',
    },
    {
      id: '12',
      category: 'payment',
      question: '결제 수단은 무엇이 있나요?',
      answer: '신용카드, 체크카드, 계좌이체, 휴대폰 결제 등 다양한 결제 수단을 지원합니다. 정기 결제의 경우 신용카드 또는 계좌이체만 가능합니다.',
    },
    {
      id: '13',
      category: 'payment',
      question: '환불 정책은 어떻게 되나요?',
      answer: '서비스 이용 전 7일 이내에는 전액 환불이 가능합니다. 이용 후에는 잔여 기간에 대해 일할 계산하여 환불해드립니다. 단, 이미 제공된 첨삭이나 컨설팅 서비스에 대한 비용은 공제될 수 있습니다.',
    },
    {
      id: '14',
      category: 'payment',
      question: '요금제는 언제든지 변경할 수 있나요?',
      answer: '네, 언제든지 요금제를 업그레이드하거나 다운그레이드하실 수 있습니다. 업그레이드 시에는 즉시 적용되며, 다운그레이드 시에는 다음 결제일부터 적용됩니다.',
    },
    {
      id: '15',
      category: 'account',
      question: '비밀번호를 잊어버렸어요.',
      answer: '로그인 페이지의 "비밀번호 찾기"를 클릭하시면 가입하신 이메일로 비밀번호 재설정 링크가 발송됩니다. 링크를 통해 새로운 비밀번호를 설정하실 수 있습니다.',
    },
    {
      id: '16',
      category: 'account',
      question: '회원 탈퇴는 어떻게 하나요?',
      answer: '프로필 설정 페이지에서 "계정 관리" 탭으로 이동하신 후 "회원 탈퇴" 버튼을 클릭하시면 됩니다. 탈퇴 시 모든 개인 정보와 학습 기록이 삭제되며, 복구가 불가능하니 신중하게 결정해주세요.',
    },
    {
      id: '17',
      category: 'service',
      question: '튜터로 활동하고 싶은데 어떻게 신청하나요?',
      answer: '홈페이지 하단의 "튜터 지원" 링크를 통해 지원서를 제출하실 수 있습니다. 학력, 경력 등을 검토한 후 적격 여부를 판단하여 연락드립니다. 튜터로 승인되면 전용 대시보드를 통해 학생들의 논술을 첨삭하고 수익을 얻으실 수 있습니다.',
    },
  ];

  const filteredFAQs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <FiHelpCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">자주 묻는 질문</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            EssayBridge 서비스에 대해 궁금하신 점을 확인해보세요.
          </p>
        </div>

        {/* Category Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="transition-colors hover:bg-gray-50">
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedId === faq.id ? (
                      <FiChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                {expandedId === faq.id && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            원하시는 답변을 찾지 못하셨나요?
          </h2>
          <p className="text-gray-600 mb-6">
            고객 지원팀이 도와드리겠습니다. 언제든지 문의해주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@essaybridge.com"
              className="btn-primary"
            >
              이메일 문의
            </a>
            <Link
              to="/community"
              className="btn-outline"
            >
              커뮤니티 방문
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">이메일</h3>
                <p className="text-gray-600">support@essaybridge.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">전화</h3>
                <p className="text-gray-600">1588-0000</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">운영 시간</h3>
                <p className="text-gray-600">평일 09:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
