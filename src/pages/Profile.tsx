import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiLock, FiCreditCard, FiBell, FiSave } from 'react-icons/fi';
import { universities, departments } from '../data/sampleData';
import type { StudentProfile } from '../types';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'subscription' | 'notifications'>('profile');
  const [saving, setSaving] = useState(false);

  const studentProfile = user as StudentProfile;

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    grade: studentProfile?.grade || 3,
    targetUniversities: studentProfile?.targetUniversities || [],
    interests: studentProfile?.interests || [],
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    essayReview: true,
    consultation: true,
    community: false,
    marketing: false,
  });

  const handleProfileSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('프로필이 저장되었습니다.');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('비밀번호가 변경되었습니다.');
  };

  const handleNotificationsSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('알림 설정이 저장되었습니다.');
  };

  const tabs = [
    { id: 'profile' as const, label: '프로필 정보', icon: FiUser },
    { id: 'security' as const, label: '보안', icon: FiLock },
    { id: 'subscription' as const, label: '구독 관리', icon: FiCreditCard },
    { id: 'notifications' as const, label: '알림 설정', icon: FiBell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">설정</h1>
          <p className="text-gray-600 dark:text-gray-400">계정 정보와 설정을 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-primary-600 dark:text-primary-400 font-semibold">{user?.name[0]}</span>
                </div>
                <p className="text-center font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>

              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={logout}
                  className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 py-2 px-4 rounded-lg transition-colors font-medium"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">프로필 정보</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이름</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input-field"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">이메일은 변경할 수 없습니다.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">학년</label>
                      <select
                        value={profileData.grade}
                        onChange={(e) =>
                          setProfileData({ ...profileData, grade: parseInt(e.target.value) })
                        }
                        className="input-field"
                      >
                        <option value={1}>고1</option>
                        <option value={2}>고2</option>
                        <option value={3}>고3</option>
                        <option value={4}>N수생</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        목표 대학 (최대 3개)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {universities.slice(0, 9).map((univ) => (
                          <label key={univ} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={profileData.targetUniversities.includes(univ)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...profileData.targetUniversities, univ]
                                  : profileData.targetUniversities.filter((u) => u !== univ);
                                if (updated.length <= 3) {
                                  setProfileData({ ...profileData, targetUniversities: updated });
                                }
                              }}
                              className="mr-2 rounded text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{univ}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        관심 학과
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {departments.slice(0, 9).map((dept) => (
                          <label key={dept} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={profileData.interests.includes(dept)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...profileData.interests, dept]
                                  : profileData.interests.filter((d) => d !== dept);
                                setProfileData({ ...profileData, interests: updated });
                              }}
                              className="mr-2 rounded text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{dept}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleProfileSave}
                        disabled={saving}
                        className="btn-primary flex items-center disabled:opacity-50"
                      >
                        <FiSave className="w-5 h-5 mr-2" />
                        {saving ? '저장 중...' : '변경사항 저장'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">보안 설정</h2>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        현재 비밀번호
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        새 비밀번호
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        className="input-field"
                        minLength={8}
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">최소 8자 이상 입력해주세요.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        새 비밀번호 확인
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary disabled:opacity-50"
                      >
                        {saving ? '변경 중...' : '비밀번호 변경'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">구독 관리</h2>

                  {/* Current Plan Card */}
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-primary-700 dark:text-primary-300 font-medium mb-1">현재 플랜</p>
                        <p className="text-3xl font-bold text-primary-900 dark:text-white">
                          {studentProfile?.subscriptionPlan === 'free'
                            ? '무료 체험'
                            : studentProfile?.subscriptionPlan === 'basic'
                            ? '베이직'
                            : studentProfile?.subscriptionPlan === 'premium'
                            ? '프리미엄'
                            : '프로'}
                        </p>
                        <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
                          {studentProfile?.subscriptionPlan === 'free' ? '무료' : '월 59,000원'}
                        </p>
                      </div>
                      <button
                        onClick={() => window.location.href = '/pricing'}
                        className="btn-primary"
                      >
                        플랜 변경
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-primary-200 dark:border-primary-700">
                      <div className="text-sm text-primary-800 dark:text-primary-200">
                        <p>구독 시작일: 2024-12-15</p>
                        <p className="mt-1">다음 결제일: 2025-01-15</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                          활성
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Usage Statistics */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">이번 달 사용량</h3>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">논술 첨삭</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">12회 중 3회 남음</p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div className="bg-primary-600 dark:bg-primary-400 h-2.5 rounded-full" style={{ width: '75%' }} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">75% 사용됨</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">1:1 컨설팅</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">3시간 중 1.5시간 남음</p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div className="bg-secondary-600 dark:bg-secondary-400 h-2.5 rounded-full" style={{ width: '50%' }} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">50% 사용됨</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">강의 수강</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">무제한</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">이번 달 15개 강의 수강 중</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">결제 수단</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiCreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">신용카드</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">**** **** **** 1234</p>
                          </div>
                        </div>
                        <button className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                          변경
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">빠른 메뉴</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={() => window.location.href = '/payment/history'}
                        className="btn-outline text-left flex items-center justify-between"
                      >
                        <span>결제 내역 보기</span>
                        <span>→</span>
                      </button>
                      <button
                        onClick={() => window.location.href = '/pricing'}
                        className="btn-outline text-left flex items-center justify-between"
                      >
                        <span>플랜 업그레이드</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>

                  {/* Subscription Management */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">자동 갱신</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          다음 결제일에 자동으로 결제됩니다
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="mt-6">
                      <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium">
                        구독 취소하기
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        구독을 취소하면 다음 결제일까지 서비스를 이용하실 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">알림 설정</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">논술 첨삭 알림</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">첨삭이 완료되면 알려드립니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.essayReview}
                          onChange={(e) =>
                            setNotifications({ ...notifications, essayReview: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">컨설팅 알림</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">예약된 상담 일정을 알려드립니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.consultation}
                          onChange={(e) =>
                            setNotifications({ ...notifications, consultation: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">커뮤니티 알림</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">댓글과 좋아요 알림을 받습니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.community}
                          onChange={(e) =>
                            setNotifications({ ...notifications, community: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">마케팅 알림</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">이벤트와 프로모션 정보를 받습니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.marketing}
                          onChange={(e) =>
                            setNotifications({ ...notifications, marketing: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleNotificationsSave}
                        disabled={saving}
                        className="btn-primary flex items-center disabled:opacity-50"
                      >
                        <FiSave className="w-5 h-5 mr-2" />
                        {saving ? '저장 중...' : '변경사항 저장'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
