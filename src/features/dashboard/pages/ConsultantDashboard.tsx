import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiStar,
  FiVideo,
  FiUsers,
  FiTrendingUp
} from 'react-icons/fi';
import type { ConsultingSession } from '../../../types';

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  // Mock data
  const stats = {
    upcomingSessions: 8,
    completedThisMonth: 32,
    averageRating: 4.9,
    totalEarnings: 3200000,
    totalStudents: 45,
    hoursThisMonth: 48,
  };

  const mockSessions: ConsultingSession[] = [
    {
      id: '1',
      studentId: 'student1',
      consultantId: 'consultant1',
      consultantName: '김컨설턴트',
      type: 'essay_review',
      scheduledAt: '2024-01-20T14:00:00Z',
      duration: 60,
      status: 'scheduled',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      studentId: 'student2',
      consultantId: 'consultant1',
      consultantName: '김컨설턴트',
      type: 'university_selection',
      scheduledAt: '2024-01-20T16:00:00Z',
      duration: 90,
      status: 'scheduled',
      createdAt: '2024-01-14T09:00:00Z',
    },
    {
      id: '3',
      studentId: 'student3',
      consultantId: 'consultant1',
      consultantName: '김컨설턴트',
      type: 'interview_prep',
      scheduledAt: '2024-01-18T10:00:00Z',
      duration: 60,
      status: 'completed',
      notes: '면접 준비 완료. 학생의 답변 능력이 많이 향상됨.',
      createdAt: '2024-01-10T15:00:00Z',
    },
  ];

  const upcomingSessions = mockSessions.filter(s => s.status === 'scheduled');
  const completedSessions = mockSessions.filter(s => s.status === 'completed');

  const getSessionsByTab = () => {
    return activeTab === 'upcoming' ? upcomingSessions : completedSessions;
  };

  const getSessionTypeLabel = (type: ConsultingSession['type']) => {
    switch (type) {
      case 'essay_review':
        return '논술 리뷰';
      case 'university_selection':
        return '대학 선택';
      case 'interview_prep':
        return '면접 준비';
      case 'general':
        return '일반 상담';
      default:
        return type;
    }
  };

  const handleStartSession = (sessionId: string) => {
    navigate(`/consultant/session/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            컨설턴트 대시보드
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            학생들에게 맞춤형 입시 컨설팅을 제공하세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">예정된 상담</h3>
              <FiCalendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.upcomingSessions}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">건</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">이번 달 완료</h3>
              <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.completedThisMonth}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">건</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">평균 평점</h3>
              <FiStar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.averageRating}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">/ 5.0</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">이번 달 수익</h3>
              <FiDollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalEarnings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">원</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiUsers className="w-5 h-5 mr-2" />
              학생 관리
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">총 학생 수</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalStudents}명
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">활성 학생</span>
                <span className="font-semibold text-gray-900 dark:text-white">28명</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">신규 학생 (이번 달)</span>
                <span className="font-semibold text-green-600 dark:text-green-400">5명</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiClock className="w-5 h-5 mr-2" />
              상담 시간
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">이번 달 총 시간</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.hoursThisMonth}시간
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">평균 세션 시간</span>
                <span className="font-semibold text-gray-900 dark:text-white">90분</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">이번 주 예정</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">12시간</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiTrendingUp className="w-5 h-5 mr-2" />
              성과 지표
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">학생 만족도</span>
                <span className="font-semibold text-green-600 dark:text-green-400">97%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">재예약률</span>
                <span className="font-semibold text-green-600 dark:text-green-400">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">목표 달성률</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiCalendar className="w-5 h-5 mr-2" />
            오늘의 일정
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex-shrink-0 w-16 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">14:00</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">60분</p>
              </div>
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">논술 리뷰 상담</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">김○○ 학생 - 서울대 경영학과</p>
              </div>
              <button className="btn-primary text-sm flex items-center">
                <FiVideo className="w-4 h-4 mr-2" />
                입장
              </button>
            </div>
            <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex-shrink-0 w-16 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">16:00</p>
                <p className="text-xs text-green-600 dark:text-green-400">90분</p>
              </div>
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">대학 선택 상담</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">이○○ 학생 - 인문계열</p>
              </div>
              <button className="btn-outline text-sm">준비하기</button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                예정된 상담 ({upcomingSessions.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'completed'
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                완료된 상담 ({completedSessions.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {getSessionsByTab().length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  상담이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === 'upcoming' && '예정된 상담이 없습니다.'}
                  {activeTab === 'completed' && '완료된 상담이 없습니다.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getSessionsByTab().map((session) => (
                  <div
                    key={session.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                            {getSessionTypeLabel(session.type)}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {session.duration}분
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          일시: {new Date(session.scheduledAt).toLocaleString('ko-KR')}
                        </p>
                        {session.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            메모: {session.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {session.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleStartSession(session.id)}
                            className="btn-primary text-sm flex items-center"
                          >
                            <FiVideo className="w-4 h-4 mr-2" />
                            상담 시작
                          </button>
                          <button className="btn-outline text-sm">일정 변경</button>
                        </>
                      )}
                      {session.status === 'completed' && (
                        <button className="btn-outline text-sm">상세 보기</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
