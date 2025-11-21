/**
 * Feature Toggle System - 런타임 기능 활성화/비활성화
 *
 * 목표:
 * - A/B 테스트 지원
 * - 점진적 기능 배포 (Progressive Rollout)
 * - 사용자별 기능 제어
 * - 긴급 기능 비활성화 (Kill Switch)
 */

/**
 * 기능 플래그 정의
 */
export const FeatureFlag = {
  // 채팅 기능
  TYPING_INDICATOR: 'typing_indicator',
  READ_RECEIPTS: 'read_receipts',
  MESSAGE_REACTIONS: 'message_reactions',
  MESSAGE_EDITING: 'message_editing',
  MESSAGE_THREADING: 'message_threading',
  RICH_TEXT_FORMATTING: 'rich_text_formatting',

  // 파일 공유
  FILE_UPLOAD: 'file_upload',
  IMAGE_PREVIEW: 'image_preview',
  FILE_PREVIEW: 'file_preview',

  // 링크 기능
  LINK_PREVIEW: 'link_preview',
  LINK_UNFURLING: 'link_unfurling',

  // 알림
  DESKTOP_NOTIFICATIONS: 'desktop_notifications',
  SOUND_NOTIFICATIONS: 'sound_notifications',
  MENTION_NOTIFICATIONS: 'mention_notifications',

  // 고급 기능
  VOICE_MESSAGES: 'voice_messages',
  VIDEO_CALLS: 'video_calls',
  SCREEN_SHARING: 'screen_sharing',
  MESSAGE_SEARCH: 'message_search',
  MESSAGE_TRANSLATION: 'message_translation',

  // 실험적 기능
  AI_SUGGESTIONS: 'ai_suggestions',
  SMART_REPLIES: 'smart_replies',
} as const;

export type FeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];

/**
 * 기능 설정
 */
export interface FeatureConfig {
  enabled: boolean;
  rolloutPercentage?: number; // 0-100, 점진적 배포용
  allowedUserIds?: string[]; // 특정 사용자에게만 활성화
  deniedUserIds?: string[]; // 특정 사용자에게만 비활성화
  metadata?: Record<string, unknown>;
}

/**
 * 기능 토글 매니저
 */
export class FeatureToggleManager {
  private features = new Map<FeatureFlag, FeatureConfig>();
  private listeners = new Map<FeatureFlag, Set<(enabled: boolean) => void>>();
  private userId?: string;

  constructor(userId?: string) {
    this.userId = userId;
    this.initializeDefaults();
  }

  /**
   * 기본 기능 플래그 초기화
   */
  private initializeDefaults(): void {
    // 기본적으로 활성화된 기능
    const enabledByDefault: FeatureFlag[] = [
      FeatureFlag.TYPING_INDICATOR,
      FeatureFlag.READ_RECEIPTS,
      FeatureFlag.RICH_TEXT_FORMATTING,
      FeatureFlag.FILE_UPLOAD,
      FeatureFlag.IMAGE_PREVIEW,
      FeatureFlag.LINK_PREVIEW,
      FeatureFlag.DESKTOP_NOTIFICATIONS,
      FeatureFlag.SOUND_NOTIFICATIONS,
      FeatureFlag.MENTION_NOTIFICATIONS,
    ];

    // 실험적 기능 (기본 비활성화)
    const experimentalFeatures: FeatureFlag[] = [
      FeatureFlag.MESSAGE_REACTIONS,
      FeatureFlag.MESSAGE_EDITING,
      FeatureFlag.MESSAGE_THREADING,
      FeatureFlag.VOICE_MESSAGES,
      FeatureFlag.VIDEO_CALLS,
      FeatureFlag.SCREEN_SHARING,
      FeatureFlag.MESSAGE_SEARCH,
      FeatureFlag.MESSAGE_TRANSLATION,
      FeatureFlag.AI_SUGGESTIONS,
      FeatureFlag.SMART_REPLIES,
    ];

    // 기본 활성화
    enabledByDefault.forEach(flag => {
      this.features.set(flag, { enabled: true });
    });

    // 실험적 기능 비활성화
    experimentalFeatures.forEach(flag => {
      this.features.set(flag, { enabled: false });
    });
  }

  /**
   * 기능 활성화 여부 확인
   */
  isEnabled(flag: FeatureFlag): boolean {
    const config = this.features.get(flag);
    if (!config) {
      return false;
    }

    // 전체 비활성화
    if (!config.enabled) {
      return false;
    }

    // 사용자 ID가 없으면 기본 활성화 상태 반환
    if (!this.userId) {
      return config.enabled;
    }

    // 명시적 거부 확인
    if (config.deniedUserIds?.includes(this.userId)) {
      return false;
    }

    // 명시적 허용 확인
    if (config.allowedUserIds && config.allowedUserIds.length > 0) {
      return config.allowedUserIds.includes(this.userId);
    }

    // 점진적 배포 확인
    if (config.rolloutPercentage !== undefined) {
      return this.isInRollout(flag, config.rolloutPercentage);
    }

    return config.enabled;
  }

