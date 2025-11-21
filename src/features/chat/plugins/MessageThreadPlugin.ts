/**
 * MessageThreadPlugin - 메시지 스레드 (Thread) 플러그인
 *
 * 벤치마킹: Discord, Slack의 스레드 시스템
 *
 * 책임:
 * - 메시지에서 스레드 시작
 * - 스레드 내 답글 관리
 * - 스레드 읽지 않음 카운트
 * - 스레드 참여자 추적
 *
 * 특징:
 * - Discord/Slack 스타일 스레드
 * - 독립적인 모듈
 * - Feature Toggle로 제어 가능
 */

import { BasePlugin } from '../core/Plugin';
import type { PluginContext, PluginMetadata } from '../core/Plugin';
import { PluginStatus } from '../core/Plugin';
import { FeatureFlag, getFeatureToggle } from '../core/FeatureToggle';
import type { MessageThread, ChatMessage } from '../types';

interface MessageThreadConfig {
  maxThreadDepth?: number;
  autoMarkAsRead?: boolean;
  notifyOnReply?: boolean;
}

export class MessageThreadPlugin extends BasePlugin {
  // threadId -> MessageThread
  private threads = new Map<string, MessageThread>();

  // parentMessageId -> threadId 매핑
  private messageToThread = new Map<string, string>();

  // 현재 열린 스레드
  private currentOpenThread: string | null = null;

  private config: Required<MessageThreadConfig> = {
    maxThreadDepth: 1, // 스레드는 1단계만 (스레드의 스레드 불가)
    autoMarkAsRead: true,
    notifyOnReply: true,
  };

  private unsubscribers: (() => void)[] = [];

  constructor(config?: MessageThreadConfig) {
    const metadata: PluginMetadata = {
      id: 'message-threads',
      name: 'Message Threads',
      version: '1.0.0',
      description: 'Discord/Slack 스타일 메시지 스레드 기능',
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
    if (!featureToggle.isEnabled(FeatureFlag.MESSAGE_THREADING)) {
      this.log.info('Feature disabled by toggle');
      this.enabled = false;
      return;
    }

    // 이벤트 구독
    this.setupEventListeners();

    // 로컬 스토리지에서 스레드 로드
    this.loadThreadsFromStorage();

    this.log.info('Initialized successfully');
  }

  async destroy(): Promise<void> {
    this.log.info('Destroying...');

    // 구독 해제
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];

    // 스레드 저장
    this.saveThreadsToStorage();

    // 상태 초기화
    this.threads.clear();
    this.messageToThread.clear();
    this.currentOpenThread = null;

    this.status = PluginStatus.DESTROYED;
    this.log.info('Destroyed');
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    // 스레드 생성 이벤트
    const unsubCreated = this.subscribe('thread:created', async (data) => {
      if (!this.enabled) return;
      await this.handleThreadCreated(data);
    });

    // 스레드 답글 이벤트
    const unsubReply = this.subscribe('thread:reply', async (data) => {
      if (!this.enabled) return;
      await this.handleThreadReply(data);
    });

    // 스레드 열기 이벤트
    const unsubOpened = this.subscribe('thread:opened', async (data) => {
      if (!this.enabled) return;
      this.currentOpenThread = data.threadId;

      // 자동 읽음 처리
      if (this.config.autoMarkAsRead) {
        await this.markThreadAsRead(data.threadId);
      }
    });

    // 스레드 닫기 이벤트
    const unsubClosed = this.subscribe('thread:closed', async () => {
      if (!this.enabled) return;
      this.currentOpenThread = null;
    });

    // 메시지 삭제 시 스레드도 삭제
    const unsubMessageDeleted = this.subscribe('message:deleted', async (data) => {
      if (!this.enabled) return;

      const threadId = this.messageToThread.get(data.messageId);
      if (threadId) {
        this.threads.delete(threadId);
        this.messageToThread.delete(data.messageId);
        this.saveThreadsToStorage();
      }
    });

    this.unsubscribers.push(
      unsubCreated,
      unsubReply,
      unsubOpened,
      unsubClosed,
      unsubMessageDeleted
    );
  }

