/**
 * MentionPlugin - 멘션(@) 시스템 플러그인
 *
 * 벤치마킹: Slack의 멘션 시스템
 *
 * 책임:
 * - @username 멘션 파싱
 * - @channel, @here 특수 멘션 처리
 * - 멘션 자동완성 데이터 제공
 * - 멘션 알림 발송
 *
 * 특징:
 * - Slack 스타일 멘션
 * - 독립적인 모듈
 * - Feature Toggle로 제어 가능
 */

import { BasePlugin } from '../core/Plugin';
import type { PluginContext, PluginMetadata } from '../core/Plugin';
import { PluginStatus } from '../core/Plugin';
import { FeatureFlag, getFeatureToggle } from '../core/FeatureToggle';

export interface MentionUser {
  id: string;
  name: string;
  displayName?: string;
  avatar?: string;
  isOnline?: boolean;
}

export type MentionType = 'user' | 'channel' | 'here' | 'everyone';

export interface Mention {
  type: MentionType;
  userId?: string;  // type이 'user'일 때만
  text: string;  // 원본 텍스트 (@username)
  displayText: string;  // 표시할 텍스트
  startIndex: number;
  endIndex: number;
}

interface MentionPluginConfig {
  enableChannelMentions?: boolean;
  enableHereMentions?: boolean;
  enableEveryoneMentions?: boolean;
  maxSuggestions?: number;
}

export class MentionPlugin extends BasePlugin {
  // roomId -> MentionUser[] (채팅방별 참여자 목록)
  private roomParticipants = new Map<string, MentionUser[]>();

  // messageId -> Mention[] (메시지별 멘션 목록)
  private messageMentions = new Map<string, Mention[]>();

  private config: Required<MentionPluginConfig> = {
    enableChannelMentions: true,
    enableHereMentions: true,
    enableEveryoneMentions: false,  // 조심히 사용
    maxSuggestions: 10,
  };

  private unsubscribers: (() => void)[] = [];

  // 멘션 정규식
  private mentionRegex = /@(\w+)/g;
  private specialMentionRegex = /@(channel|here|everyone)\b/gi;

  constructor(config?: MentionPluginConfig) {
    const metadata: PluginMetadata = {
      id: 'mentions',
      name: 'Mentions',
      version: '1.0.0',
      description: 'Slack 스타일 @멘션 시스템',
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

    // Feature Toggle 확인 (실험적 기능으로 설정)
    const featureToggle = getFeatureToggle();
    if (!featureToggle.isEnabled(FeatureFlag.MENTION_NOTIFICATIONS)) {
      this.log.info('Feature disabled by toggle');
      this.enabled = false;
      return;
    }

    // 이벤트 구독
    this.setupEventListeners();

    // 로컬 스토리지에서 로드
    this.loadFromStorage();

    this.log.info('Initialized successfully');
  }

  async destroy(): Promise<void> {
    this.log.info('Destroying...');

    // 구독 해제
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];

    // 저장
    this.saveToStorage();

    // 상태 초기화
    this.roomParticipants.clear();
    this.messageMentions.clear();

    this.status = PluginStatus.DESTROYED;
    this.log.info('Destroyed');
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    // 메시지 전송 시 멘션 감지
    const unsubSent = this.subscribe('message:sent', async (_data) => {
      if (!this.enabled) return;
      // 실제로는 메시지 내용을 받아서 파싱해야 함
      // 여기서는 이벤트만 수신
    });

    // 멘션 추가 이벤트
    const unsubAdded = this.subscribe('mention:added', async (data) => {
      if (!this.enabled) return;
      await this.handleMentionAdded(data);
    });

    // 멘션 클릭 이벤트
    const unsubClicked = this.subscribe('mention:clicked', async (data) => {
      if (!this.enabled) return;
      this.log.debug(`Mention clicked: ${data.userId}`);
      // 사용자 프로필 보기 등 추가 동작
    });

    // 메시지 삭제 시 멘션도 제거
    const unsubDeleted = this.subscribe('message:deleted', async (data) => {
      if (!this.enabled) return;
      this.messageMentions.delete(data.messageId);
      this.saveToStorage();
    });

    this.unsubscribers.push(unsubSent, unsubAdded, unsubClicked, unsubDeleted);
  }

  /**
   * 멘션 추가 처리
   */
  private async handleMentionAdded(data: {
    messageId: string;
    userId: string;
    type: 'user' | 'channel' | 'here';
  }): Promise<void> {
    // 멘션 알림 발송
    if (data.type === 'user') {
      await this.publish('notification:show', {
        title: '새 멘션',
        body: `누군가 당신을 멘션했습니다`,
      });

      await this.publish('notification:sound', {
        soundType: 'mention',
      });
    } else if (data.type === 'channel' || data.type === 'here') {
      // @channel, @here는 모든 사람에게 알림
      await this.publish('notification:sound', {
        soundType: 'alert',
      });
    }

    this.log.debug(`Mention added: ${data.type} - ${data.userId}`);
  }

