import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiDownload, FiArrowRight } from 'react-icons/fi';
import type { PricingPlan, PaymentMethod } from '../types';

interface PaymentSuccessState {
  plan: PricingPlan;
  paymentMethod: PaymentMethod;
  amount: number;
  orderId: string;
}

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentSuccessState | null;

  useEffect(() => {
    // If no state, redirect to pricing
    if (!state) {
      navigate('/pricing');
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const { plan, paymentMethod, amount, orderId } = state;

  const paymentMethodNames: Record<PaymentMethod, string> = {
    card: '신용/체크카드',
    kakaopay: '카카오페이',
    naverpay: '네이버페이',
    tosspay: '토스페이',
    bank_transfer: '계좌이체',
  };

  const subscriptionStartDate = new Date();
  const subscriptionEndDate = new Date(
    subscriptionStartDate.getTime() +
      (plan.period === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
  );

  const handleDownloadReceipt = () => {
    // Simulate receipt download
    alert('영수증 다운로드 기능은 곧 추가될 예정입니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <FiCheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            결제가 완료되었습니다!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            EssayBridge {plan.displayName} 플랜을 이용하실 수 있습니다.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            주문 정보
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">주문번호</span>
              <span className="font-mono text-gray-900 dark:text-white font-medium">
                {orderId}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">결제일시</span>
              <span className="text-gray-900 dark:text-white">
                {new Date().toLocaleString('ko-KR')}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">구독 플랜</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {plan.displayName} ({plan.period === 'monthly' ? '월간' : '연간'})
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">결제 방법</span>
              <span className="text-gray-900 dark:text-white">
                {paymentMethodNames[paymentMethod]}
              </span>
            </div>

            <div className="flex justify-between py-3 pt-6">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                결제 금액
              </span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {amount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            구독 정보
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">구독 시작일</span>
              <span className="text-gray-900 dark:text-white">
                {subscriptionStartDate.toLocaleDateString('ko-KR')}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">다음 결제일</span>
              <span className="text-gray-900 dark:text-white">
                {subscriptionEndDate.toLocaleDateString('ko-KR')}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">자동 결제</span>
              <span className="text-gray-900 dark:text-white">활성화</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">포함된 혜택:</span>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
              {plan.features.slice(0, 5).map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
              {plan.features.length > 5 && (
                <li className="text-blue-600 dark:text-blue-400">
                  외 {plan.features.length - 5}개 혜택
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full btn-primary py-4 text-lg flex items-center justify-center"
          >
            대시보드로 이동
            <FiArrowRight className="w-5 h-5 ml-2" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadReceipt}
              className="btn-outline py-3 flex items-center justify-center"
            >
              <FiDownload className="w-5 h-5 mr-2" />
              영수증 다운로드
            </button>

            <button
              onClick={() => navigate('/account/subscription')}
              className="btn-outline py-3 flex items-center justify-center"
            >
              구독 관리
            </button>
          </div>
        </div>

        {/* Help Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            결제 관련 문의사항이 있으시면{' '}
            <a
              href="/support"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              고객센터
            </a>
            로 연락 주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