  /**
   * 스레드 생성 처리
   */
  private async handleThreadCreated(data: {
    threadId: string;
    parentMessageId: string;
    roomId: string;
  }): Promise<void> {
    const thread: MessageThread = {
      id: data.threadId,
      parentMessageId: data.parentMessageId,
      roomId: data.roomId,
      messages: [],
      participantIds: [this.context!.getCurrentUserId()],
      unreadCount: 0,
      lastReplyAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.threads.set(data.threadId, thread);
    this.messageToThread.set(data.parentMessageId, data.threadId);

    this.saveThreadsToStorage();
    this.log.debug(`Thread created: ${data.threadId}`);
  }

  /**
   * 스레드 답글 처리
   */
  private async handleThreadReply(data: {
    threadId: string;
    messageId: string;
  }): Promise<void> {
    const thread = this.threads.get(data.threadId);
    if (!thread) {
      this.log.warn(`Thread not found: ${data.threadId}`);
      return;
    }

    // 읽지 않음 카운트 증가 (현재 열린 스레드가 아닌 경우)
    if (this.currentOpenThread !== data.threadId) {
      thread.unreadCount++;
    }

    // 마지막 답글 시간 업데이트
    thread.lastReplyAt = new Date().toISOString();

    // 스레드 업데이트 이벤트 발행
    await this.publish('thread:updated', {
      threadId: data.threadId,
      replyCount: thread.messages.length,
      lastReplyAt: thread.lastReplyAt,
    });

    this.saveThreadsToStorage();
    this.log.debug(`Thread reply added: ${data.messageId}`);
  }

  /**
   * 스레드 생성 (public API)
   */
  async createThread(parentMessageId: string, roomId: string): Promise<string> {
    if (!this.enabled || !this.context) {
      throw new Error('Plugin not enabled');
    }

    // 이미 스레드가 있는지 확인
    const existingThreadId = this.messageToThread.get(parentMessageId);
    if (existingThreadId) {
      return existingThreadId;
    }

    const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await this.publish('thread:created', {
      threadId,
      parentMessageId,
      roomId,
    });

    return threadId;
  }

  /**
   * 스레드 열기 (public API)
   */
  async openThread(threadId: string): Promise<void> {
    if (!this.enabled || !this.context) {
      return;
    }

    const thread = this.threads.get(threadId);
    if (!thread) {
      this.log.warn(`Thread not found: ${threadId}`);
      return;
    }

    await this.publish('thread:opened', {
      threadId,
      parentMessageId: thread.parentMessageId,
    });
  }

  /**
   * 스레드 닫기 (public API)
   */
  async closeThread(): Promise<void> {
    if (!this.enabled || !this.context || !this.currentOpenThread) {
      return;
    }

    const threadId = this.currentOpenThread;
    await this.publish('thread:closed', { threadId });
  }

  /**
   * 스레드에 답글 추가 (public API)
   */
  async replyToThread(threadId: string, message: ChatMessage): Promise<void> {
    if (!this.enabled || !this.context) {
      return;
    }

    const thread = this.threads.get(threadId);
    if (!thread) {
      this.log.warn(`Thread not found: ${threadId}`);
      return;
    }

    // 메시지 추가
    thread.messages.push(message);

    // 참여자 추가
    if (!thread.participantIds.includes(message.senderId)) {
      thread.participantIds.push(message.senderId);
    }

    await this.publish('thread:reply', {
      threadId,
      messageId: message.id,
    });
  }

  /**
   * 스레드 가져오기 (public API)
   */
  getThread(threadId: string): MessageThread | undefined {
    return this.threads.get(threadId);
  }

  /**
   * 메시지의 스레드 ID 가져오기 (public API)
   */
  getThreadIdByMessage(messageId: string): string | undefined {
    return this.messageToThread.get(messageId);
  }

  /**
   * 스레드 메시지들 가져오기 (public API)
   */
  getThreadMessages(threadId: string): ChatMessage[] {
    const thread = this.threads.get(threadId);
    return thread?.messages || [];
  }

  /**
   * 스레드 읽음 처리
   */
  private async markThreadAsRead(threadId: string): Promise<void> {
    const thread = this.threads.get(threadId);
    if (!thread) return;

    thread.unreadCount = 0;
    this.saveThreadsToStorage();

    this.log.debug(`Thread marked as read: ${threadId}`);
  }

  /**
   * 현재 열린 스레드 가져오기 (public API)
   */
  getOpenThread(): string | null {
    return this.currentOpenThread;
  }

  /**
   * 특정 메시지의 스레드 답글 수 가져오기 (public API)
   */
  getThreadReplyCount(messageId: string): number {
    const threadId = this.messageToThread.get(messageId);
    if (!threadId) return 0;

    const thread = this.threads.get(threadId);
    return thread?.messages.length || 0;
  }

  /**
   * 특정 메시지의 스레드 읽지 않음 수 가져오기 (public API)
   */
  getThreadUnreadCount(messageId: string): number {
    const threadId = this.messageToThread.get(messageId);
    if (!threadId) return 0;

    const thread = this.threads.get(threadId);
    return thread?.unreadCount || 0;
  }

  /**
   * 로컬 스토리지에서 스레드 로드
   */
  private loadThreadsFromStorage(): void {
    try {
      const stored = localStorage.getItem('chat-threads');
      if (stored) {
        const data = JSON.parse(stored) as {
          threads: Record<string, MessageThread>;
          messageToThread: Record<string, string>;
        };

        Object.entries(data.threads).forEach(([id, thread]) => {
          this.threads.set(id, thread);
        });

        Object.entries(data.messageToThread).forEach(([messageId, threadId]) => {
          this.messageToThread.set(messageId, threadId);
        });

        this.log.info(`Loaded ${this.threads.size} threads from storage`);
      }
    } catch (error) {
      this.log.error('Failed to load threads from storage', error);
    }
  }

  /**
   * 로컬 스토리지에 스레드 저장
   */
  private saveThreadsToStorage(): void {
    try {
      const data = {
        threads: Object.fromEntries(this.threads.entries()),
        messageToThread: Object.fromEntries(this.messageToThread.entries()),
      };
      localStorage.setItem('chat-threads', JSON.stringify(data));
    } catch (error) {
      this.log.error('Failed to save threads to storage', error);
    }
  }

  /**
   * 설정 변경
   */
  async configure(config: Record<string, unknown>): Promise<void> {
    const typedConfig = config as Partial<MessageThreadConfig>;
    this.config = { ...this.config, ...typedConfig };
    this.log.info('Configuration updated', this.config);
  }
}

export default MessageThreadPlugin;
