import { useState } from 'react';
import {
  FiTrendingUp,
  FiFileText,
  FiAward,
  FiTarget,
  FiBook,
  FiCalendar,
} from 'react-icons/fi';

type TimeRange = '1week' | '1month' | '3months' | 'all';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1month');

  // Mock data
  const stats = {
    totalEssays: 24,
    completedReviews: 20,
    averageScore: 85,
    improvementRate: 12,
    coursesCompleted: 5,
    studyHours: 42,
  };

  const essayScores = [
    { date: '2024-11', score: 73, title: '경영학과 지원 동기' },
    { date: '2024-11', score: 78, title: '미래 사회 변화' },
    { date: '2024-12', score: 81, title: '환경 보호' },
    { date: '2024-12', score: 84, title: '기술과 인간' },
    { date: '2025-01', score: 87, title: '글로벌 리더십' },
    { date: '2025-01', score: 89, title: '사회적 책임' },
  ];

  const categoryScores = [
    { category: '문법', score: 90 },
    { category: '논리', score: 85 },
    { category: '표현', score: 82 },
    { category: '구조', score: 88 },
    { category: '내용', score: 84 },
  ];

  const monthlyActivity = [
    { month: '2024-09', essays: 3, reviews: 2, courses: 1 },
    { month: '2024-10', essays: 5, reviews: 4, courses: 1 },
    { month: '2024-11', essays: 7, reviews: 6, courses: 2 },
    { month: '2024-12', essays: 6, reviews: 5, courses: 1 },
    { month: '2025-01', essays: 3, reviews: 3, courses: 0 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">성과 분석</h1>
          <p className="text-gray-600 dark:text-gray-400">학습 진도와 성과를 확인하고 개선 방향을 찾아보세요.</p>
        </div>

        {/* Time Range Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8 transition-colors">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: '1week' as TimeRange, label: '1주일' },
              { id: '1month' as TimeRange, label: '1개월' },
              { id: '3months' as TimeRange, label: '3개월' },
              { id: 'all' as TimeRange, label: '전체' },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalEssays}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">작성한 논술</div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 dark:text-green-400 font-medium">
                {stats.completedReviews}건 첨삭 완료
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiAward className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.averageScore}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">평균 점수</div>
            <div className="mt-2 flex items-center text-sm">
              <FiTrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-green-600 dark:text-green-400 font-medium">+{stats.improvementRate}%</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">향상</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiBook className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.coursesCompleted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">완료한 강의</div>
            <div className="mt-2 flex items-center text-sm">
              <FiCalendar className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">{stats.studyHours}시간</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">학습</span>
            </div>
          </div>
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Score Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">점수 추이</h3>
            <div className="space-y-3">
              {essayScores.map((essay, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {essay.title}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(essay.score)}`}>
                        {essay.score}점
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          essay.score >= 90
                            ? 'bg-green-600'
                            : essay.score >= 80
                            ? 'bg-blue-600'
                            : essay.score >= 70
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${essay.score}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {essay.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">항목별 점수</h3>
            <div className="space-y-4">
              {categoryScores.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cat.category}
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(cat.score)}`}>
                      {cat.score}점
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        cat.score >= 90
                          ? 'bg-green-600'
                          : cat.score >= 80
                          ? 'bg-blue-600'
                          : cat.score >= 70
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                <FiTarget className="w-4 h-4" />
                개선 포인트
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                표현 영역의 점수가 상대적으로 낮습니다. 다양한 어휘와 표현을 활용하는 연습을 추천드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">월별 활동</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    월
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    작성 논술
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    완료 첨삭
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    수강 강의
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {monthlyActivity.map((activity) => (
                  <tr key={activity.month}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {activity.month}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {activity.essays}건
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {activity.reviews}건
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {activity.courses}개
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <FiTrendingUp className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-green-900 dark:text-green-200">성장 중!</h4>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200 mb-2">
              최근 3개월간 평균 점수가 12% 향상되었습니다.
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              꾸준한 학습과 첨삭을 통해 실력이 크게 향상되고 있습니다. 계속 이대로 유지하세요!
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FiTarget className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-200">다음 목표</h4>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              평균 점수 90점 달성까지 5점 남았습니다!
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              표현력 향상에 집중하면 목표를 달성할 수 있습니다. 추천 강의를 확인해보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
