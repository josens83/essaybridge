import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-black text-gray-300 dark:text-gray-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white dark:text-gray-100 text-xl font-bold mb-4">EssayBridge</h3>
            <p className="text-sm mb-4">
              대학 입시 논술 전문 플랫폼
              <br />
              합격을 향한 당신의 든든한 파트너
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white dark:text-gray-100 font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/essays" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  논술 첨삭
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  온라인 강의
                </Link>
              </li>
              <li>
                <Link to="/consulting" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  입시 컨설팅
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  커뮤니티
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white dark:text-gray-100 font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link to="/guide" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  이용 가이드
                </Link>
              </li>
              <li>
                <Link to="/notice" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  공지사항
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white dark:text-gray-100 font-semibold mb-4">문의</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>support@essaybridge.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>1588-0000</span>
              </li>
              <li className="mt-4">
                <p className="text-xs">평일 09:00 - 18:00</p>
                <p className="text-xs">주말 및 공휴일 휴무</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8 text-sm text-center md:text-left transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2025 EssayBridge. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                이용약관
              </Link>
              <Link to="/privacy" className="hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
