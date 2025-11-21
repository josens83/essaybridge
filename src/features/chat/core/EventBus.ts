/**
 * EventBus - Pub/Sub Pattern
 * 채팅 기능 내 컴포넌트 간 느슨한 결합을 위한 이벤트 버스
 */

type EventHandler<T = unknown> = (data: T) => void | Promise<void>;

interface EventMap {
  [event: string]: unknown;
}

/**
 * 채팅 이벤트 타입 정의
 */
export interface ChatEventMap extends EventMap {
  // 메시지 관련
  'message:send': { content: string; roomId: string };
  'message:sent': { messageId: string; roomId: string };
  'message:received': { messageId: string; roomId: string; senderId: string };
  'message:read': { messageId: string; userId: string };
  'message:deleted': { messageId: string; roomId: string };
  'message:edited': { messageId: string; newContent: string };

  // 스레드 관련 (Discord/Slack 스타일)
  'thread:created': { threadId: string; parentMessageId: string; roomId: string };
  'thread:opened': { threadId: string; parentMessageId: string };
  'thread:closed': { threadId: string };
  'thread:reply': { threadId: string; messageId: string };
  'thread:updated': { threadId: string; replyCount: number; lastReplyAt: string };

  // 멘션 관련 (Slack 스타일)
  'mention:detected': { messageId: string; mentionedUserIds: string[] };
  'mention:added': { messageId: string; userId: string; type: 'user' | 'channel' | 'here' };
  'mention:clicked': { userId: string; messageId: string };

  // 채팅방 관련
  'room:selected': { roomId: string };
  'room:created': { roomId: string; type: string };
  'room:left': { roomId: string };

  // 사용자 상태
  'user:typing': { userId: string; roomId: string; isTyping: boolean };
  'user:online': { userId: string };
  'user:offline': { userId: string };

  // 파일 관련
  'file:uploading': { fileName: string; progress: number };
  'file:uploaded': { fileId: string; url: string };
  'file:failed': { fileName: string; error: string };

  // 알림
  'notification:show': { title: string; body: string };
  'notification:sound': { soundType: 'message' | 'mention' | 'alert' };

  // 에러
  'error:occurred': { error: Error; context: string };
}

/**
 * 이벤트 버스 클래스
 */
class EventBus<Events extends EventMap = ChatEventMap> {
  private handlers: Map<keyof Events, Set<EventHandler<Events[keyof Events]>>> = new Map();
  private debug: boolean;

  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * 이벤트 구독
   */
  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    this.handlers.get(event)!.add(handler as EventHandler);

    if (this.debug) {
      console.log(`[EventBus] Subscribed to "${String(event)}"`);
    }

    // 구독 해제 함수 반환
    return () => this.off(event, handler);
  }

  /**
   * 한 번만 실행되는 이벤트 구독
   */
  once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    const onceHandler = (data: Events[K]) => {
      handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  /**
   * 이벤트 구독 해제
   */
  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler as EventHandler);

      if (handlers.size === 0) {
        this.handlers.delete(event);
      }

      if (this.debug) {
        console.log(`[EventBus] Unsubscribed from "${String(event)}"`);
      }
    }
  }

  /**
   * 이벤트 발행
   */
  async emit<K extends keyof Events>(event: K, data: Events[K]): Promise<void> {
    const handlers = this.handlers.get(event);

    if (this.debug) {
      console.log(`[EventBus] Emitting "${String(event)}"`, data);
    }

    if (!handlers || handlers.size === 0) {
      return;
    }

    // 모든 핸들러 실행 (병렬)
    const promises = Array.from(handlers).map(handler => {
      try {
        return Promise.resolve(handler(data));
      } catch (error) {
        console.error(`[EventBus] Handler error for "${String(event)}":`, error);
        return Promise.resolve();
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * 특정 이벤트의 모든 구독자 제거
   */
  clear<K extends keyof Events>(event?: K): void {
    if (event) {
      this.handlers.delete(event);
      if (this.debug) {
        console.log(`[EventBus] Cleared all handlers for "${String(event)}"`);
      }
    } else {
      this.handlers.clear();
      if (this.debug) {
        console.log('[EventBus] Cleared all handlers');
      }
    }
  }

  /**
   * 현재 구독 중인 이벤트 목록
   */
  getEvents(): Array<keyof Events> {
    return Array.from(this.handlers.keys());
  }

  /**
   * 특정 이벤트의 구독자 수
   */
  getHandlerCount<K extends keyof Events>(event: K): number {
    return this.handlers.get(event)?.size || 0;
  }
}

// 싱글톤 인스턴스
export const chatEventBus = new EventBus<ChatEventMap>(
  import.meta.env.DEV // 개발 환경에서만 디버그
);

export default EventBus;
