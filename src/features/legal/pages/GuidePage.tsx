import { useState } from 'react';
import {
  FiUserPlus,
  FiEdit,
  FiSend,
  FiCheckCircle,
  FiBook,
  FiCalendar,
  FiMessageSquare,
} from 'react-icons/fi';

type GuideCategory = 'getting-started' | 'essay' | 'course' | 'consulting' | 'community';

const Guide = () => {
  const [activeCategory, setActiveCategory] = useState<GuideCategory>('getting-started');

  const categories = [
    { id: 'getting-started' as GuideCategory, label: '시작하기', icon: FiUserPlus },
    { id: 'essay' as GuideCategory, label: '논술 첨삭', icon: FiEdit },
    { id: 'course' as GuideCategory, label: '온라인 강의', icon: FiBook },
    { id: 'consulting' as GuideCategory, label: '컨설팅', icon: FiCalendar },
    { id: 'community' as GuideCategory, label: '커뮤니티', icon: FiMessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">이용 가이드</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            EssayBridge를 처음 사용하시나요? 서비스 이용 방법을 단계별로 안내해드립니다.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeCategory === category.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Getting Started */}
            {activeCategory === 'getting-started' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">EssayBridge 시작하기</h2>
                  <p className="text-gray-600 mb-8">
                    EssayBridge는 대학 입시를 준비하는 학생들을 위한 종합 논술 플랫폼입니다.
                    전문 튜터의 첨삭부터 온라인 강의, 1:1 컨설팅까지 모든 것을 한곳에서 이용하실 수 있습니다.
                  </p>

                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">1</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">회원가입</h3>
                        <p className="text-gray-600 mb-3">
                          우측 상단의 "회원가입" 버튼을 클릭하여 계정을 생성합니다.
                          학생 또는 튜터 중 역할을 선택하고 기본 정보를 입력하세요.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>이메일 주소와 비밀번호 설정</li>
                          <li>학년, 목표 대학, 관심 학과 입력 (학생)</li>
                          <li>학력, 경력, 전문 분야 입력 (튜터)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">2</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">요금제 선택</h3>
                        <p className="text-gray-600 mb-3">
                          무료, 베이직(월 99,000원), 프리미엄(월 199,000원) 중 선택하세요.
                          각 요금제별 제공 서비스는 다음과 같습니다:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">무료</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>✓ 커뮤니티 이용</li>
                              <li>✓ 일부 강의 시청</li>
                            </ul>
                          </div>
                          <div className="border border-primary-300 bg-primary-50 rounded-lg p-4">
                            <h4 className="font-semibold text-primary-900 mb-2">베이직</h4>
                            <ul className="text-sm text-primary-900 space-y-1">
                              <li>✓ 월 5회 논술 첨삭</li>
                              <li>✓ 모든 강의 무제한</li>
                              <li>✓ 월 2회 컨설팅</li>
                            </ul>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">프리미엄</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>✓ 무제한 논술 첨삭</li>
                              <li>✓ 우선 첨삭 (24시간)</li>
                              <li>✓ 월 4회 컨설팅</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">3</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">서비스 이용 시작</h3>
                        <p className="text-gray-600 mb-3">
                          대시보드에서 필요한 서비스를 선택하여 바로 이용하실 수 있습니다.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>논술 작성 및 첨삭 요청</li>
                          <li>온라인 강의 수강</li>
                          <li>1:1 컨설팅 예약</li>
                          <li>커뮤니티 참여</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Essay Guide */}
            {activeCategory === 'essay' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">논술 첨삭 이용 가이드</h2>

                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <FiEdit className="w-10 h-10 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">1. 논술 작성</h3>
                        <p className="text-gray-600 mb-3">
                          "논술 첨삭" 메뉴에서 "새 논술 작성" 버튼을 클릭합니다.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>제목, 목표 대학, 학과 선택</li>
                          <li>논술 내용 작성 (최소 500자 이상)</li>
                          <li>자동 저장 기능으로 작성 중 내용 보호</li>
                          <li>"임시 저장" 또는 "제출" 선택</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <FiSend className="w-10 h-10 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">2. 첨삭 요청</h3>
                        <p className="text-gray-600 mb-3">
                          작성한 논술을 제출하면 전문 튜터에게 첨삭 요청이 전달됩니다.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>베이직: 2~3일 이내 첨삭 완료</li>
                          <li>프리미엄: 24~48시간 이내 우선 첨삭</li>
                          <li>첨삭 진행 상황은 대시보드에서 확인</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <FiCheckCircle className="w-10 h-10 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">3. 첨삭 결과 확인</h3>
                        <p className="text-gray-600 mb-3">
                          첨삭이 완료되면 알림을 받으며, 상세한 피드백을 확인할 수 있습니다.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>문법, 논리, 표현, 구조, 내용 5가지 항목별 코멘트</li>
                          <li>구문별 상세 첨삭 및 개선 방향</li>
                          <li>종합 점수 및 총평</li>
                          <li>PDF 다운로드 가능</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <FiCheckCircle className="w-5 h-5" />
                        논술 작성 팁
                      </h4>
                      <ul className="text-sm text-blue-900 space-y-1 ml-7">
                        <li>• 제출 전 맞춤법 검사를 꼭 하세요</li>
                        <li>• 논리적인 구조로 서론-본론-결론을 명확히 하세요</li>
                        <li>• 구체적인 사례와 데이터를 활용하세요</li>
                        <li>• 첨삭 후 수정본을 다시 제출하여 재첨삭을 받을 수 있습니다</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Course Guide */}
            {activeCategory === 'course' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">온라인 강의 이용 가이드</h2>

                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">1</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">강의 둘러보기</h3>
                        <p className="text-gray-600 mb-3">
                          "온라인 강의" 메뉴에서 다양한 강의를 확인하세요.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>카테고리별 필터링 (논술, 입시, 학과별)</li>
                          <li>난이도별 검색 (초급, 중급, 고급)</li>
                          <li>인기 강의 및 최신 강의 확인</li>
                          <li>강의 상세 정보 및 커리큘럼 미리보기</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">2</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">수강 신청</h3>
                        <p className="text-gray-600 mb-3">
                          원하는 강의를 선택하고 "수강 신청" 버튼을 클릭하세요.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>베이직/프리미엄 회원은 대부분의 강의 무료 수강</li>
                          <li>일부 프리미엄 강의는 별도 결제 필요</li>
                          <li>수강 신청 즉시 강의 시청 가능</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">3</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">강의 수강</h3>
                        <p className="text-gray-600 mb-3">
                          언제 어디서나 원하는 시간에 강의를 시청하세요.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>PC, 태블릿, 모바일 모두 지원</li>
                          <li>진도율 자동 저장</li>
                          <li>배속 조절 가능 (0.5x ~ 2.0x)</li>
                          <li>강의 노트 작성 기능</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Consulting Guide */}
            {activeCategory === 'consulting' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">1:1 컨설팅 이용 가이드</h2>

                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <FiUserPlus className="w-10 h-10 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">1. 컨설턴트 선택</h3>
                        <p className="text-gray-600 mb-3">
                          "입시 컨설팅" 메뉴에서 전문 컨설턴트를 확인하세요.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>컨설턴트 프로필 및 전문 분야 확인</li>
                          <li>학생 평점 및 리뷰 참고</li>
                          <li>각 컨설턴트의 합격 실적 확인</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <FiCalendar className="w-10 h-10 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">2. 상담 예약</h3>
                        <p className="text-gray-600 mb-3">
                          원하는 날짜와 시간을 선택하여 예약하세요.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>상담 유형 선택 (입시 전략, 학과 선택, 논술 전략 등)</li>
                          <li>희망 날짜 및 시간 선택</li>
                          <li>상담 전 질문 사항 미리 작성</li>
                          <li>1회당 50분간 진행</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <FiCheckCircle className="w-10 h-10 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">3. 상담 진행</h3>
                        <p className="text-gray-600 mb-3">
                          예약 시간에 화상 회의 또는 전화로 상담이 진행됩니다.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>화상 회의 또는 전화 상담 선택 가능</li>
                          <li>상담 후 녹취록 및 정리 노트 제공</li>
                          <li>후속 상담 예약 가능</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Community Guide */}
            {activeCategory === 'community' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">커뮤니티 이용 가이드</h2>

                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <FiMessageSquare className="w-10 h-10 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">1. 게시글 작성</h3>
                        <p className="text-gray-600 mb-3">
                          입시 정보를 공유하고 다른 학생들과 소통하세요.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>카테고리 선택 (입시 정보, 학습 팁, 합격 후기 등)</li>
                          <li>익명 작성 가능</li>
                          <li>이미지 및 파일 첨부 가능</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-lg">2</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">댓글 및 소통</h3>
                        <p className="text-gray-600 mb-3">
                          다른 학생들의 게시글에 댓글을 달고 정보를 나누세요.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          <li>댓글 작성 및 답글 가능</li>
                          <li>좋아요 및 북마크 기능</li>
                          <li>건전한 커뮤니티 문화 유지</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                      <h4 className="font-semibold text-yellow-900 mb-2">커뮤니티 이용 수칙</h4>
                      <ul className="text-sm text-yellow-900 space-y-1 ml-4">
                        <li>• 타인을 존중하고 배려하는 댓글을 작성해주세요</li>
                        <li>• 허위 정보나 과장된 내용은 피해주세요</li>
                        <li>• 개인정보 노출에 주의해주세요</li>
                        <li>• 욕설, 비방, 광고성 게시글은 삭제될 수 있습니다</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">추가 도움이 필요하신가요?</h2>
          <p className="text-gray-600 mb-6">
            가이드에서 원하는 답변을 찾지 못하셨다면 FAQ를 확인하거나 고객 지원팀에 문의해주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/faq" className="btn-primary">
              FAQ 보기
            </a>
            <a href="mailto:support@essaybridge.com" className="btn-outline">
              이메일 문의
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;
