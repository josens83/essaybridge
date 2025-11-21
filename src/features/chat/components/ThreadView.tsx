/**
 * ThreadView Component
 * Discord/Slack 스타일 스레드 사이드 패널
 *
 * 벤치마킹: Discord, Slack의 스레드 뷰
 */

import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiMessageSquare } from 'react-icons/fi';
import { usePlugin } from '../contexts/PluginProvider';
import type { MessageThreadPlugin } from '../plugins/MessageThreadPlugin';
import { useFeatureToggle } from '../core/FeatureToggle';
import { FeatureFlag } from '../core/FeatureToggle';
import type { ChatMessage } from '../types';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

interface ThreadViewProps {
  isOpen: boolean;
  threadId: string | null;
  parentMessageId: string | null;
  onClose: () => void;
}

export const ThreadView: React.FC<ThreadViewProps> = ({
  isOpen,
  threadId,
  parentMessageId,
  onClose,
}) => {
  const plugin = usePlugin<MessageThreadPlugin>('message-threads');
  const isEnabled = useFeatureToggle(FeatureFlag.MESSAGE_THREADING);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스레드 정보 로드
  useEffect(() => {
    if (!plugin || !isEnabled || !threadId) {
      return;
    }

    const loadThread = () => {
      const threadData = plugin.getThread(threadId);

      if (threadData) {
        setMessages(threadData.messages);
      }
    };

    loadThread();

    // 스레드 업데이트 이벤트 구독
    const unsubscribe = plugin['context']?.eventBus.on('thread:updated', (data) => {
      if (data.threadId === threadId) {
        loadThread();
      }
    });

    // 스레드 답글 이벤트 구독
    const unsubReply = plugin['context']?.eventBus.on('thread:reply', (data) => {
      if (data.threadId === threadId) {
        loadThread();
        // 새 답글이 추가되면 스크롤
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      if (unsubReply) unsubReply();
    };
  }, [plugin, threadId, isEnabled]);

  // 닫기 시 이벤트 발행
  const handleClose = async () => {
    if (plugin) {
      await plugin.closeThread();
    }
    onClose();
  };

  if (!isEnabled || !isOpen || !threadId) {
    return null;
  }

  return (
    <>
      {/* 오버레이 (모바일) */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={handleClose}
      />

      {/* 스레드 패널 */}
      <div
        className={`
          fixed lg:relative top-0 right-0 h-full
          w-full lg:w-96 bg-white dark:bg-gray-800
          border-l border-gray-200 dark:border-gray-700
          flex flex-col z-50
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiMessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              스레드
            </h2>
            {messages.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {messages.length}개 답글
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="스레드 닫기"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* 원본 메시지 (부모 메시지) - 여기서는 Mock으로 표시 */}
        {parentMessageId && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
              원본 메시지
            </div>
            {/* 실제로는 parentMessage를 props로 받아서 표시해야 함 */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              이 메시지에 대한 스레드입니다
            </div>
          </div>
        )}

        {/* 스레드 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <FiMessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                첫 번째 답글을 작성하세요
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                이 메시지에 대해 논의하고 정리된 대화를 유지하세요
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const isGrouped = !!(
                  prevMessage &&
                  prevMessage.senderId === message.senderId &&
                  new Date(message.createdAt).getTime() -
                    new Date(prevMessage.createdAt).getTime() <
                    60000 // 1분 이내
                );

                return (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    showAvatar={!isGrouped}
                    isGrouped={isGrouped}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* 입력창 */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <ChatInput />
        </div>
      </div>
    </>
  );
};

export default React.memo(ThreadView);
