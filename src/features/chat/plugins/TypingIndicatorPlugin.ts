/**
 * TypingIndicatorPlugin - 타이핑 인디케이터 플러그인
 *
 * 책임:
 * - 사용자 타이핑 상태 감지 및 전파
 * - 타이핑 타임아웃 관리
 * - 다른 사용자의 타이핑 상태 추적
 *
 * 특징:
 * - 완전히 독립적인 모듈
 * - EventBus를 통한 통신만 사용
 * - 다른 채팅 기능에 영향 없이 활성화/비활성화 가능
 */

import { BasePlugin } from '../core/Plugin';
import type { PluginContext, PluginMetadata } from '../core/Plugin';
import { PluginStatus } from '../core/Plugin';
import { FeatureFlag, getFeatureToggle } from '../core/FeatureToggle';

interface TypingState {
  userId: string;
  roomId: string;
  timestamp: number;
}

interface TypingIndicatorConfig {
  typingTimeout?: number; // 타이핑 상태 유지 시간 (ms)
  throttleInterval?: number; // 타이핑 이벤트 발행 간격 (ms)
}

export class TypingIndicatorPlugin extends BasePlugin {
  private typingStates = new Map<string, TypingState>(); // key: `${userId}-${roomId}`
  private timeouts = new Map<string, number>();
  private lastEmitTime = new Map<string, number>();

  private config: Required<TypingIndicatorConfig> = {
    typingTimeout: 3000, // 3초
    throttleInterval: 1000, // 1초
  };

  private unsubscribers: (() => void)[] = [];

  constructor(config?: TypingIndicatorConfig) {
    const metadata: PluginMetadata = {
      id: 'typing-indicator',
      name: 'Typing Indicator',
      version: '1.0.0',
      description: '사용자의 타이핑 상태를 표시합니다',
      author: 'EssayBridge Team',
    };

    super(metadata);

    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.status = PluginStatus.ACTIVE;

    this.log.info('Initializing...');

    // Feature Toggle 확인
    const featureToggle = getFeatureToggle();
    if (!featureToggle.isEnabled(FeatureFlag.TYPING_INDICATOR)) {
      this.log.info('Feature disabled by toggle');
      this.enabled = false;
      return;
    }

    // 이벤트 구독
    this.setupEventListeners();

    this.log.info('Initialized successfully');
  }

  async destroy(): Promise<void> {
    this.log.info('Destroying...');

    // 모든 구독 해제
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];

    // 타임아웃 정리
    this.timeouts.forEach(timeout => window.clearTimeout(timeout));
    this.timeouts.clear();

    // 상태 초기화
    this.typingStates.clear();
    this.lastEmitTime.clear();

    this.status = PluginStatus.DESTROYED;
    this.log.info('Destroyed');
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    // 타이핑 시작 이벤트 구독
    const unsubTyping = this.subscribe('user:typing', async (data) => {
      if (!this.enabled) return;

      await this.handleTypingEvent(data);
    });

    // 메시지 전송 시 타이핑 상태 제거
    const unsubMessageSent = this.subscribe('message:sent', async (data) => {
      if (!this.enabled) return;

      const userId = this.context!.getCurrentUserId();
      const key = this.getStateKey(userId, data.roomId);

      this.clearTypingState(key);
    });

    // 채팅방 변경 시 타이핑 상태 초기화
    const unsubRoomSelected = this.subscribe('room:selected', async () => {
      if (!this.enabled) return;

      this.clearAllTypingStates();
    });

    this.unsubscribers.push(unsubTyping, unsubMessageSent, unsubRoomSelected);
  }

  /**
   * 타이핑 이벤트 처리
   */
  private async handleTypingEvent(data: {
    userId: string;
    roomId: string;
    isTyping: boolean;
  }): Promise<void> {
    const key = this.getStateKey(data.userId, data.roomId);

    if (data.isTyping) {
      // 타이핑 시작
      this.setTypingState(key, data.userId, data.roomId);
    } else {
      // 타이핑 종료
      this.clearTypingState(key);
    }
  }

  /**
   * 타이핑 상태 설정
   */
  private setTypingState(key: string, userId: string, roomId: string): void {
    // 기존 타임아웃 제거
    const existingTimeout = this.timeouts.get(key);
    if (existingTimeout) {
      window.clearTimeout(existingTimeout);
    }

    // 상태 저장
    this.typingStates.set(key, {
      userId,
      roomId,
      timestamp: Date.now(),
    });

    // 자동 제거 타임아웃 설정
    const timeout = window.setTimeout(() => {
      this.clearTypingState(key);
    }, this.config.typingTimeout);

    this.timeouts.set(key, timeout);

    this.log.debug(`User ${userId} is typing in room ${roomId}`);
  }

  /**
   * 타이핑 상태 제거
   */
  private clearTypingState(key: string): void {
    const state = this.typingStates.get(key);

    if (state) {
      this.typingStates.delete(key);

      const timeout = this.timeouts.get(key);
      if (timeout) {
        window.clearTimeout(timeout);
        this.timeouts.delete(key);
      }

      this.log.debug(`Cleared typing state for ${state.userId}`);
    }
  }

  /**
   * 모든 타이핑 상태 제거
   */
  private clearAllTypingStates(): void {
    this.typingStates.clear();
    this.timeouts.forEach(timeout => window.clearTimeout(timeout));
    this.timeouts.clear();
    this.lastEmitTime.clear();
  }

  /**
   * 현재 타이핑 중인 사용자 목록 가져오기 (public API)
   */
  getTypingUsers(roomId: string): string[] {
    const currentUserId = this.context?.getCurrentUserId();
    const typingUsers: string[] = [];

    this.typingStates.forEach((state, key) => {
      if (state.roomId === roomId && state.userId !== currentUserId) {
        // 유효한 타이핑 상태인지 확인
        const elapsed = Date.now() - state.timestamp;
        if (elapsed < this.config.typingTimeout) {
          typingUsers.push(state.userId);
        } else {
          // 만료된 상태 제거
          this.clearTypingState(key);
        }
      }
    });

    return typingUsers;
  }

  /**
   * 타이핑 알림 (throttled)
   */
  notifyTyping(roomId: string, isTyping: boolean): void {
    if (!this.enabled || !this.context) {
      return;
    }

    const userId = this.context.getCurrentUserId();
    const key = this.getStateKey(userId, roomId);

    // Throttle 체크
    const lastEmit = this.lastEmitTime.get(key) || 0;
    const now = Date.now();

    if (isTyping && now - lastEmit < this.config.throttleInterval) {
      // 너무 빠른 연속 호출 방지
      return;
    }

    this.lastEmitTime.set(key, now);

    // 이벤트 발행
    this.publish('user:typing', {
      userId,
      roomId,
      isTyping,
    });
  }

  /**
   * 상태 키 생성
   */
  private getStateKey(userId: string, roomId: string): string {
    return `${userId}-${roomId}`;
  }

  /**
   * 설정 변경
   */
  async configure(config: Record<string, unknown>): Promise<void> {
    const typedConfig = config as Partial<TypingIndicatorConfig>;
    this.config = { ...this.config, ...typedConfig };
    this.log.info('Configuration updated', this.config);
  }
}

export default TypingIndicatorPlugin;
