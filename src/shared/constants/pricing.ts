/**
 * Pricing Plan Constants
 * Centralized pricing definitions
 */

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  essayCredits: number;
  consultingHours: number;
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    essayCredits: 1,
    consultingHours: 0,
    features: [
      '기본 논술 첨삭 1회',
      'AI 문법 검사',
      '커뮤니티 이용',
      '무료 강의 시청',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 29900,
    yearlyPrice: 299000,
    essayCredits: 5,
    consultingHours: 1,
    features: [
      '전문가 논술 첨삭 월 5회',
      '1:1 컨설팅 월 1시간',
      '모든 강의 무제한 수강',
      '합격 사례 분석 자료',
      '이메일 지원',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 59900,
    yearlyPrice: 599000,
    essayCredits: 15,
    consultingHours: 3,
    isPopular: true,
    badge: '가장 인기있는 플랜',
    features: [
      '전문가 논술 첨삭 월 15회',
      '1:1 컨설팅 월 3시간',
      '우선 첨삭 서비스',
      '대학별 맞춤 전략 자료',
      '실시간 채팅 지원',
      '모의 면접 2회',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 99900,
    yearlyPrice: 999000,
    essayCredits: -1, // Unlimited
    consultingHours: 10,
    badge: '최고급 플랜',
    features: [
      '무제한 논술 첨삭',
      '1:1 컨설팅 월 10시간',
      '24시간 우선 첨삭',
      '전담 컨설턴트 배정',
      '맞춤형 학습 플랜',
      '무제한 모의 면접',
      '합격 보장 프로그램',
    ],
  },
];

/**
 * Calculate yearly discount percentage
 */
export const calculateYearlyDiscount = (monthlyPrice: number, yearlyPrice: number): number => {
  if (monthlyPrice === 0 || yearlyPrice === 0) return 0;
  const monthlyTotal = monthlyPrice * 12;
  return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
};

/**
 * Get plan by ID
 */
export const getPlanById = (planId: string): PricingPlan | undefined => {
  return PRICING_PLANS.find((plan) => plan.id === planId);
};

/**
 * Format price in Korean Won
 */
export const formatPrice = (price: number): string => {
  if (price === 0) return '무료';
  return `₩${price.toLocaleString('ko-KR')}`;
};
