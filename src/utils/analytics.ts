/**
 * Analytics Utility
 * 이벤트 트래킹 및 분석 시스템
 *
 * Supports:
 * - Google Analytics 4
 * - Mixpanel (준비)
 * - Amplitude (준비)
 * - Custom events
 */

// 이벤트 타입 정의
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: string;
  userId?: string;
  sessionId?: string;
}

// 사용자 속성
export interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  plan?: string;
  signupDate?: string;
  [key: string]: any;
}

class Analytics {
  private userId: string | null = null;
  private sessionId: string;
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
  }

  /**
   * 세션 ID 생성
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 로컬 스토리지에서 사용자 ID 로드
   */
  private loadUserId(): void {
    if (typeof window !== 'undefined') {
      this.userId = localStorage.getItem('analytics_user_id');
    }
  }

  /**
   * 사용자 식별
   */
  identify(userId: string, properties?: UserProperties): void {
    this.userId = userId;

    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_user_id', userId);
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
        ...properties,
      });
    }

    // Mixpanel (향후 추가)
    // if (window.mixpanel) {
    //   window.mixpanel.identify(userId);
    //   window.mixpanel.people.set(properties);
    // }

    console.log('[Analytics] User identified:', userId, properties);
  }

  /**
   * 이벤트 추적
   */
  track(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof window !== 'undefined' ? document.referrer : '',
      },
      userId: this.userId || undefined,
      timestamp: new Date().toISOString(),
    };

    // 로컬 저장 (개발/디버깅용)
    this.events.push(event);
    if (this.events.length > 100) {
      this.events = this.events.slice(-100); // 최근 100개만 유지
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }

    // Mixpanel (향후 추가)
    // if (window.mixpanel) {
    //   window.mixpanel.track(eventName, properties);
    // }

    // 콘솔 로그 (개발 환경)
    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventName, properties);
    }
  }

  /**
   * 페이지뷰 추적
   */
  page(pageName: string, properties?: Record<string, any>): void {
    this.track('page_view', {
      page_name: pageName,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      page_title: typeof window !== 'undefined' ? document.title : '',
      ...properties,
    });
  }

  /**
   * 회원가입 퍼널 이벤트
   */
  trackSignup = {
    started: (source?: string) => {
      this.track('signup_started', {
        source,
        page: typeof window !== 'undefined' ? window.location.pathname : '',
      });
    },

    completed: (method: 'email' | 'google' | 'kakao', userId: string) => {
      this.track('signup_completed', {
        method,
        userId,
      });
    },

    failed: (error: string, step: string) => {
      this.track('signup_failed', {
        error,
        step,
      });
    },
  };

  /**
   * Magic Moments 추적
   */
  trackMagicMoment = {
    firstAiReview: (essayId: string, timeSinceSignup: number) => {
      this.track('magic_moment_first_ai_review', {
        essayId,
        time_since_signup_minutes: Math.round(timeSinceSignup / 60000),
      });
    },

    firstExpertMatch: (expertId: string, matchQuality: number) => {
      this.track('magic_moment_first_expert_match', {
        expertId,
        matchQuality,
      });
    },

    universityResearch: (universityCount: number) => {
      this.track('magic_moment_university_research', {
        universityCount,
      });
    },

    dailyStreak: (streakDays: number) => {
      this.track('magic_moment_daily_streak', {
        streakDays,
      });
    },
  };

  /**
   * 결제 퍼널 이벤트
   */
  trackPayment = {
    initiated: (tier: string, price: number) => {
      this.track('payment_initiated', {
        tier,
        price,
        currency: 'KRW',
      });
    },

    completed: (tier: string, amount: number, method: string, transactionId: string) => {
      this.track('payment_completed', {
        tier,
        amount,
        method,
        transactionId,
        currency: 'KRW',
      });

      // Google Analytics 4 Purchase Event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'purchase', {
          transaction_id: transactionId,
          value: amount,
          currency: 'KRW',
          items: [
            {
              item_id: tier,
              item_name: `EssayBridge ${tier}`,
              price: amount,
              quantity: 1,
            },
          ],
        });
      }
    },

    failed: (tier: string, reason: string) => {
      this.track('payment_failed', {
        tier,
        reason,
      });
    },
  };

  /**
   * 기능 사용 추적
   */
  trackFeature = {
    used: (featureName: string, duration?: number) => {
      this.track('feature_used', {
        feature_name: featureName,
        duration_seconds: duration,
      });
    },

    chatMessageSent: (roomType: string, hasMention: boolean) => {
      this.track('chat_message_sent', {
        room_type: roomType,
        has_mention: hasMention,
      });
    },

    essaySubmitted: (wordCount: number, category: string) => {
      this.track('essay_submitted', {
        word_count: wordCount,
        category,
      });
    },

    universityViewed: (universityId: string, tier: string) => {
      this.track('university_viewed', {
        university_id: universityId,
        tier,
      });
    },
  };

  /**
   * 에러 추적
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context,
    });
  }

  /**
   * 저장된 이벤트 가져오기 (디버깅용)
   */
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  /**
   * 이벤트 초기화
   */
  clearEvents(): void {
    this.events = [];
  }
}

// Singleton instance
const analytics = new Analytics();

export default analytics;

// Named exports for convenience
export const { track, page, identify, trackError } = {
  track: analytics.track.bind(analytics),
  page: analytics.page.bind(analytics),
  identify: analytics.identify.bind(analytics),
  trackError: analytics.trackError.bind(analytics),
};

export const {
  trackSignup,
  trackMagicMoment,
  trackPayment,
  trackFeature,
} = analytics;
