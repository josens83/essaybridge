import { useState } from 'react';
import { FiBell, FiChevronRight } from 'react-icons/fi';

interface NoticeItem {
  id: string;
  category: 'update' | 'event' | 'maintenance' | 'notice';
  title: string;
  content: string;
  date: string;
  isImportant: boolean;
}

const Notice = () => {
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const notices: NoticeItem[] = [
    {
      id: '1',
      category: 'update',
      title: '새로운 검색 기능 및 튜터 대시보드 업데이트',
      content: `안녕하세요, EssayBridge입니다.

더 나은 서비스 제공을 위해 새로운 기능들을 업데이트했습니다.

주요 업데이트 내용:
1. 통합 검색 기능
   - 논술, 강의, 커뮤니티를 한 번에 검색할 수 있습니다
   - 카테고리별 필터링 기능 추가
   - 헤더에서 빠르게 검색 가능

2. 튜터 전용 대시보드
   - 학생 관리 및 통계 확인
   - 대기 중인 첨삭 목록 한눈에 보기
   - 상담 일정 관리 개선

3. UI/UX 개선
   - 더 직관적인 사용자 인터페이스
   - 모바일 반응형 디자인 개선
   - 로딩 속도 최적화

앞으로도 더 나은 서비스로 보답하겠습니다.
감사합니다.`,
      date: '2025-01-16',
      isImportant: true,
    },
    {
      id: '2',
      category: 'event',
      title: '신규 회원 이벤트 - 첫 달 50% 할인',
      content: `EssayBridge와 함께 대학 입시를 준비하세요!

신규 회원 대상 특별 이벤트를 진행합니다.

이벤트 내용:
- 베이직 플랜: 월 99,000원 → 49,500원 (첫 달)
- 프리미엄 플랜: 월 199,000원 → 99,500원 (첫 달)

이벤트 기간:
- 2025년 1월 20일 ~ 2025년 2월 28일

혜택:
- 첫 달 50% 할인
- 무료 1:1 컨설팅 1회 추가 제공
- 입시 가이드북 PDF 무료 제공

참여 방법:
1. 회원가입
2. 베이직 또는 프리미엄 플랜 선택
3. 결제 시 자동 할인 적용

이번 기회를 놓치지 마세요!`,
      date: '2025-01-15',
      isImportant: false,
    },
    {
      id: '3',
      category: 'maintenance',
      title: '정기 서버 점검 안내 (1월 21일)',
      content: `안정적인 서비스 제공을 위한 정기 서버 점검을 실시합니다.

점검 일시:
- 2025년 1월 21일 (화) 02:00 ~ 05:00 (3시간)

점검 내용:
- 서버 보안 업데이트
- 데이터베이스 최적화
- 시스템 안정화 작업

영향:
- 점검 시간 동안 서비스 이용이 일시적으로 중단됩니다
- 작업이 조기에 완료될 경우 서비스를 조기에 재개할 예정입니다

양해 부탁드립니다.`,
      date: '2025-01-14',
      isImportant: true,
    },
    {
      id: '4',
      category: 'notice',
      title: 'EssayBridge 서비스 정식 오픈',
      content: `안녕하세요, EssayBridge입니다.

대학 입시를 준비하는 학생들을 위한 종합 논술 플랫폼 EssayBridge가 정식으로 오픈했습니다!

제공 서비스:
1. 논술 첨삭 서비스
   - 전문 튜터의 1:1 맞춤 첨삭
   - 문법, 논리, 표현, 구조, 내용 5가지 항목별 피드백
   - 24시간 우선 첨삭 (프리미엄)

2. 온라인 강의
   - 입시 전문가의 고품질 강의
   - 논술 기본부터 고급까지
   - 언제 어디서나 무제한 수강

3. 1:1 입시 컨설팅
   - 입시 전략 수립
   - 학과 선택 가이드
   - 논술 전략 컨설팅

4. 학습 커뮤니티
   - 정보 공유 및 소통
   - 합격 후기 및 학습 팁
   - 익명 게시 가능

요금제:
- 무료: 커뮤니티 이용
- 베이직 (월 99,000원): 논술 첨삭 월 5회, 강의 무제한, 컨설팅 월 2회
- 프리미엄 (월 199,000원): 논술 첨삭 무제한, 우선 첨삭, 컨설팅 월 4회

합격을 향한 여러분의 여정에 EssayBridge가 함께하겠습니다.
감사합니다.`,
      date: '2025-01-10',
      isImportant: false,
    },
    {
      id: '5',
      category: 'notice',
      title: '튜터 모집 안내',
      content: `EssayBridge에서 함께할 튜터를 모집합니다.

지원 자격:
- 4년제 대학교 재학 이상
- 논술 또는 입시 컨설팅 경험 우대
- 책임감 있고 성실한 분

활동 내용:
- 학생 논술 첨삭 및 피드백
- 1:1 입시 컨설팅
- 온라인 강의 제작 (선택)

혜택:
- 경쟁력 있는 수수료
- 유연한 근무 시간
- 전용 대시보드 제공
- 우수 튜터 인센티브

지원 방법:
- 홈페이지 하단 "튜터 지원" 클릭
- 지원서 작성 및 제출
- 서류 심사 후 면접 진행

많은 관심 부탁드립니다!`,
      date: '2025-01-08',
      isImportant: false,
    },
  ];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'update':
        return '업데이트';
      case 'event':
        return '이벤트';
      case 'maintenance':
        return '점검';
      case 'notice':
        return '공지';
      default:
        return '';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'event':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'notice':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotices =
    categoryFilter === 'all'
      ? notices
      : notices.filter((notice) => notice.category === categoryFilter);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <FiBell className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">공지사항</h1>
          <p className="text-lg text-gray-600">
            EssayBridge의 새로운 소식과 업데이트를 확인하세요
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: '전체' },
              { id: 'update', label: '업데이트' },
              { id: 'event', label: '이벤트' },
              { id: 'maintenance', label: '점검' },
              { id: 'notice', label: '공지' },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  categoryFilter === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notice List or Detail */}
        {selectedNotice ? (
          <div className="bg-white rounded-xl shadow-lg">
            {/* Back Button */}
            <div className="p-6 border-b border-gray-200">
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
              >
                <FiChevronRight className="w-4 h-4 transform rotate-180" />
                목록으로 돌아가기
              </button>
            </div>

            {/* Notice Detail */}
            <div className="p-8 md:p-12">
              <div className="mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getCategoryColor(
                    selectedNotice.category
                  )}`}
                >
                  {getCategoryLabel(selectedNotice.category)}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedNotice.title}
                </h2>
                <p className="text-sm text-gray-500">{selectedNotice.date}</p>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedNotice.content}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <button
                    key={notice.id}
                    onClick={() => setSelectedNotice(notice)}
                    className="w-full px-6 py-5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                              notice.category
                            )}`}
                          >
                            {getCategoryLabel(notice.category)}
                          </span>
                          {notice.isImportant && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              중요
                            </span>
                          )}
                          <span className="text-sm text-gray-500">{notice.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {notice.title}
                        </h3>
                      </div>
                      <FiChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <FiBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">해당 카테고리의 공지사항이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notice;
