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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">설정</h1>
          <p className="text-gray-600">계정 정보와 설정을 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-primary-600 font-semibold">{user?.name[0]}</span>
                </div>
                <p className="text-center font-semibold text-gray-900">{user?.name}</p>
                <p className="text-center text-sm text-gray-600">{user?.email}</p>
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
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="w-full text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors font-medium"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">프로필 정보</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input-field"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">학년</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                              className="mr-2 rounded text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{univ}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                              className="mr-2 rounded text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{dept}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">보안 설정</h2>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <p className="mt-1 text-xs text-gray-500">최소 8자 이상 입력해주세요.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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

                    <div className="pt-6 border-t border-gray-200">
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">구독 관리</h2>

                  <div className="bg-primary-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-primary-600 font-medium mb-1">현재 플랜</p>
                        <p className="text-2xl font-bold text-primary-900">
                          {studentProfile?.subscriptionPlan === 'free'
                            ? '프리'
                            : studentProfile?.subscriptionPlan === 'basic'
                            ? '베이직'
                            : '프리미엄'}
                        </p>
                      </div>
                      <button
                        onClick={() => window.location.href = '/pricing'}
                        className="btn-primary"
                      >
                        플랜 변경
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">이번 달 논술 첨삭</p>
                        <p className="text-sm text-gray-600">3회 중 3회 남음</p>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">이번 달 컨설팅</p>
                        <p className="text-sm text-gray-600">1시간 중 0.5시간 남음</p>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '50%' }} />
                      </div>
                    </div>

                    <div className="pt-6">
                      <p className="text-sm text-gray-600 mb-4">
                        다음 결제일: 2025년 12월 15일
                      </p>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        구독 취소
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">알림 설정</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">논술 첨삭 알림</p>
                        <p className="text-sm text-gray-600">첨삭이 완료되면 알려드립니다</p>
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
                        <p className="font-medium text-gray-900">컨설팅 알림</p>
                        <p className="text-sm text-gray-600">예약된 상담 일정을 알려드립니다</p>
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">커뮤니티 알림</p>
                        <p className="text-sm text-gray-600">댓글과 좋아요 알림을 받습니다</p>
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">마케팅 알림</p>
                        <p className="text-sm text-gray-600">이벤트와 프로모션 정보를 받습니다</p>
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
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
