import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMenu, FiX, FiBell, FiUser, FiSettings, FiLogOut, FiBook, FiSearch, FiMoon, FiSun } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const notifications = [
    {
      id: '1',
      type: 'essay_review',
      title: '논술 첨삭이 완료되었습니다',
      message: '서울대 2024학년도 모의논술 첨삭이 완료되었습니다.',
      time: '5분 전',
      isRead: false,
    },
    {
      id: '2',
      type: 'consultation',
      title: '상담 일정 알림',
      message: '내일 오후 3시 1:1 컨설팅이 예정되어 있습니다.',
      time: '2시간 전',
      isRead: false,
    },
    {
      id: '3',
      type: 'community',
      title: '새 댓글',
      message: '작성하신 게시글에 새로운 댓글이 달렸습니다.',
      time: '1일 전',
      isRead: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">EssayBridge</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/essays" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              논술 첨삭
            </Link>
            <Link to="/courses" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              온라인 강의
            </Link>
            <Link to="/consulting" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              입시 컨설팅
            </Link>
            <Link to="/community" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              커뮤니티
            </Link>
            <Link to="/pricing" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              요금제
            </Link>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                {/* Search */}
                <Link
                  to="/search"
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiSearch className="w-5 h-5" />
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => {
                      setNotificationOpen(!notificationOpen);
                      setProfileMenuOpen(false);
                    }}
                    className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <FiBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">알림</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <FiBell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p>새로운 알림이 없습니다</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              className={`w-full px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-0 ${
                                !notification.isRead ? 'bg-primary-50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-1">
                                <p className="font-medium text-sm text-gray-900">
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-1"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                              <p className="text-xs text-gray-500">{notification.time}</p>
                            </button>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-200">
                          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            모두 읽음으로 표시
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(!profileMenuOpen);
                      setNotificationOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-600">
                        {user?.name[0]}
                      </span>
                    </div>
                    <span className="font-medium">{user?.name}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <FiBook className="w-4 h-4 mr-3" />
                        대시보드
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4 mr-3" />
                        프로필
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <FiSettings className="w-4 h-4 mr-3" />
                        설정
                      </Link>

                      <div className="border-t border-gray-200 my-2"></div>

                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4 mr-3" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  로그인
                </Link>
                <Link to="/register" className="btn-primary">
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/essays"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                논술 첨삭
              </Link>
              <Link
                to="/courses"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                온라인 강의
              </Link>
              <Link
                to="/consulting"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                입시 컨설팅
              </Link>
              <Link
                to="/community"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                커뮤니티
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                요금제
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    to="/search"
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    검색
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    대시보드
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    프로필
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-red-600 py-2"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary inline-block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
