import { useState } from 'react';
import { FiCalendar, FiClock, FiStar, FiAward } from 'react-icons/fi';
import { sampleConsultants } from '../data/sampleData';

const Consulting = () => {
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultingType, setConsultingType] = useState('essay_review');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBooking = () => {
    setShowBookingModal(true);
    // Simulate booking
    setTimeout(() => {
      setShowBookingModal(false);
      alert('상담이 예약되었습니다!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">입시 컨설팅</h1>
          <p className="text-xl text-gray-600">전문 컨설턴트와 함께 합격 전략을 세워보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultant List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">컨설팅 유형 선택</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'essay_review', label: '논술 전략 컨설팅', price: '50,000원' },
                  { value: 'university_selection', label: '대학 선택 컨설팅', price: '60,000원' },
                  { value: 'interview_prep', label: '면접 준비', price: '80,000원' },
                  { value: 'general', label: '종합 입시 전략', price: '100,000원' },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setConsultingType(type.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      consultingType === type.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.price} / 1시간</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">컨설턴트 선택</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {sampleConsultants.map((consultant) => (
                  <div key={consultant.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={consultant.profileImage}
                        alt={consultant.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{consultant.name}</h3>
                          <div className="flex items-center">
                            <FiStar className="w-5 h-5 text-yellow-500 mr-1" />
                            <span className="font-semibold text-gray-900">{consultant.rating}</span>
                            <span className="text-sm text-gray-600 ml-1">
                              ({consultant.reviewCount})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <FiAward className="w-4 h-4 mr-1" />
                          <span>{consultant.experience}년 경력</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {consultant.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => setSelectedConsultant(consultant.id)}
                          className={`btn-${
                            selectedConsultant === consultant.id ? 'primary' : 'outline'
                          } text-sm px-4 py-2`}
                        >
                          {selectedConsultant === consultant.id ? '선택됨' : '선택하기'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">예약 정보</h2>

              {selectedConsultant ? (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상담 날짜
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상담 시간
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">시간 선택</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상담 내용 (선택)
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="궁금한 내용이나 준비하고 싶은 주제를 자유롭게 작성해주세요."
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">상담료</span>
                      <span className="font-medium">50,000원</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>총 금액</span>
                      <span className="text-primary-600">50,000원</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    예약하기
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    예약 후 24시간 전까지 무료 취소 가능합니다.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiCalendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>컨설턴트를 먼저 선택해주세요</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">1:1 컨설팅의 장점</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">맞춤형 전략</h3>
              <p className="text-sm text-gray-600">
                개인의 강점과 약점을 분석하여 최적의 입시 전략을 제시합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">전문가 노하우</h3>
              <p className="text-sm text-gray-600">
                수년간의 입시 경험을 바탕으로 실질적인 조언을 받을 수 있습니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">시간 절약</h3>
              <p className="text-sm text-gray-600">
                효율적인 학습 계획으로 시간을 절약하고 목표에 집중할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-900 font-medium">예약 처리 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consulting;
