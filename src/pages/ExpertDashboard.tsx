import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiStar,
  FiCalendar,
  FiTrendingUp
} from 'react-icons/fi';
import type { Essay } from '../types';

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'inProgress' | 'completed'>('pending');

  // Mock data
  const stats = {
    pendingReviews: 12,
    completedThisMonth: 45,
    averageRating: 4.8,
    totalEarnings: 2350000,
  };

  const mockEssays: Essay[] = [
    {
      id: '1',
      studentId: 'student1',
      title: '서울대 2024학년도 인문계열 논술',
      content: '제시문 (가)에서는...',
      university: '서울대학교',
      department: '경영학과',
      essayType: 'university_specific',
      status: 'submitted',
      wordCount: 1250,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      submittedAt: '2024-01-15T10:35:00Z',
    },
    {
      id: '2',
      studentId: 'student2',
      title: '연세대 논술 모의고사',
      content: '제시문을 바탕으로...',
      university: '연세대학교',
      department: '경제학과',
      essayType: 'university_specific',
      status: 'in_review',
      wordCount: 980,
      createdAt: '2024-01-14T15:20:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
      submittedAt: '2024-01-14T15:25:00Z',
      expertId: 'expert1',
    },
    {
      id: '3',
      studentId: 'student3',
      title: '고려대 모의논술',
      content: '논제에 대한 나의 생각은...',
      university: '고려대학교',
      department: '국어국문학과',
      essayType: 'university_specific',
      status: 'completed',
      wordCount: 1520,
      createdAt: '2024-01-13T11:00:00Z',
      updatedAt: '2024-01-14T16:30:00Z',
      submittedAt: '2024-01-13T11:10:00Z',
      expertId: 'expert1',
    },
  ];

  const pendingEssays = mockEssays.filter(e => e.status === 'submitted');
  const inProgressEssays = mockEssays.filter(e => e.status === 'in_review');
  const completedEssays = mockEssays.filter(e => e.status === 'completed');

  const getEssaysByTab = () => {
    switch (activeTab) {
      case 'pending':
        return pendingEssays;
      case 'inProgress':
        return inProgressEssays;
      case 'completed':
        return completedEssays;
      default:
        return [];
    }
  };

  const handleStartReview = (essayId: string) => {
    navigate(`/expert/review/${essayId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            전문가 대시보드
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            학생들의 논술을 첨삭하고 피드백을 제공하세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">대기 중인 첨삭</h3>
              <FiClock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.pendingReviews}
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiTrendingUp className="w-5 h-5 mr-2" />
              이번 주 활동
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">첨삭 완료</span>
                <span className="font-semibold text-gray-900 dark:text-white">12건</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">평균 첨삭 시간</span>
                <span className="font-semibold text-gray-900 dark:text-white">45분</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">학생 만족도</span>
                <span className="font-semibold text-green-600 dark:text-green-400">98%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiCalendar className="w-5 h-5 mr-2" />
              다가오는 컨설팅
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">김○○ 학생</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  오늘 오후 2:00 - 논술 전략 상담
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">이○○ 학생</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  내일 오전 10:00 - 첨삭 리뷰
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Essay List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pending'
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                대기 중 ({pendingEssays.length})
              </button>
              <button
                onClick={() => setActiveTab('inProgress')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'inProgress'
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                진행 중 ({inProgressEssays.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'completed'
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                완료 ({completedEssays.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {getEssaysByTab().length === 0 ? (
              <div className="text-center py-12">
                <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  논술이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === 'pending' && '새로운 첨삭 요청을 기다리고 있습니다.'}
                  {activeTab === 'inProgress' && '진행 중인 첨삭이 없습니다.'}
                  {activeTab === 'completed' && '완료된 첨삭이 없습니다.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getEssaysByTab().map((essay) => (
                  <div
                    key={essay.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {essay.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{essay.university}</span>
                          <span>•</span>
                          <span>{essay.department}</span>
                          <span>•</span>
                          <span>{essay.wordCount.toLocaleString()}자</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        essay.status === 'submitted'
                          ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                          : essay.status === 'in_review'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      }`}>
                        {essay.status === 'submitted' && '대기'}
                        {essay.status === 'in_review' && '진행중'}
                        {essay.status === 'completed' && '완료'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      제출일: {new Date(essay.submittedAt || essay.createdAt).toLocaleString('ko-KR')}
                    </p>

                    <div className="flex items-center space-x-3">
                      {essay.status === 'submitted' && (
                        <button
                          onClick={() => handleStartReview(essay.id)}
                          className="btn-primary text-sm"
                        >
                          첨삭 시작
                        </button>
                      )}
                      {essay.status === 'in_review' && (
                        <button
                          onClick={() => handleStartReview(essay.id)}
                          className="btn-primary text-sm"
                        >
                          계속 작성
                        </button>
                      )}
                      {essay.status === 'completed' && (
                        <button
                          onClick={() => navigate(`/essays/${essay.id}`)}
                          className="btn-outline text-sm"
                        >
                          첨삭 보기
                        </button>
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

export default ExpertDashboard;
