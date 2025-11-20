/**
 * Chat Core Exports
 * 채팅 기능의 핵심 아키텍처 모듈
 */

// Event Bus
export { default as EventBus, chatEventBus } from './EventBus';
export type { ChatEventMap } from './EventBus';

// Plugin System
export {
  BasePlugin,
  PluginStatus,
  PluginError,
} from './Plugin';
export type {
  ChatPlugin,
  PluginContext,
  PluginLogger,
  PluginMetadata,
  PluginFactory,
} from './Plugin';

// Plugin Manager
export { default as PluginManager } from './PluginManager';
export type { PluginManagerConfig } from './PluginManager';

// Feature Toggle
export {
  default as FeatureToggleManager,
  FeatureFlag,
  getFeatureToggle,
  useFeatureToggle,
} from './FeatureToggle';
export type { FeatureConfig } from './FeatureToggle';
