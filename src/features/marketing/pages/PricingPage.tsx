import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiZap, FiStar, FiTrendingUp } from 'react-icons/fi';
import { monthlyPlans, yearlyPlans } from '../../../data/pricingPlans';
import { useAuth } from '../../../features/auth';
import type { PricingPlan } from '../../../types';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const plans = billingPeriod === 'monthly' ? monthlyPlans : yearlyPlans;

  const handleSelectPlan = (plan: PricingPlan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (plan.name === 'free') {
      // Free plan - just activate
      alert('무료 체험이 활성화되었습니다!');
      navigate('/dashboard');
    } else {
      // Paid plan - go to checkout
      navigate('/checkout', { state: { plan } });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      {/* Hero Section with Gradient Mesh */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-100"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-zinc-950/50 dark:to-zinc-950"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200/50 dark:border-zinc-700/50 mb-6 animate-fade-in-up">
              <FiZap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                연간 결제 시 17% 할인
              </span>
            </div>

            <h1 className="text-hero mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="gradient-text">합격을 위한</span> 최적의 플랜
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              전문가의 첨삭과 컨설팅으로 논술 실력을 키우세요
            </p>

            {/* Billing Period Toggle - Glassmorphism */}
            <div className="inline-flex items-center glass-card p-1.5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  billingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                월간 결제
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                연간 결제
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse-glow">
                  17% 할인
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-12 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {plans.map((plan, index) => {
              const isPopular = plan.popular;
              const isFree = plan.name === 'free';

              return (
                <div
                  key={plan.id}
                  className={`relative group animate-fade-in-up ${
                    isPopular ? 'lg:scale-105 z-10' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg">
                        <FiStar className="w-4 h-4" />
                        <span>가장 인기있는 플랜</span>
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={`relative h-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border transition-all duration-500 overflow-hidden ${
                      isPopular
                        ? 'border-indigo-200 dark:border-indigo-700 shadow-2xl shadow-indigo-500/20'
                        : 'border-gray-200/50 dark:border-zinc-700/50 shadow-xl shadow-gray-900/5'
                    } group-hover:shadow-2xl group-hover:scale-[1.02] group-hover:-translate-y-1`}
                  >
                    {/* Glow Effect on Hover */}
                    {isPopular && (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    )}

                    <div className="relative p-8">
                      {/* Plan Icon */}
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${
                        isFree
                          ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                          : isPopular
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                          : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                      }`}>
                        {isFree ? (
                          <FiZap className="w-7 h-7 text-white" />
                        ) : isPopular ? (
                          <FiStar className="w-7 h-7 text-white" />
                        ) : (
                          <FiTrendingUp className="w-7 h-7 text-white" />
                        )}
                      </div>

                      {/* Plan Name */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.displayName}
                      </h3>

                      {/* Pricing */}
                      <div className="mb-8">
                        {plan.originalPrice && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-400 dark:text-gray-500 line-through text-lg">
                              {plan.originalPrice.toLocaleString()}원
                            </span>
                            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold">
                              {plan.discount}% 할인
                            </span>
                          </div>
                        )}
                        <div className="flex items-baseline mb-2">
                          <span className={`text-5xl font-bold ${
                            isPopular ? 'gradient-text' : 'text-gray-900 dark:text-white'
                          }`}>
                            {plan.price === 0 ? '무료' : plan.price.toLocaleString()}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-gray-600 dark:text-gray-400 ml-2 text-lg">
                              원 / {plan.period === 'monthly' ? '월' : '년'}
                            </span>
                          )}
                        </div>
                        {plan.period === 'yearly' && plan.price > 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            월 {Math.floor(plan.price / 12).toLocaleString()}원
                          </p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 mb-8 ${
                          isPopular
                            ? 'btn-primary'
                            : 'btn-secondary hover:scale-[1.02]'
                        }`}
                      >
                        {plan.name === 'free' ? '무료 시작하기' : '플랜 선택'}
                      </button>

                      {/* Features List */}
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start group/item">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                isPopular
                                  ? 'bg-indigo-100 dark:bg-indigo-900/30'
                                  : 'bg-gray-100 dark:bg-gray-800'
                              }`}>
                                <FiCheck className={`w-3 h-3 ${
                                  isPopular
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`} />
                              </div>
                            </div>
                            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">
              <span className="gradient-text">플랜 상세 비교</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              모든 기능을 한눈에 비교해보세요
            </p>
          </div>

          <div className="glass-card p-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-zinc-700">
                    <th className="text-left py-5 px-6 text-gray-900 dark:text-white font-bold text-lg">
                      기능
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.id}
                        className="text-center py-5 px-6 text-gray-900 dark:text-white font-bold"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{plan.displayName}</span>
                          {plan.popular && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                              인기
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-5 px-6 text-gray-700 dark:text-gray-300 font-medium">
                      월간 논술 첨삭
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-5 px-6">
                        <span className="text-gray-900 dark:text-white font-bold text-lg">
                          {plan.essayReviewsPerMonth === 999
                            ? '무제한'
                            : `${plan.essayReviewsPerMonth}회`}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-5 px-6 text-gray-700 dark:text-gray-300 font-medium">
                      월간 1:1 컨설팅
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-5 px-6">
                        <span className="text-gray-900 dark:text-white font-bold text-lg">
                          {plan.consultingHoursPerMonth === 0
                            ? '-'
                            : `${plan.consultingHoursPerMonth}시간`}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-5 px-6 text-gray-700 dark:text-gray-300 font-medium">
                      전체 강의 수강
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-5 px-6">
                        {plan.courseAccess ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                            <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800">
                            <FiX className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-5 px-6 text-gray-700 dark:text-gray-300 font-medium">
                      첨삭 완료 시간
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-5 px-6">
                        <span className="text-gray-900 dark:text-white font-bold">
                          {plan.name === 'free' ? '72시간' :
                           plan.name === 'basic' ? '48시간' :
                           plan.name === 'premium' ? '24시간' : '12시간'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-5 px-6 text-gray-700 dark:text-gray-300 font-medium">
                      우선 지원
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-5 px-6">
                        {plan.name === 'pro' || plan.name === 'premium' ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                            <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800">
                            <FiX className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">
              <span className="gradient-text">자주 묻는 질문</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              궁금하신 점을 빠르게 해결하세요
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: '플랜을 변경할 수 있나요?',
                a: '네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 남은 기간은 일할 계산되어 정산됩니다.',
              },
              {
                q: '환불 정책은 어떻게 되나요?',
                a: '첫 결제 후 7일 이내에 서비스를 사용하지 않으셨다면 전액 환불 가능합니다. 부분 환불은 남은 기간에 대해 일할 계산됩니다.',
              },
              {
                q: '첨삭은 얼마나 빨리 받을 수 있나요?',
                a: '플랜에 따라 다르며, 프로는 12시간, 프리미엄은 24시간, 베이직은 48시간 내 첨삭이 완료됩니다.',
              },
              {
                q: '연간 플랜의 혜택은 무엇인가요?',
                a: '연간 플랜은 월간 플랜 대비 17% 할인된 가격으로 이용하실 수 있으며, 추가로 입시 전략 리포트가 제공됩니다.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                    Q
                  </span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 ml-9 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
