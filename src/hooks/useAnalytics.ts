/**
 * useAnalytics Hook
 * React 컴포넌트에서 쉽게 분석 이벤트를 추적할 수 있게 해주는 훅
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  // 페이지 변경 시 자동으로 페이지뷰 추적
  useEffect(() => {
    analytics.page(location.pathname, {
      search: location.search,
      hash: location.hash,
    });
  }, [location]);

  return analytics;
};

/**
 * 페이지뷰 추적 전용 훅
 */
export const usePageView = (pageName?: string) => {
  const location = useLocation();

  useEffect(() => {
    const name = pageName || location.pathname;
    analytics.page(name);
  }, [location, pageName]);
};

/**
 * 이벤트 추적 콜백
 */
export const useTrackEvent = () => {
  return useCallback((eventName: string, properties?: Record<string, any>) => {
    analytics.track(eventName, properties);
  }, []);
};

/**
 * Magic Moment 추적 훅
 */
export const useMagicMoment = () => {
  const trackFirstAiReview = useCallback((essayId: string, timeSinceSignup: number) => {
    analytics.trackMagicMoment.firstAiReview(essayId, timeSinceSignup);
  }, []);

  const trackFirstExpertMatch = useCallback((expertId: string, matchQuality: number) => {
    analytics.trackMagicMoment.firstExpertMatch(expertId, matchQuality);
  }, []);

  const trackUniversityResearch = useCallback((universityCount: number) => {
    analytics.trackMagicMoment.universityResearch(universityCount);
  }, []);

  const trackDailyStreak = useCallback((streakDays: number) => {
    analytics.trackMagicMoment.dailyStreak(streakDays);
  }, []);

  return {
    trackFirstAiReview,
    trackFirstExpertMatch,
    trackUniversityResearch,
    trackDailyStreak,
  };
};

/**
 * 결제 추적 훅
 */
export const usePaymentTracking = () => {
  const trackPaymentInitiated = useCallback((tier: string, price: number) => {
    analytics.trackPayment.initiated(tier, price);
  }, []);

  const trackPaymentCompleted = useCallback(
    (tier: string, amount: number, method: string, transactionId: string) => {
      analytics.trackPayment.completed(tier, amount, method, transactionId);
    },
    []
  );

  const trackPaymentFailed = useCallback((tier: string, reason: string) => {
    analytics.trackPayment.failed(tier, reason);
  }, []);

  return {
    trackPaymentInitiated,
    trackPaymentCompleted,
    trackPaymentFailed,
  };
};

/**
 * 기능 사용 추적 훅
 */
export const useFeatureTracking = () => {
  const trackFeatureUsed = useCallback((featureName: string, duration?: number) => {
    analytics.trackFeature.used(featureName, duration);
  }, []);

  const trackChatMessage = useCallback((roomType: string, hasMention: boolean) => {
    analytics.trackFeature.chatMessageSent(roomType, hasMention);
  }, []);

  const trackEssaySubmitted = useCallback((wordCount: number, category: string) => {
    analytics.trackFeature.essaySubmitted(wordCount, category);
  }, []);

  const trackUniversityViewed = useCallback((universityId: string, tier: string) => {
    analytics.trackFeature.universityViewed(universityId, tier);
  }, []);

  return {
    trackFeatureUsed,
    trackChatMessage,
    trackEssaySubmitted,
    trackUniversityViewed,
  };
};

export default useAnalytics;
