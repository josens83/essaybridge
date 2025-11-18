import { Link } from 'react-router-dom';
import { useAuth } from '../../auth';
import {
  FiEdit,
  FiBook,
  FiCalendar,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiBarChart2,
} from 'react-icons/fi';
import { sampleEssays } from '../../../data/sampleData';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: '제출한 논술', value: '12', icon: FiEdit, color: 'bg-blue-100 text-blue-600' },
    { label: '수강 중인 강의', value: '3', icon: FiBook, color: 'bg-green-100 text-green-600' },
    { label: '다가오는 상담', value: '2', icon: FiCalendar, color: 'bg-purple-100 text-purple-600' },
    { label: '학습 진도율', value: '68%', icon: FiTrendingUp, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            안녕하세요, {user?.name}님! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">오늘도 합격을 향해 한 걸음 더 나아가봅시다.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Essays */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">최근 논술</h2>
                  <Link to="/essays" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
                    전체보기
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sampleEssays.slice(0, 3).map((essay) => (
                  <Link
                    key={essay.id}
                    to={`/essays/${essay.id}`}
                    className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{essay.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          essay.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : essay.status === 'in_review'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {essay.status === 'completed'
                          ? '첨삭 완료'
                          : essay.status === 'in_review'
                          ? '첨삭 중'
                          : '작성 중'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {essay.university} · {essay.department}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                      <FiClock className="w-4 h-4 mr-1" />
                      <span>{new Date(essay.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">·</span>
                      <span>{essay.wordCount}자</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Upcoming */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">빠른 시작</h2>
              <div className="space-y-3">
                <Link
                  to="/essays/new"
                  className="block w-full btn-primary text-center"
                >
                  새 논술 작성
                </Link>
                <Link
                  to="/analytics"
                  className="flex items-center justify-center gap-2 w-full btn-outline text-center"
                >
                  <FiBarChart2 className="w-4 h-4" />
                  성과 분석 보기
                </Link>
                <Link
                  to="/consulting"
                  className="block w-full btn-outline text-center"
                >
                  상담 예약하기
                </Link>
                <Link
                  to="/courses"
                  className="block w-full btn-outline text-center"
                >
                  강의 둘러보기
                </Link>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">오늘의 일정</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                    <FiCalendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">1:1 컨설팅</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">오후 3:00 - 4:00</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-secondary-100 dark:bg-secondary-900/30 p-2 rounded-lg">
                    <FiAward className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">논술 첨삭 마감</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">오후 6:00까지</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg shadow p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">이번 달 진도</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>논술 첨삭</span>
                    <span>3/10회</span>
                  </div>
                  <div className="w-full bg-primary-800 rounded-full h-2">
                    <div className="bg-secondary-400 h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>컨설팅</span>
                    <span>1/3시간</span>
                  </div>
                  <div className="w-full bg-primary-800 rounded-full h-2">
                    <div className="bg-secondary-400 h-2 rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
