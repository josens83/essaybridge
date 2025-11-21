/**
 * ThreadButton Component
 * Discord/Slack 스타일 스레드 시작/보기 버튼
 *
 * 벤치마킹: Discord, Slack의 스레드 UI
 */

import React, { useState, useEffect } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { usePlugin } from '../contexts/PluginProvider';
import type { MessageThreadPlugin } from '../plugins/MessageThreadPlugin';
import { useFeatureToggle } from '../core/FeatureToggle';
import { FeatureFlag } from '../core/FeatureToggle';

interface ThreadButtonProps {
  messageId: string;
  onOpenThread?: (threadId: string, messageId: string) => void;
}

export const ThreadButton: React.FC<ThreadButtonProps> = ({
  messageId,
  onOpenThread,
}) => {
  const plugin = usePlugin<MessageThreadPlugin>('message-threads');
  const isEnabled = useFeatureToggle(FeatureFlag.MESSAGE_THREADING);
  const [replyCount, setReplyCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [threadId, setThreadId] = useState<string | null>(null);

  // 스레드 정보 업데이트
  useEffect(() => {
    if (!plugin || !isEnabled) {
      return;
    }

    const updateThreadInfo = () => {
      const existingThreadId = plugin.getThreadIdByMessage(messageId);
      setThreadId(existingThreadId || null);

      if (existingThreadId) {
        const count = plugin.getThreadReplyCount(messageId);
        const unread = plugin.getThreadUnreadCount(messageId);
        setReplyCount(count);
        setUnreadCount(unread);
      }
    };

    // 초기 로드
    updateThreadInfo();

    // 스레드 업데이트 이벤트 구독
    const unsubscribe = plugin['context']?.eventBus.on('thread:updated', (data) => {
      const msgThreadId = plugin.getThreadIdByMessage(messageId);
      if (msgThreadId === data.threadId) {
        updateThreadInfo();
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [plugin, messageId, isEnabled]);

  if (!isEnabled || !plugin) {
    return null;
  }

  const handleClick = async () => {
    let currentThreadId = threadId;

    // 스레드가 없으면 생성
    if (!currentThreadId) {
      const roomId = plugin['context']?.getCurrentRoomId();
      if (!roomId) return;

      currentThreadId = await plugin.createThread(messageId, roomId);
    }

    // 스레드 열기
    if (onOpenThread && currentThreadId) {
      await plugin.openThread(currentThreadId);
      onOpenThread(currentThreadId, messageId);
    }
  };

  // 스레드가 없으면 호버 시에만 표시
  const hasThread = replyCount > 0;

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium
        transition-all duration-200
        ${
          hasThread
            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100'
        }
        ${unreadCount > 0 ? 'ring-2 ring-primary-500' : ''}
      `}
      title={hasThread ? `스레드 보기 (${replyCount}개 답글)` : '스레드 시작'}
    >
      <FiMessageSquare className="w-3.5 h-3.5" />
      {hasThread && (
        <>
          <span>{replyCount}</span>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full">
              {unreadCount}
            </span>
          )}
        </>
      )}
      {!hasThread && <span>스레드 시작</span>}
    </button>
  );
};

export default React.memo(ThreadButton);
