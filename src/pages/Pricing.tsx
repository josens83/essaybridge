import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import { monthlyPlans, yearlyPlans } from '../data/pricingPlans';
import { useAuth } from '../contexts/AuthContext';
import type { PricingPlan } from '../types';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            합격을 위한 최적의 플랜을 선택하세요
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            전문가의 첨삭과 컨설팅으로 논술 실력을 키우세요
          </p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow transition-colors">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              월간 결제
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${
                billingPeriod === 'yearly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              연간 결제
              <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs px-2 py-0.5 rounded-full">
                17% 할인
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-primary-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-primary-600 text-white text-center py-2 text-sm font-semibold">
                  가장 인기있는 플랜
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.displayName}
                </h3>

                <div className="mb-6">
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-400 dark:text-gray-500 line-through text-lg">
                        {plan.originalPrice.toLocaleString()}원
                      </span>
                      <span className="bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 text-xs px-2 py-1 rounded-full font-semibold">
                        {plan.discount}% 할인
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      원 / {plan.period === 'monthly' ? '월' : '년'}
                    </span>
                  </div>
                  {plan.period === 'yearly' && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      월 {Math.floor(plan.price / 12).toLocaleString()}원
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mb-6 ${
                    plan.popular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                >
                  {plan.name === 'free' ? '무료 시작하기' : '플랜 선택'}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              플랜 상세 비교
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">
                      기능
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.id}
                        className="text-center py-4 px-4 text-gray-900 dark:text-white font-semibold"
                      >
                        {plan.displayName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      월간 논술 첨삭
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {plan.essayReviewsPerMonth === 999
                            ? '무제한'
                            : `${plan.essayReviewsPerMonth}회`}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      월간 1:1 컨설팅
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {plan.consultingHoursPerMonth === 0
                            ? '-'
                            : `${plan.consultingHoursPerMonth}시간`}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      전체 강의 수강
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        {plan.courseAccess ? (
                          <FiCheck className="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto" />
                        ) : (
                          <FiX className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            자주 묻는 질문
          </h2>

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
                a: '플랜에 따라 다르며, 프리미엄은 24시간, 프로는 12시간 내 첨삭이 완료됩니다. 베이직은 평균 48시간이 소요됩니다.',
              },
              {
                q: '연간 플랜의 혜택은 무엇인가요?',
                a: '연간 플랜은 월간 플랜 대비 17% 할인된 가격으로 이용하실 수 있으며, 추가로 입시 전략 리포트가 제공됩니다.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
