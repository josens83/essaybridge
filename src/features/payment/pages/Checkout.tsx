import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCreditCard, FiCheck, FiLock } from 'react-icons/fi';
import { useAuth } from '../../auth';
import type { PricingPlan, PaymentMethod } from '../../../types';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const plan = location.state?.plan as PricingPlan;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [billingInfo, setBillingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            플랜을 선택해주세요
          </h2>
          <button onClick={() => navigate('/pricing')} className="btn-primary">
            요금제 보기
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { id: 'card', name: '신용/체크카드', icon: '💳' },
    { id: 'kakaopay', name: '카카오페이', icon: '🟡' },
    { id: 'naverpay', name: '네이버페이', icon: '🟢' },
    { id: 'tosspay', name: '토스페이', icon: '💙' },
    { id: 'bank_transfer', name: '계좌이체', icon: '🏦' },
  ];

  const handlePayment = async () => {
    if (!agreeToTerms) {
      alert('약관에 동의해주세요.');
      return;
    }

    if (!billingInfo.name || !billingInfo.email || !billingInfo.phone) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessing(false);

    // Navigate to success page
    navigate('/payment/success', {
      state: {
        plan,
        paymentMethod,
        amount: plan.price,
        orderId: `ORD-${Date.now()}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">결제하기</h1>
          <p className="text-gray-600 dark:text-gray-400">
            안전한 결제로 구독을 시작하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                결제 정보
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.name}
                    onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                    className="input-field"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    전화번호 *
                  </label>
                  <input
                    type="tel"
                    value={billingInfo.phone}
                    onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                    className="input-field"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                결제 수단
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === method.id
                        ? 'border-primary-600 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {method.name}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start">
                    <FiCreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-semibold mb-1">안전한 카드 결제</p>
                      <p>결제 정보는 암호화되어 안전하게 처리됩니다.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                약관 동의
              </h2>

              <div className="space-y-3">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="ml-3 text-sm">
                    <span className="text-gray-900 dark:text-white font-medium">
                      (필수) 서비스 약관, 개인정보 처리 및 수집, 환불정책에 모두 동의합니다.
                    </span>
                    <div className="mt-1 space-y-1">
                      <a
                        href="/terms"
                        className="block text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        서비스 약관
                      </a>
                      <a
                        href="/privacy"
                        className="block text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        개인정보처리방침
                      </a>
                    </div>
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={processing || !agreeToTerms}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  결제 처리 중...
                </>
              ) : (
                <>
                  <FiLock className="w-5 h-5 mr-2" />
                  {plan.price.toLocaleString()}원 결제하기
                </>
              )}
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                주문 정보
              </h2>

              <div className="space-y-4">
                {/* Plan Info */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {plan.displayName} 플랜
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {plan.period === 'monthly' ? '월간 결제' : '연간 결제'}
                  </p>

                  <ul className="space-y-2">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <FiCheck className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-sm text-gray-500 dark:text-gray-400 ml-6">
                        외 {plan.features.length - 3}개 혜택
                      </li>
                    )}
                  </ul>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2">
                  {plan.originalPrice && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">정가</span>
                        <span className="text-gray-600 dark:text-gray-400 line-through">
                          {plan.originalPrice.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600 dark:text-secondary-400">
                          할인 ({plan.discount}%)
                        </span>
                        <span className="text-secondary-600 dark:text-secondary-400">
                          -{(plan.originalPrice - plan.price).toLocaleString()}원
                        </span>
                      </div>
                    </>
                  )}

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        최종 결제금액
                      </span>
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {plan.price.toLocaleString()}원
                      </span>
                    </div>
                    {plan.period === 'yearly' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                        월 {Math.floor(plan.price / 12).toLocaleString()}원
                      </p>
                    )}
                  </div>
                </div>

                {/* Renewal Info */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      다음 결제 예정일:{' '}
                      {new Date(
                        Date.now() + (plan.period === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      언제든지 구독을 취소할 수 있습니다.
                    </p>
                  </div>
                </div>

                {/* Security Info */}
                <div className="pt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FiLock className="w-4 h-4 mr-2" />
                  <span>SSL 보안 결제</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