  /**
   * 기능 활성화
   */
  enable(flag: FeatureFlag, config?: Partial<FeatureConfig>): void {
    const existing = this.features.get(flag) || { enabled: false };
    this.features.set(flag, {
      ...existing,
      ...config,
      enabled: true,
    });

    this.notifyListeners(flag, true);
  }

  /**
   * 기능 비활성화
   */
  disable(flag: FeatureFlag): void {
    const existing = this.features.get(flag);
    if (existing) {
      this.features.set(flag, { ...existing, enabled: false });
      this.notifyListeners(flag, false);
    }
  }

  /**
   * 기능 토글
   */
  toggle(flag: FeatureFlag): boolean {
    const currentState = this.isEnabled(flag);
    if (currentState) {
      this.disable(flag);
    } else {
      this.enable(flag);
    }
    return !currentState;
  }

  /**
   * 기능 설정 가져오기
   */
  getConfig(flag: FeatureFlag): FeatureConfig | undefined {
    return this.features.get(flag);
  }

  /**
   * 모든 기능 상태 가져오기
   */
  getAllFeatures(): Map<FeatureFlag, boolean> {
    const result = new Map<FeatureFlag, boolean>();
    this.features.forEach((_, flag) => {
      result.set(flag, this.isEnabled(flag));
    });
    return result;
  }

  /**
   * 기능 변경 리스너 등록
   */
  subscribe(flag: FeatureFlag, callback: (enabled: boolean) => void): () => void {
    if (!this.listeners.has(flag)) {
      this.listeners.set(flag, new Set());
    }

    this.listeners.get(flag)!.add(callback);

    // 구독 해제 함수 반환
    return () => {
      const listeners = this.listeners.get(flag);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * 사용자 ID 설정
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * 점진적 배포 확인 (일관성 있는 해시 기반)
   */
  private isInRollout(flag: FeatureFlag, percentage: number): boolean {
    if (!this.userId) {
      return false;
    }

    // 사용자 ID + 기능 플래그로 해시 생성 (간단한 문자열 해시)
    const hash = this.simpleHash(`${this.userId}-${flag}`);
    const normalizedHash = hash % 100;

    return normalizedHash < percentage;
  }

  /**
   * 간단한 문자열 해시 함수
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * 리스너 알림
   */
  private notifyListeners(flag: FeatureFlag, enabled: boolean): void {
    const listeners = this.listeners.get(flag);
    if (listeners) {
      listeners.forEach(callback => callback(enabled));
    }
  }

  /**
   * 로컬 스토리지에서 설정 로드
   */
  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('feature-toggles');
      if (stored) {
        const data = JSON.parse(stored) as Record<string, FeatureConfig>;
        Object.entries(data).forEach(([flag, config]) => {
          this.features.set(flag as FeatureFlag, config);
        });
      }
    } catch (error) {
      console.error('[FeatureToggle] Failed to load from storage:', error);
    }
  }

  /**
   * 로컬 스토리지에 설정 저장
   */
  saveToStorage(): void {
    try {
      const data: Record<string, FeatureConfig> = {};
      this.features.forEach((config, flag) => {
        data[flag] = config;
      });
      localStorage.setItem('feature-toggles', JSON.stringify(data));
    } catch (error) {
      console.error('[FeatureToggle] Failed to save to storage:', error);
    }
  }

  /**
   * 설정 초기화
   */
  reset(): void {
    this.features.clear();
    this.initializeDefaults();
    localStorage.removeItem('feature-toggles');
  }
}

// 싱글톤 인스턴스
let featureToggleInstance: FeatureToggleManager | null = null;

/**
 * 글로벌 Feature Toggle 인스턴스 가져오기
 */
export function getFeatureToggle(userId?: string): FeatureToggleManager {
  if (!featureToggleInstance) {
    featureToggleInstance = new FeatureToggleManager(userId);
    featureToggleInstance.loadFromStorage();
  } else if (userId && !featureToggleInstance['userId']) {
    featureToggleInstance.setUserId(userId);
  }
  return featureToggleInstance;
}

/**
 * Feature Toggle Hook (React용)
 */
export function useFeatureToggle(flag: FeatureFlag): boolean {
  const [enabled, setEnabled] = React.useState(() => getFeatureToggle().isEnabled(flag));

  React.useEffect(() => {
    const unsubscribe = getFeatureToggle().subscribe(flag, setEnabled);
    return unsubscribe;
  }, [flag]);

  return enabled;
}

// React import for hook
import React from 'react';

export default FeatureToggleManager;
