/**
 * MessageReactionPlugin - 메시지 반응(리액션) 플러그인
 *
 * 책임:
 * - 메시지에 대한 이모지 반응 관리
 * - 반응 추가/제거
 * - 반응 집계 및 표시
 *
 * 특징:
 * - 독립적인 기능 모듈
 * - 다른 채팅 기능과 결합도 없음
 * - Feature Toggle로 제어 가능
 */

import { BasePlugin } from '../core/Plugin';
import type { PluginContext, PluginMetadata } from '../core/Plugin';
import { PluginStatus } from '../core/Plugin';
import { FeatureFlag, getFeatureToggle } from '../core/FeatureToggle';

/**
 * 반응 타입
 */
export interface Reaction {
  emoji: string;
  userId: string;
  timestamp: string;
}

/**
 * 메시지별 반응 집계
 */
export interface ReactionSummary {
  emoji: string;
  count: number;
  userIds: string[];
  hasCurrentUser: boolean;
}

/**
 * 반응 이벤트 타입 확장
 */
declare module '../core/EventBus' {
  interface ChatEventMap {
    'reaction:added': {
      messageId: string;
      emoji: string;
      userId: string;
    };
    'reaction:removed': {
      messageId: string;
      emoji: string;
      userId: string;
    };
    'reaction:updated': {
      messageId: string;
      reactions: ReactionSummary[];
    };
  }
}

interface MessageReactionConfig {
  maxReactionsPerMessage?: number;
  maxReactionsPerUser?: number;
  allowedEmojis?: string[];
}

export class MessageReactionPlugin extends BasePlugin {
  // messageId -> Reaction[]
  private reactions = new Map<string, Reaction[]>();

  private config: Required<MessageReactionConfig> = {
    maxReactionsPerMessage: 100,
    maxReactionsPerUser: 10,
    allowedEmojis: [
      '👍',
      '❤️',
      '😄',
      '😮',
      '😢',
      '🎉',
      '🔥',
      '👏',
      '✅',
      '❌',
    ],
  };

  private unsubscribers: (() => void)[] = [];

  constructor(config?: MessageReactionConfig) {
    const metadata: PluginMetadata = {
      id: 'message-reactions',
      name: 'Message Reactions',
      version: '1.0.0',
      description: '메시지에 이모지 반응을 추가할 수 있습니다',
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
    if (!featureToggle.isEnabled(FeatureFlag.MESSAGE_REACTIONS)) {
      this.log.info('Feature disabled by toggle');
      this.enabled = false;
      return;
    }

    // 이벤트 구독
    this.setupEventListeners();

    // 로컬 스토리지에서 반응 로드 (선택 사항)
    this.loadReactionsFromStorage();

    this.log.info('Initialized successfully');
  }

  async destroy(): Promise<void> {
    this.log.info('Destroying...');

    // 구독 해제
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];

    // 반응 저장
    this.saveReactionsToStorage();

    // 상태 초기화
    this.reactions.clear();

    this.status = PluginStatus.DESTROYED;
    this.log.info('Destroyed');
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    // 반응 추가 이벤트 구독
    const unsubAdded = this.subscribe('reaction:added', async (data) => {
      if (!this.enabled) return;
      await this.handleReactionAdded(data);
    });

    // 반응 제거 이벤트 구독
    const unsubRemoved = this.subscribe('reaction:removed', async (data) => {
      if (!this.enabled) return;
      await this.handleReactionRemoved(data);
    });

    // 메시지 삭제 시 반응도 삭제
    const unsubMessageDeleted = this.subscribe('message:deleted', async (data) => {
      if (!this.enabled) return;
      this.reactions.delete(data.messageId);
      this.saveReactionsToStorage();
    });

    this.unsubscribers.push(unsubAdded, unsubRemoved, unsubMessageDeleted);
  }

  /**
   * 반응 추가 처리
   */
  private async handleReactionAdded(data: {
    messageId: string;
    emoji: string;
    userId: string;
  }): Promise<void> {
    // 이모지 검증
    if (!this.isEmojiAllowed(data.emoji)) {
      this.log.warn(`Emoji not allowed: ${data.emoji}`);
      return;
    }

    const reactions = this.reactions.get(data.messageId) || [];

    // 중복 확인
    const exists = reactions.some(
      (r) => r.emoji === data.emoji && r.userId === data.userId
    );

    if (exists) {
      this.log.debug('Reaction already exists');
      return;
    }

    // 사용자당 반응 수 제한
    const userReactions = reactions.filter((r) => r.userId === data.userId);
    if (userReactions.length >= this.config.maxReactionsPerUser) {
      this.log.warn('Max reactions per user reached');
      return;
    }

    // 메시지당 반응 수 제한
    if (reactions.length >= this.config.maxReactionsPerMessage) {
      this.log.warn('Max reactions per message reached');
      return;
    }

    // 반응 추가
    reactions.push({
      emoji: data.emoji,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });

    this.reactions.set(data.messageId, reactions);

    // 업데이트 이벤트 발행
    await this.publishReactionUpdate(data.messageId);

    // 저장
    this.saveReactionsToStorage();

    this.log.debug(`Reaction added: ${data.emoji} by ${data.userId}`);
  }

