import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { pricingPlans } from '../data/sampleData';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (planName: string) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    navigate('/payment', { state: { planName } });
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            합격을 위한 최적의 플랜을 선택하세요
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            전문가 첨삭부터 1:1 컨설팅까지, 목표에 맞는 플랜을 찾아보세요
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              월간 결제
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              연간 결제
              <span className="ml-2 text-xs text-secondary-600 font-semibold">20% 할인</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => {
            const price = billingCycle === 'yearly' ? plan.price * 12 * 0.8 : plan.price;
            const isPopular = plan.name === 'basic';

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                  isPopular ? 'ring-2 ring-primary-600 transform scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="bg-primary-600 text-white text-center py-2 text-sm font-semibold">
                    가장 인기있는 플랜
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name === 'free' && '프리'}
                    {plan.name === 'basic' && '베이직'}
                    {plan.name === 'premium' && '프리미엄'}
                  </h3>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {price.toLocaleString()}원
                    </span>
                    {plan.name !== 'free' && (
                      <span className="text-gray-600">
                        /{billingCycle === 'monthly' ? '월' : '년'}
                      </span>
                    )}
                  </div>

                  {billingCycle === 'yearly' && plan.name !== 'free' && (
                    <div className="mb-4 text-sm text-secondary-600 font-medium">
                      월 {Math.round(price / 12).toLocaleString()}원
                    </div>
                  )}

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="w-5 h-5 text-secondary-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.name)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      isPopular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.name === 'free' ? '무료로 시작하기' : '구독하기'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">개별 서비스</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">논술 첨삭 (1회)</h3>
              <p className="text-2xl font-bold text-primary-600 mb-3">25,000원</p>
              <p className="text-sm text-gray-600 mb-4">전문가의 상세한 첨삭</p>
              <button className="btn-outline w-full text-sm py-2">신청하기</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">1:1 컨설팅 (1시간)</h3>
              <p className="text-2xl font-bold text-primary-600 mb-3">50,000원</p>
              <p className="text-sm text-gray-600 mb-4">입시 전략 맞춤 컨설팅</p>
              <button className="btn-outline w-full text-sm py-2">신청하기</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">모의 면접 (1회)</h3>
              <p className="text-2xl font-bold text-primary-600 mb-3">80,000원</p>
              <p className="text-sm text-gray-600 mb-4">실전 같은 모의 면접</p>
              <button className="btn-outline w-full text-sm py-2">신청하기</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">강의 (개별 구매)</h3>
              <p className="text-2xl font-bold text-primary-600 mb-3">80,000원~</p>
              <p className="text-sm text-gray-600 mb-4">대학별 맞춤 강의</p>
              <button className="btn-outline w-full text-sm py-2">둘러보기</button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                구독 플랜은 언제든지 변경할 수 있나요?
              </h3>
              <p className="text-gray-600">
                네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 시점부터
                새로운 플랜이 적용됩니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">환불 정책은 어떻게 되나요?</h3>
              <p className="text-gray-600">
                서비스 이용 후 7일 이내에는 전액 환불이 가능합니다. 단, 첨삭이나 컨설팅 서비스를
                이용한 경우 해당 서비스 비용은 차감됩니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                첨삭 횟수가 남았는데 다음 달로 이월되나요?
              </h3>
              <p className="text-gray-600">
                네, 사용하지 않은 첨삭 횟수는 다음 달로 이월됩니다. 단, 최대 2개월까지만
                이월됩니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">어떤 결제 수단을 사용할 수 있나요?</h3>
              <p className="text-gray-600">
                신용카드, 체크카드, 계좌이체, 카카오페이, 네이버페이 등 다양한 결제 수단을
                지원합니다.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            아직 고민 중이신가요?
          </h2>
          <p className="text-lg mb-6 text-primary-100">
            무료 체험으로 EssayBridge의 차별화된 서비스를 경험해보세요
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            무료로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
