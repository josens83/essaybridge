/**
 * PluginManager - 플러그인 생명주기 관리
 *
 * 책임:
 * - 플러그인 등록 및 해제
 * - 플러그인 초기화 및 정리
 * - 의존성 해결
 * - 플러그인 활성화/비활성화
 */

import type { ChatPlugin, PluginContext, PluginLogger, PluginMetadata } from './Plugin';
import { PluginStatus, PluginError } from './Plugin';
import type EventBus from './EventBus';
import type { ChatEventMap } from './EventBus';

/**
 * 플러그인 매니저 설정
 */
export interface PluginManagerConfig {
  eventBus: EventBus<ChatEventMap>;
  getCurrentRoomId: () => string | null;
  getCurrentUserId: () => string;
  debug?: boolean;
}

/**
 * 등록된 플러그인 정보
 */
interface RegisteredPlugin {
  plugin: ChatPlugin;
  unsubscribe: (() => void)[];
}

/**
 * 플러그인 매니저
 */
export class PluginManager {
  private plugins = new Map<string, RegisteredPlugin>();
  private context: PluginContext;
  private logger: PluginLogger;
  private debug: boolean;

  constructor(config: PluginManagerConfig) {
    this.debug = config.debug ?? import.meta.env.DEV;

    // 로거 생성
    this.logger = this.createLogger();

    // 플러그인 컨텍스트 생성
    this.context = {
      eventBus: config.eventBus,
      getCurrentRoomId: config.getCurrentRoomId,
      getCurrentUserId: config.getCurrentUserId,
      logger: this.logger,
    };

    this.log('PluginManager initialized');
  }

  /**
   * 플러그인 등록
   */
  async register(plugin: ChatPlugin): Promise<void> {
    const { id, name } = plugin.metadata;

    // 중복 확인
    if (this.plugins.has(id)) {
      throw new PluginError(id, `Plugin already registered: ${name}`);
    }

    this.log(`Registering plugin: ${name} (${id})`);

    try {
      // 의존성 확인
      this.checkDependencies(plugin.metadata);

      // 플러그인 저장
      this.plugins.set(id, {
        plugin,
        unsubscribe: [],
      });

      // 자동 초기화 (enabled인 경우)
      if (plugin.enabled) {
        await this.initialize(id);
      }

      this.log(`Plugin registered successfully: ${name}`);
    } catch (error) {
      throw new PluginError(
        id,
        `Failed to register plugin: ${name}`,
        error as Error
      );
    }
  }

  /**
   * 플러그인 초기화
   */
  async initialize(pluginId: string): Promise<void> {
    const registered = this.plugins.get(pluginId);
    if (!registered) {
      throw new PluginError(pluginId, 'Plugin not found');
    }

    const { plugin } = registered;
    const { name } = plugin.metadata;

    if (plugin.status !== PluginStatus.UNINITIALIZED) {
      this.log(`Plugin already initialized: ${name}`, 'warn');
      return;
    }

    this.log(`Initializing plugin: ${name}`);
    plugin.status = PluginStatus.INITIALIZING;

    try {
      await plugin.initialize(this.context);
      plugin.status = PluginStatus.ACTIVE;
      this.log(`Plugin initialized: ${name}`);

      // 활성화 훅 호출
      if (plugin.activate) {
        await plugin.activate();
      }
    } catch (error) {
      plugin.status = PluginStatus.ERROR;
      throw new PluginError(
        pluginId,
        `Failed to initialize plugin: ${name}`,
        error as Error
      );
    }
  }

  /**
   * 플러그인 해제
   */
  async unregister(pluginId: string): Promise<void> {
    const registered = this.plugins.get(pluginId);
    if (!registered) {
      throw new PluginError(pluginId, 'Plugin not found');
    }

    const { plugin, unsubscribe } = registered;
    const { name } = plugin.metadata;

    this.log(`Unregistering plugin: ${name}`);

    try {
      // 비활성화
      if (plugin.status === PluginStatus.ACTIVE && plugin.deactivate) {
        await plugin.deactivate();
      }

      // 정리
      await plugin.destroy();
      plugin.status = PluginStatus.DESTROYED;

      // 이벤트 구독 해제
      unsubscribe.forEach(fn => fn());

      // 제거
      this.plugins.delete(pluginId);

      this.log(`Plugin unregistered: ${name}`);
    } catch (error) {
      throw new PluginError(
        pluginId,
        `Failed to unregister plugin: ${name}`,
        error as Error
      );
    }
  }