  /**
   * 텍스트에서 멘션 파싱 (public API)
   */
  parseMentions(text: string, roomId: string): Mention[] {
    const mentions: Mention[] = [];
    const participants = this.roomParticipants.get(roomId) || [];

    // 특수 멘션 파싱 (@channel, @here, @everyone)
    let match;
    const specialRegex = new RegExp(this.specialMentionRegex);
    while ((match = specialRegex.exec(text)) !== null) {
      const type = match[1].toLowerCase() as MentionType;

      if (
        (type === 'channel' && !this.config.enableChannelMentions) ||
        (type === 'here' && !this.config.enableHereMentions) ||
        (type === 'everyone' && !this.config.enableEveryoneMentions)
      ) {
        continue;
      }

      mentions.push({
        type,
        text: match[0],
        displayText: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    // 사용자 멘션 파싱 (@username)
    const userRegex = new RegExp(this.mentionRegex);
    while ((match = userRegex.exec(text)) !== null) {
      const username = match[1];

      // 특수 멘션은 이미 처리했으므로 스킵
      if (['channel', 'here', 'everyone'].includes(username.toLowerCase())) {
        continue;
      }

      // 참여자 목록에서 찾기
      const user = participants.find(
        p => p.name.toLowerCase() === username.toLowerCase() ||
             p.displayName?.toLowerCase() === username.toLowerCase()
      );

      if (user) {
        mentions.push({
          type: 'user',
          userId: user.id,
          text: match[0],
          displayText: `@${user.displayName || user.name}`,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }
    }

    return mentions.sort((a, b) => a.startIndex - b.startIndex);
  }

  /**
   * 메시지에 멘션 추가 (public API)
   */
  async addMentionsToMessage(messageId: string, text: string, roomId: string): Promise<void> {
    const mentions = this.parseMentions(text, roomId);

    if (mentions.length > 0) {
      this.messageMentions.set(messageId, mentions);

      // 멘션된 사용자 ID 추출
      const mentionedUserIds = mentions
        .filter(m => m.type === 'user' && m.userId)
        .map(m => m.userId!);

      if (mentionedUserIds.length > 0) {
        await this.publish('mention:detected', {
          messageId,
          mentionedUserIds,
        });

        // 각 사용자에게 멘션 알림
        for (const userId of mentionedUserIds) {
          await this.publish('mention:added', {
            messageId,
            userId,
            type: 'user',
          });
        }
      }

      // 특수 멘션 처리
      const hasChannelMention = mentions.some(m => m.type === 'channel');
      const hasHereMention = mentions.some(m => m.type === 'here');

      if (hasChannelMention) {
        await this.publish('mention:added', {
          messageId,
          userId: 'channel',
          type: 'channel',
        });
      }

      if (hasHereMention) {
        await this.publish('mention:added', {
          messageId,
          userId: 'here',
          type: 'here',
        });
      }

      this.saveToStorage();
    }
  }

  /**
   * 메시지의 멘션 가져오기 (public API)
   */
  getMentions(messageId: string): Mention[] {
    return this.messageMentions.get(messageId) || [];
  }

  /**
   * 채팅방 참여자 설정 (public API)
   */
  setRoomParticipants(roomId: string, users: MentionUser[]): void {
    this.roomParticipants.set(roomId, users);
    this.saveToStorage();
  }

  /**
   * 자동완성 제안 가져오기 (public API)
   */
  getSuggestions(roomId: string, query: string): MentionUser[] {
    const participants = this.roomParticipants.get(roomId) || [];
    const lowerQuery = query.toLowerCase();

    // 쿼리와 매칭되는 사용자 찾기
    const matches = participants.filter(
      user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.displayName?.toLowerCase().includes(lowerQuery)
    );

    // 온라인 사용자 우선 정렬
    const sorted = matches.sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return 0;
    });

    return sorted.slice(0, this.config.maxSuggestions);
  }

  /**
   * 특수 멘션 제안 가져오기 (public API)
   */
  getSpecialMentionSuggestions(): Array<{ type: MentionType; text: string; description: string }> {
    const suggestions = [];

    if (this.config.enableChannelMentions) {
      suggestions.push({
        type: 'channel' as MentionType,
        text: '@channel',
        description: '채팅방의 모든 멤버에게 알림',
      });
    }

    if (this.config.enableHereMentions) {
      suggestions.push({
        type: 'here' as MentionType,
        text: '@here',
        description: '현재 온라인인 멤버에게 알림',
      });
    }

    if (this.config.enableEveryoneMentions) {
      suggestions.push({
        type: 'everyone' as MentionType,
        text: '@everyone',
        description: '모든 멤버에게 강력한 알림',
      });
    }

    return suggestions;
  }

  /**
   * 사용자가 멘션되었는지 확인 (public API)
   */
  isUserMentioned(messageId: string, userId: string): boolean {
    const mentions = this.messageMentions.get(messageId) || [];
    return mentions.some(m => m.userId === userId);
  }

  /**
   * 로컬 스토리지에서 로드
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('chat-mentions');
      if (stored) {
        const data = JSON.parse(stored) as {
          messageMentions: Record<string, Mention[]>;
          roomParticipants: Record<string, MentionUser[]>;
        };

        Object.entries(data.messageMentions || {}).forEach(([id, mentions]) => {
          this.messageMentions.set(id, mentions);
        });

        Object.entries(data.roomParticipants || {}).forEach(([id, users]) => {
          this.roomParticipants.set(id, users);
        });

        this.log.info(`Loaded mentions from storage`);
      }
    } catch (error) {
      this.log.error('Failed to load from storage', error);
    }
  }

  /**
   * 로컬 스토리지에 저장
   */
  private saveToStorage(): void {
    try {
      const data = {
        messageMentions: Object.fromEntries(this.messageMentions.entries()),
        roomParticipants: Object.fromEntries(this.roomParticipants.entries()),
      };
      localStorage.setItem('chat-mentions', JSON.stringify(data));
    } catch (error) {
      this.log.error('Failed to save to storage', error);
    }
  }

  /**
   * 설정 변경
   */
  async configure(config: Record<string, unknown>): Promise<void> {
    const typedConfig = config as Partial<MentionPluginConfig>;
    this.config = { ...this.config, ...typedConfig };
    this.log.info('Configuration updated', this.config);
  }
}

export default MentionPlugin;
