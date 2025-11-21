/**
 * PluginProvider - 플러그인 시스템 Context Provider
 *
 * 책임:
 * - PluginManager 초기화 및 제공
 * - 플러그인 자동 등록
 * - 플러그인 상태 관리
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { PluginManager } from '../core/PluginManager';
import { chatEventBus } from '../core/EventBus';
import type { ChatPlugin } from '../core/Plugin';
import { TypingIndicatorPlugin } from '../plugins/TypingIndicatorPlugin';
import { MessageReactionPlugin } from '../plugins/MessageReactionPlugin';
import { MessageThreadPlugin } from '../plugins/MessageThreadPlugin';
import { MentionPlugin } from '../plugins/MentionPlugin';
import { MarkdownPlugin } from '../plugins/MarkdownPlugin';

interface PluginContextType {
  pluginManager: PluginManager | null;
  plugins: ChatPlugin[];
  isReady: boolean;
}

const PluginContext = createContext<PluginContextType>({
  pluginManager: null,
  plugins: [],
  isReady: false,
});

interface PluginProviderProps {
  children: React.ReactNode;
  currentUserId: string;
  getCurrentRoomId: () => string | null;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({
  children,
  currentUserId,
  getCurrentRoomId,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [plugins, setPlugins] = useState<ChatPlugin[]>([]);
  const managerRef = useRef<PluginManager | null>(null);

  useEffect(() => {
    const initializePlugins = async () => {
      // PluginManager 생성
      const manager = new PluginManager({
        eventBus: chatEventBus,
        getCurrentUserId: () => currentUserId,
        getCurrentRoomId,
        debug: import.meta.env.DEV,
      });

      managerRef.current = manager;

      // 플러그인 등록
      try {
        // 타이핑 인디케이터 플러그인
        const typingPlugin = new TypingIndicatorPlugin({
          typingTimeout: 3000,
          throttleInterval: 1000,
        });
        await manager.register(typingPlugin);

        // 메시지 리액션 플러그인
        const reactionPlugin = new MessageReactionPlugin({
          maxReactionsPerMessage: 100,
          maxReactionsPerUser: 10,
        });
        await manager.register(reactionPlugin);

        // 메시지 스레드 플러그인 (Discord/Slack 스타일)
        const threadPlugin = new MessageThreadPlugin({
          maxThreadDepth: 1,
          autoMarkAsRead: true,
          notifyOnReply: true,
        });
        await manager.register(threadPlugin);

        // 멘션 플러그인 (Slack 스타일)
        const mentionPlugin = new MentionPlugin({
          enableChannelMentions: true,
          enableHereMentions: true,
          enableEveryoneMentions: false,
          maxSuggestions: 10,
        });
        await manager.register(mentionPlugin);

        // Markdown 플러그인 (Discord 스타일)
        const markdownPlugin = new MarkdownPlugin({
          enableBold: true,
          enableItalic: true,
          enableUnderline: true,
          enableStrikethrough: true,
          enableCode: true,
          enableCodeBlock: true,
          enableQuote: true,
          enableEmoji: true,
          enableSpoiler: true,
        });
        await manager.register(markdownPlugin);

        // 플러그인 목록 업데이트
        setPlugins(manager.getAllPlugins());
        setIsReady(true);

        console.log('[PluginProvider] Plugins initialized successfully');
      } catch (error) {
        console.error('[PluginProvider] Failed to initialize plugins:', error);
      }
    };

    initializePlugins();

    // Cleanup
    return () => {
      if (managerRef.current) {
        managerRef.current.destroyAll();
      }
    };
  }, [currentUserId, getCurrentRoomId]);

  return (
    <PluginContext.Provider
      value={{
        pluginManager: managerRef.current,
        plugins,
        isReady,
      }}
    >
      {children}
    </PluginContext.Provider>
  );
};

/**
 * 플러그인 컨텍스트 사용 Hook
 */
export const usePlugins = (): PluginContextType => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePlugins must be used within PluginProvider');
  }
  return context;
};

/**
 * 특정 플러그인 가져오기 Hook
 */
export const usePlugin = <T extends ChatPlugin>(pluginId: string): T | null => {
  const { pluginManager } = usePlugins();

  if (!pluginManager) {
    return null;
  }

  return pluginManager.getPlugin(pluginId) as T | null;
};

export default PluginProvider;
