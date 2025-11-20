/**
 * Plugin System - 채팅 기능의 모듈화를 위한 플러그인 아키텍처
 *
 * 목표:
 * - 기능 간 독립성 보장
 * - 런타임에 기능 추가/제거 가능
 * - 느슨한 결합 (EventBus를 통한 통신)
 */

import type EventBus from './EventBus';
import type { ChatEventMap } from './EventBus';

/**
 * 플러그인 컨텍스트
 * 플러그인이 접근할 수 있는 채팅 시스템 리소스
 */
export interface PluginContext {
  eventBus: EventBus<ChatEventMap>;
  getCurrentRoomId: () => string | null;
  getCurrentUserId: () => string;
  logger: PluginLogger;
}

/**
 * 플러그인 로거 인터페이스
 */
export interface PluginLogger {
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

/**
 * 플러그인 메타데이터
 */
export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[]; // 다른 플러그인 ID 목록
}

/**
 * 플러그인 상태
 */
export const PluginStatus = {
  UNINITIALIZED: 'uninitialized',
  INITIALIZING: 'initializing',
  ACTIVE: 'active',
  PAUSED: 'paused',
  ERROR: 'error',
  DESTROYED: 'destroyed',
} as const;

export type PluginStatus = (typeof PluginStatus)[keyof typeof PluginStatus];

/**
 * 플러그인 인터페이스
 * 모든 채팅 플러그인이 구현해야 하는 기본 인터페이스
 */
export interface ChatPlugin {
  /**
   * 플러그인 메타데이터
   */
  readonly metadata: PluginMetadata;

  /**
   * 현재 플러그인 상태
   */
  status: PluginStatus;

  /**
   * 플러그인 활성화 여부
   */
  enabled: boolean;

  /**
   * 플러그인 초기화
   * @param context 플러그인 컨텍스트
   */
  initialize(context: PluginContext): void | Promise<void>;

  /**
   * 플러그인 정리 및 리소스 해제
   */
  destroy(): void | Promise<void>;

  /**
   * 플러그인 활성화 (선택 사항)
   */
  activate?(): void | Promise<void>;

  /**
   * 플러그인 비활성화 (선택 사항)
   */
  deactivate?(): void | Promise<void>;

  /**
   * 플러그인 설정 (선택 사항)
   */
  configure?(config: Record<string, unknown>): void | Promise<void>;
}

/**
 * 추상 플러그인 베이스 클래스
 * 공통 기능 구현 및 타입 안전성 제공
 */
export abstract class BasePlugin implements ChatPlugin {
  public readonly metadata: PluginMetadata;
  public status: PluginStatus = PluginStatus.UNINITIALIZED;
  public enabled = true;
  protected context?: PluginContext;

  constructor(metadata: PluginMetadata) {
    this.metadata = metadata;
  }

  abstract initialize(context: PluginContext): void | Promise<void>;
  abstract destroy(): void | Promise<void>;

  /**
   * 이벤트 구독 헬퍼
   */
  protected subscribe<K extends keyof ChatEventMap>(
    event: K,
    handler: (data: ChatEventMap[K]) => void | Promise<void>
  ): () => void {
    if (!this.context) {
      throw new Error(`Plugin ${this.metadata.id}: Cannot subscribe before initialization`);
    }
    return this.context.eventBus.on(event, handler);
  }

  /**
   * 이벤트 발행 헬퍼
   */
  protected async publish<K extends keyof ChatEventMap>(
    event: K,
    data: ChatEventMap[K]
  ): Promise<void> {
    if (!this.context) {
      throw new Error(`Plugin ${this.metadata.id}: Cannot publish before initialization`);
    }
    await this.context.eventBus.emit(event, data);
  }

  /**
   * 로깅 헬퍼
   */
  protected log = {
    info: (message: string, ...args: unknown[]) => {
      this.context?.logger.info(`[${this.metadata.name}] ${message}`, ...args);
    },
    warn: (message: string, ...args: unknown[]) => {
      this.context?.logger.warn(`[${this.metadata.name}] ${message}`, ...args);
    },
    error: (message: string, ...args: unknown[]) => {
      this.context?.logger.error(`[${this.metadata.name}] ${message}`, ...args);
    },
    debug: (message: string, ...args: unknown[]) => {
      this.context?.logger.debug(`[${this.metadata.name}] ${message}`, ...args);
    },
  };
}

/**
 * 플러그인 팩토리 타입
 */
export type PluginFactory = () => ChatPlugin;

/**
 * 플러그인 에러 클래스
 */
export class PluginError extends Error {
  public pluginId: string;
  public cause?: Error;

  constructor(
    pluginId: string,
    message: string,
    cause?: Error
  ) {
    super(`[Plugin: ${pluginId}] ${message}`);
    this.name = 'PluginError';
    this.pluginId = pluginId;
    this.cause = cause;
  }
}