  /**
   * 플러그인 활성화
   */
  async enable(pluginId: string): Promise<void> {
    const registered = this.plugins.get(pluginId);
    if (!registered) {
      throw new PluginError(pluginId, 'Plugin not found');
    }

    const { plugin } = registered;

    if (plugin.enabled) {
      return;
    }

    plugin.enabled = true;

    // 초기화되지 않은 경우 초기화
    if (plugin.status === PluginStatus.UNINITIALIZED) {
      await this.initialize(pluginId);
    } else if (plugin.status === PluginStatus.PAUSED && plugin.activate) {
      await plugin.activate();
      plugin.status = PluginStatus.ACTIVE;
    }

    this.log(`Plugin enabled: ${plugin.metadata.name}`);
  }

  /**
   * 플러그인 비활성화
   */
  async disable(pluginId: string): Promise<void> {
    const registered = this.plugins.get(pluginId);
    if (!registered) {
      throw new PluginError(pluginId, 'Plugin not found');
    }

    const { plugin } = registered;

    if (!plugin.enabled) {
      return;
    }

    plugin.enabled = false;

    if (plugin.status === PluginStatus.ACTIVE) {
      if (plugin.deactivate) {
        await plugin.deactivate();
      }
      plugin.status = PluginStatus.PAUSED;
    }

    this.log(`Plugin disabled: ${plugin.metadata.name}`);
  }

  /**
   * 플러그인 재시작
   */
  async restart(pluginId: string): Promise<void> {
    await this.disable(pluginId);
    await this.enable(pluginId);
  }

  /**
   * 플러그인 가져오기
   */
  getPlugin(pluginId: string): ChatPlugin | undefined {
    return this.plugins.get(pluginId)?.plugin;
  }

  /**
   * 모든 플러그인 가져오기
   */
  getAllPlugins(): ChatPlugin[] {
    return Array.from(this.plugins.values()).map(r => r.plugin);
  }

  /**
   * 활성화된 플러그인 가져오기
   */
  getActivePlugins(): ChatPlugin[] {
    return this.getAllPlugins().filter(
      p => p.enabled && p.status === PluginStatus.ACTIVE
    );
  }

  /**
   * 플러그인 메타데이터 가져오기
   */
  getPluginMetadata(): PluginMetadata[] {
    return this.getAllPlugins().map(p => p.metadata);
  }

  /**
   * 플러그인 존재 여부 확인
   */
  hasPlugin(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }

  /**
   * 모든 플러그인 정리
   */
  async destroyAll(): Promise<void> {
    this.log('Destroying all plugins');

    const pluginIds = Array.from(this.plugins.keys());

    for (const id of pluginIds) {
      try {
        await this.unregister(id);
      } catch (error) {
        this.log(`Failed to unregister plugin ${id}: ${error}`, 'error');
      }
    }

    this.plugins.clear();
    this.log('All plugins destroyed');
  }

  /**
   * 의존성 확인
   */
  private checkDependencies(metadata: PluginMetadata): void {
    if (!metadata.dependencies || metadata.dependencies.length === 0) {
      return;
    }

    const missing = metadata.dependencies.filter(dep => !this.hasPlugin(dep));

    if (missing.length > 0) {
      throw new PluginError(
        metadata.id,
        `Missing dependencies: ${missing.join(', ')}`
      );
    }
  }

  /**
   * 로거 생성
   */
  private createLogger(): PluginLogger {
    const prefix = '[PluginManager]';

    return {
      info: (message: string, ...args: unknown[]) => {
        if (this.debug) {
          console.log(prefix, message, ...args);
        }
      },
      warn: (message: string, ...args: unknown[]) => {
        console.warn(prefix, message, ...args);
      },
      error: (message: string, ...args: unknown[]) => {
        console.error(prefix, message, ...args);
      },
      debug: (message: string, ...args: unknown[]) => {
        if (this.debug) {
          console.debug(prefix, message, ...args);
        }
      },
    };
  }

  /**
   * 내부 로깅 헬퍼
   */
  private log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    this.logger[level](message);
  }
}

export default PluginManager;
