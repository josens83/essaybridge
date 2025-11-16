import { useState } from 'react';
import {
  FiUsers,
  FiFileText,
  FiBook,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';

type TabType = 'overview' | 'users' | 'essays' | 'revenue' | 'reports';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Mock data
  const stats = {
    totalUsers: 1247,
    newUsersToday: 23,
    activeUsers: 892,
    totalEssays: 3542,
    pendingEssays: 45,
    completedEssays: 3412,
    totalRevenue: 45780000,
    monthlyRevenue: 12340000,
    totalCourses: 48,
    activeTutors: 34,
  };

  const recentUsers = [
    { id: '1', name: '김민지', email: 'minji@example.com', grade: 3, plan: 'premium', joinedDate: '2025-01-16' },
    { id: '2', name: '이준호', email: 'junho@example.com', grade: 2, plan: 'basic', joinedDate: '2025-01-16' },
    { id: '3', name: '박서연', email: 'seoyeon@example.com', grade: 3, plan: 'premium', joinedDate: '2025-01-15' },
    { id: '4', name: '최수진', email: 'sujin@example.com', grade: 3, plan: 'basic', joinedDate: '2025-01-15' },
  ];

  const recentEssays = [
    { id: '1', student: '김민지', title: '서울대 경영학과 지원 동기', status: 'submitted', submitDate: '2025-01-16 14:30' },
    { id: '2', student: '이준호', title: '연세대 경제학과 학업 계획', status: 'in_review', submitDate: '2025-01-16 13:20' },
    { id: '3', student: '박서연', title: '고려대 법학과 지원 동기', status: 'completed', submitDate: '2025-01-16 11:15' },
    { id: '4', student: '최수진', title: 'KAIST 전산학부 학업 계획', status: 'submitted', submitDate: '2025-01-16 10:05' },
  ];

  const revenueData = [
    { month: '2024-07', amount: 8450000 },
    { month: '2024-08', amount: 9230000 },
    { month: '2024-09', amount: 10120000 },
    { month: '2024-10', amount: 11480000 },
    { month: '2024-11', amount: 12100000 },
    { month: '2024-12', amount: 13560000 },
    { month: '2025-01', amount: 12340000 },
  ];

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
    };
    const labels = {
      free: '무료',
      basic: '베이직',
      premium: '프리미엄',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[plan as keyof typeof colors]}`}>
        {labels[plan as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      submitted: 'bg-yellow-100 text-yellow-800',
      in_review: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      submitted: '제출됨',
      in_review: '검토 중',
      completed: '완료',
      draft: '임시저장',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
          <p className="text-gray-600">EssayBridge 서비스 전체 현황을 관리합니다.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">전체 사용자</div>
            <div className="mt-2 flex items-center text-sm">
              <FiTrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{stats.newUsersToday}</span>
              <span className="text-gray-600 ml-1">오늘</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiFileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalEssays.toLocaleString()}</div>
            <div className="text-sm text-gray-600">총 논술 제출</div>
            <div className="mt-2 flex items-center text-sm">
              <FiAlertCircle className="w-4 h-4 text-yellow-600 mr-1" />
              <span className="text-yellow-600 font-medium">{stats.pendingEssays}</span>
              <span className="text-gray-600 ml-1">대기 중</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₩{(stats.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">총 매출</div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">이번 달</span>
              <span className="text-gray-900 font-medium ml-1">
                ₩{(stats.monthlyRevenue / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiActivity className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">활성 사용자</div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
              </span>
              <span className="text-gray-600 ml-1">활성율</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview' as TabType, label: '개요', icon: FiActivity },
                { id: 'users' as TabType, label: '사용자 관리', icon: FiUsers },
                { id: 'essays' as TabType, label: '논술 관리', icon: FiFileText },
                { id: 'revenue' as TabType, label: '매출 현황', icon: FiDollarSign },
                { id: 'reports' as TabType, label: '리포트', icon: FiBook },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Users */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 가입 사용자</h3>
                    <div className="space-y-3">
                      {recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <div className="text-right">
                            {getPlanBadge(user.plan)}
                            <p className="text-xs text-gray-500 mt-1">{user.joinedDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Essays */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 논술 제출</h3>
                    <div className="space-y-3">
                      {recentEssays.map((essay) => (
                        <div
                          key={essay.id}
                          className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{essay.title}</p>
                            <p className="text-sm text-gray-600">{essay.student}</p>
                          </div>
                          <div className="text-right ml-4">
                            {getStatusBadge(essay.status)}
                            <p className="text-xs text-gray-500 mt-1">{essay.submitDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">전체 사용자 목록</h3>
                  <button className="btn-primary text-sm">사용자 추가</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          이름
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          이메일
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          학년
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          요금제
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          가입일
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.grade}학년
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">{getPlanBadge(user.plan)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.joinedDate}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <button className="text-primary-600 hover:text-primary-700 font-medium mr-3">
                              수정
                            </button>
                            <button className="text-red-600 hover:text-red-700 font-medium">
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Essays Tab */}
            {activeTab === 'essays' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">논술 제출 현황</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                      전체
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                      대기
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                      완료
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          학생
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          제목
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          제출일시
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentEssays.map((essay) => (
                        <tr key={essay.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {essay.student}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{essay.title}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(essay.status)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {essay.submitDate}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <button className="text-primary-600 hover:text-primary-700 font-medium mr-3">
                              보기
                            </button>
                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                              배정
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">월별 매출 현황</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {revenueData.map((data) => (
                    <div key={data.month} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">{data.month}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₩{(data.amount / 1000000).toFixed(1)}M
                      </p>
                      <div className="mt-2 flex items-center text-sm">
                        <FiTrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-green-600 font-medium">+12.5%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">무료 플랜</h4>
                    <p className="text-3xl font-bold text-blue-900 mb-1">523</p>
                    <p className="text-sm text-blue-700">사용자</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-green-900 mb-2">베이직 플랜</h4>
                    <p className="text-3xl font-bold text-green-900 mb-1">458</p>
                    <p className="text-sm text-green-700">사용자 · ₩45.3M/월</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-purple-900 mb-2">프리미엄 플랜</h4>
                    <p className="text-3xl font-bold text-purple-900 mb-1">266</p>
                    <p className="text-sm text-purple-700">사용자 · ₩53.0M/월</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">시스템 리포트</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiCheckCircle className="w-6 h-6 text-green-600" />
                      <h4 className="font-semibold text-gray-900">서비스 상태</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">웹 서버</span>
                        <span className="text-green-600 font-medium">정상</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">데이터베이스</span>
                        <span className="text-green-600 font-medium">정상</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">파일 스토리지</span>
                        <span className="text-green-600 font-medium">정상</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">결제 시스템</span>
                        <span className="text-green-600 font-medium">정상</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiActivity className="w-6 h-6 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">성능 지표</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">평균 응답 시간</span>
                        <span className="text-gray-900 font-medium">45ms</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">서버 가동률</span>
                        <span className="text-gray-900 font-medium">99.9%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">데이터 사용량</span>
                        <span className="text-gray-900 font-medium">23.4GB</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">오늘 트래픽</span>
                        <span className="text-gray-900 font-medium">1,247명</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
