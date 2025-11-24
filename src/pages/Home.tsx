import { Link } from 'react-router-dom';
import {
  FiEdit,
  FiBook,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiZap,
  FiTarget,
  FiClock,
  FiStar,
  FiArrowRight,
} from 'react-icons/fi';
import { SocialProof } from '../shared/components';

const Home = () => {
  return (
    <div className="bg-white dark:bg-zinc-950 transition-colors">
      {/* Hero Section - Linear Style with Gradient Mesh */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-mesh dark:bg-gradient-mesh opacity-100"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-zinc-950/50 dark:to-zinc-950"></div>

        {/* Floating Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200/50 dark:border-zinc-700/50 mb-8 animate-fade-in-up">
              <FiZap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                48시간 내 전문가 첨삭 보장
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-hero mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              논술 합격의 시작,
              <br />
              <span className="gradient-text">EssayBridge</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              전문가 첨삭 · 맞춤 강의 · 1:1 컨설팅까지
              <br />
              <span className="font-semibold text-gray-900 dark:text-white">원스톱 논술 솔루션</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/register" className="btn-primary group">
                첫 첨삭 무료 체험하기
                <FiArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/pricing" className="btn-secondary">
                요금제 보기
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-green-600 dark:text-green-400" />
                <span>15,234+ 첨삭 완료</span>
              </div>
              <div className="flex items-center gap-2">
                <FiStar className="text-yellow-500 dark:text-yellow-400" />
                <span>4.9/5.0 만족도</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTarget className="text-indigo-600 dark:text-indigo-400" />
                <span>94.2% 합격률</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Box Grid - Features Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">
              <span className="gradient-text">왜 EssayBridge</span>인가요?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">합격을 위한 모든 것을 한 곳에서</p>
          </div>

          {/* Bento Grid - Apple Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Large Feature - Spans 2 columns */}
            <div className="md:col-span-2 lg:col-span-2 bento-item bento-item-glow p-8 md:p-10 group">
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <FiEdit className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    전문가 논술 첨삭
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    현직 대학 교수 및 입시 전문가의 세밀한 첨삭으로 논술 실력을 향상시키세요.
                    체계적인 피드백과 함께 성장하는 경험을 제공합니다.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-5 transition-all">
                  <span>자세히 보기</span>
                  <FiArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Tall Feature - Spans 2 rows */}
            <div className="md:row-span-2 bento-item bento-item-glow p-8 group">
              <div className="relative h-full flex flex-col">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <FiBook className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  대학별 맞춤 강의
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                  서울대, 연대, 고대 등 주요 대학별 논술 전략과 기출 분석 강의를 제공합니다.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>대학별 기출 분석</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>전략적 접근법</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>실전 대비 훈련</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Feature */}
            <div className="bento-item bento-item-glow p-8 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                <FiClock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                빠른 첨삭
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                48시간 내 전문가 첨삭을 보장합니다.
              </p>
            </div>

            {/* Wide Feature - Spans 2 columns */}
            <div className="md:col-span-2 bento-item bento-item-glow p-8 group">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <FiUsers className="w-8 h-8 text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    1:1 입시 컨설팅
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    개인별 맞춤 전략 수립과 학습 코칭으로 합격 가능성을 높이세요.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      개인 맞춤
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      전략 수립
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      학습 코칭
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Feature */}
            <div className="bento-item bento-item-glow p-8 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                <FiTrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                학습 진도 관리
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                체계적인 학습 관리와 진도 체크
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Glassmorphism Cards */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:via-indigo-950/20 dark:to-purple-950/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '15,234', label: '누적 첨삭 건수', icon: FiEdit, color: 'indigo' },
              { value: '94.2%', label: '합격률', icon: FiTarget, color: 'purple' },
              { value: '4.9/5.0', label: '만족도', icon: FiStar, color: 'pink' },
              { value: '120+', label: '전문 첨삭위원', icon: FiUsers, color: 'blue' },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center hover-lift group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`} />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Trust Building Section */}
      <section className="py-28 bg-white dark:bg-zinc-950">
        <SocialProof />
      </section>

      {/* CTA Section - Gradient with Glassmorphism */}
      <section className="relative py-24 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700"></div>
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>

        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            지금 시작하세요
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            첫 논술 첨삭을 무료로 체험해보세요
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              무료 체험 시작하기
              <FiArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 rounded-xl text-lg font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              요금제 보기
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-5 h-5" />
              <span>신용카드 정보 불필요</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-5 h-5" />
              <span>언제든지 해지 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-5 h-5" />
              <span>24/7 고객 지원</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
