import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCreditCard, FiSmartphone, FiCheckCircle } from 'react-icons/fi';
import { pricingPlans } from '../../../data/sampleData';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const planName = location.state?.planName || 'basic';

  const selectedPlan = pricingPlans.find((p) => p.name === planName);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardHolder: '',
    phone: '',
    agreeToTerms: false,
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessing(false);
    setSuccess(true);

    // Redirect to dashboard after 3 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-10 h-10 text-secondary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h2>
          <p className="text-gray-600 mb-6">
            {selectedPlan?.name === 'basic' ? '베이직' : '프리미엄'} 플랜 구독이 시작되었습니다.
          </p>
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              곧 대시보드로 이동합니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">결제 정보</h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  결제 수단 선택
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FiCreditCard className="w-5 h-5 mr-2" />
                    <span>신용/체크카드</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center transition-colors ${
                      paymentMethod === 'mobile'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FiSmartphone className="w-5 h-5 mr-2" />
                    <span>간편결제</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {paymentMethod === 'card' ? (
                  <>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        카드 번호
                      </label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        required
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className="input-field"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                          유효기간
                        </label>
                        <input
                          id="cardExpiry"
                          name="cardExpiry"
                          type="text"
                          required
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className="input-field"
                          maxLength={5}
                        />
                      </div>

                      <div>
                        <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          id="cardCvc"
                          name="cardCvc"
                          type="text"
                          required
                          value={formData.cardCvc}
                          onChange={handleChange}
                          placeholder="123"
                          className="input-field"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-2">
                        카드 소유자 이름
                      </label>
                      <input
                        id="cardHolder"
                        name="cardHolder"
                        type="text"
                        required
                        value={formData.cardHolder}
                        onChange={handleChange}
                        placeholder="HONG GILDONG"
                        className="input-field"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      휴대폰 번호
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-1234-5678"
                      className="input-field"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      카카오페이, 네이버페이, 토스 등의 간편결제를 이용할 수 있습니다.
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                      결제 진행을 위한 개인정보 제공 및 이용약관에 동의합니다.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? '결제 처리 중...' : `${selectedPlan?.price.toLocaleString()}원 결제하기`}
                </button>

                <p className="text-xs text-center text-gray-500">
                  결제는 안전하게 암호화되어 처리됩니다.
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">주문 요약</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">플랜</span>
                  <span className="font-medium">
                    {selectedPlan?.name === 'basic' ? '베이직' : '프리미엄'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제 주기</span>
                  <span className="font-medium">월간</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">첨삭 횟수</span>
                  <span className="font-medium">{selectedPlan?.essayReviewsPerMonth}회/월</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">컨설팅</span>
                  <span className="font-medium">{selectedPlan?.consultingHoursPerMonth}시간/월</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>총 결제 금액</span>
                  <span className="text-primary-600">{selectedPlan?.price.toLocaleString()}원</span>
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">포함된 혜택</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {selectedPlan?.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheckCircle className="w-4 h-4 text-secondary-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 text-xs text-gray-500 text-center">
                <p>구독은 언제든지 취소할 수 있습니다.</p>
                <p className="mt-1">7일 이내 전액 환불 가능</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
