import { Link } from 'react-router-dom';
import {
  FiEdit,
  FiBook,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiCheckCircle,
} from 'react-icons/fi';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              논술 합격의 시작,
              <br />
              <span className="text-secondary-400">EssayBridge</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              전문가 첨삭 · 맞춤 강의 · 1:1 컨설팅까지
              <br />
              원스톱 논술 솔루션
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                첫 첨삭 무료 체험하기
              </Link>
              <Link
                to="/pricing"
                className="bg-white text-primary-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                요금제 보기
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-2 text-secondary-300">
              <FiCheckCircle />
              <span>48시간 내 첨삭 완료 보장</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              왜 EssayBridge인가요?
            </h2>
            <p className="text-xl text-gray-600">합격을 위한 모든 것을 한 곳에서</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiEdit className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">전문가 논술 첨삭</h3>
              <p className="text-gray-600">
                현직 대학 교수 및 입시 전문가의 세밀한 첨삭으로 논술 실력을 향상시키세요.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">대학별 맞춤 강의</h3>
              <p className="text-gray-600">
                서울대, 연대, 고대 등 주요 대학별 논술 전략과 기출 분석 강의를 제공합니다.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1:1 입시 컨설팅</h3>
              <p className="text-gray-600">
                개인별 맞춤 전략 수립과 학습 코칭으로 합격 가능성을 높이세요.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">학습 진도 관리</h3>
              <p className="text-gray-600">
                체계적인 학습 관리와 진도 체크로 효율적인 논술 준비가 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">15,234</div>
              <div className="text-gray-600">누적 첨삭 건수</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">94.2%</div>
              <div className="text-gray-600">합격률</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">4.9/5.0</div>
              <div className="text-gray-600">만족도</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">120+</div>
              <div className="text-gray-600">전문 첨삭위원</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">합격 후기</h2>
            <p className="text-xl text-gray-600">선배들의 생생한 합격 스토리</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="flex items-center mb-4">
                  <FiAward className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="font-semibold text-primary-600">서울대 경영학과 합격</span>
                </div>
                <p className="text-gray-700 mb-4">
                  "EssayBridge의 체계적인 첨삭과 컨설팅 덕분에 논술 실력이 눈에 띄게
                  향상되었습니다. 특히 대학별 맞춤 전략이 큰 도움이 되었어요."
                </p>
                <div className="text-sm text-gray-500">- 김○○ 학생</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 시작하세요</h2>
          <p className="text-xl mb-8 text-primary-100">
            첫 논술 첨삭을 무료로 체험해보세요
          </p>
          <Link
            to="/register"
            className="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-block transition-colors"
          >
            무료 체험 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