  /**
   * 반응 제거 처리
   */
  private async handleReactionRemoved(data: {
    messageId: string;
    emoji: string;
    userId: string;
  }): Promise<void> {
    const reactions = this.reactions.get(data.messageId);

    if (!reactions) {
      return;
    }

    // 반응 제거
    const filtered = reactions.filter(
      (r) => !(r.emoji === data.emoji && r.userId === data.userId)
    );

    if (filtered.length === 0) {
      this.reactions.delete(data.messageId);
    } else {
      this.reactions.set(data.messageId, filtered);
    }

    // 업데이트 이벤트 발행
    await this.publishReactionUpdate(data.messageId);

    // 저장
    this.saveReactionsToStorage();

    this.log.debug(`Reaction removed: ${data.emoji} by ${data.userId}`);
  }

  /**
   * 반응 업데이트 이벤트 발행
   */
  private async publishReactionUpdate(messageId: string): Promise<void> {
    const summary = this.getReactionSummary(messageId);
    await this.publish('reaction:updated', {
      messageId,
      reactions: summary,
    });
  }

  /**
   * 메시지의 반응 집계 (public API)
   */
  getReactionSummary(messageId: string): ReactionSummary[] {
    const reactions = this.reactions.get(messageId) || [];
    const currentUserId = this.context?.getCurrentUserId();

    // 이모지별로 그룹화
    const emojiMap = new Map<string, Reaction[]>();

    reactions.forEach((reaction) => {
      const existing = emojiMap.get(reaction.emoji) || [];
      existing.push(reaction);
      emojiMap.set(reaction.emoji, existing);
    });

    // 집계 생성
    const summary: ReactionSummary[] = [];

    emojiMap.forEach((reactions, emoji) => {
      summary.push({
        emoji,
        count: reactions.length,
        userIds: reactions.map((r) => r.userId),
        hasCurrentUser: reactions.some((r) => r.userId === currentUserId),
      });
    });

    // 개수 순으로 정렬
    return summary.sort((a, b) => b.count - a.count);
  }

  /**
   * 반응 추가 (public API)
   */
  async addReaction(messageId: string, emoji: string): Promise<void> {
    if (!this.enabled || !this.context) {
      return;
    }

    const userId = this.context.getCurrentUserId();

    await this.publish('reaction:added', {
      messageId,
      emoji,
      userId,
    });
  }

  /**
   * 반응 제거 (public API)
   */
  async removeReaction(messageId: string, emoji: string): Promise<void> {
    if (!this.enabled || !this.context) {
      return;
    }

    const userId = this.context.getCurrentUserId();

    await this.publish('reaction:removed', {
      messageId,
      emoji,
      userId,
    });
  }

  /**
   * 반응 토글 (public API)
   */
  async toggleReaction(messageId: string, emoji: string): Promise<void> {
    const reactions = this.reactions.get(messageId) || [];
    const userId = this.context?.getCurrentUserId();

    const hasReaction = reactions.some(
      (r) => r.emoji === emoji && r.userId === userId
    );

    if (hasReaction) {
      await this.removeReaction(messageId, emoji);
    } else {
      await this.addReaction(messageId, emoji);
    }
  }

  /**
   * 허용된 이모지 목록 가져오기
   */
  getAllowedEmojis(): string[] {
    return [...this.config.allowedEmojis];
  }

  /**
   * 이모지 허용 여부 확인
   */
  private isEmojiAllowed(emoji: string): boolean {
    return this.config.allowedEmojis.includes(emoji);
  }

  /**
   * 로컬 스토리지에서 반응 로드
   */
  private loadReactionsFromStorage(): void {
    try {
      const stored = localStorage.getItem('chat-reactions');
      if (stored) {
        const data = JSON.parse(stored) as Record<string, Reaction[]>;
        Object.entries(data).forEach(([messageId, reactions]) => {
          this.reactions.set(messageId, reactions);
        });
        this.log.info(`Loaded ${this.reactions.size} message reactions from storage`);
      }
    } catch (error) {
      this.log.error('Failed to load reactions from storage', error);
    }
  }

  /**
   * 로컬 스토리지에 반응 저장
   */
  private saveReactionsToStorage(): void {
    try {
      const data: Record<string, Reaction[]> = {};
      this.reactions.forEach((reactions, messageId) => {
        data[messageId] = reactions;
      });
      localStorage.setItem('chat-reactions', JSON.stringify(data));
    } catch (error) {
      this.log.error('Failed to save reactions to storage', error);
    }
  }

  /**
   * 설정 변경
   */
  async configure(config: Record<string, unknown>): Promise<void> {
    const typedConfig = config as Partial<MessageReactionConfig>;
    this.config = { ...this.config, ...typedConfig };
    this.log.info('Configuration updated', this.config);
  }
}

export default MessageReactionPlugin;
