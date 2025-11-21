/**
 * MessageReactions Component
 * 메시지에 대한 이모지 반응 표시 및 추가
 */

import React, { useState, useEffect } from 'react';
import { FiSmile } from 'react-icons/fi';
import { usePlugin } from '../contexts/PluginProvider';
import type { MessageReactionPlugin } from '../plugins/MessageReactionPlugin';
import type { ReactionSummary } from '../plugins/MessageReactionPlugin';
import { useFeatureToggle } from '../core/FeatureToggle';
import { FeatureFlag } from '../core/FeatureToggle';

interface MessageReactionsProps {
  messageId: string;
  isOwnMessage: boolean;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  isOwnMessage,
}) => {
  const plugin = usePlugin<MessageReactionPlugin>('message-reactions');
  const isEnabled = useFeatureToggle(FeatureFlag.MESSAGE_REACTIONS);
  const [reactions, setReactions] = useState<ReactionSummary[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  // 반응 업데이트 구독
  useEffect(() => {
    if (!plugin || !isEnabled) {
      return;
    }

    // 초기 반응 로드
    const initialReactions = plugin.getReactionSummary(messageId);
    setReactions(initialReactions);

    // 반응 업데이트 이벤트 구독
    const unsubscribe = plugin['context']?.eventBus.on('reaction:updated', (data) => {
      if (data.messageId === messageId) {
        setReactions(data.reactions);
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

  const handleReactionClick = async (emoji: string) => {
    await plugin.toggleReaction(messageId, emoji);
    setShowPicker(false);
  };

  const allowedEmojis = plugin.getAllowedEmojis();

  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {/* 기존 반응 표시 */}
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => handleReactionClick(reaction.emoji)}
          className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
            transition-all duration-200 hover:scale-110
            ${
              reaction.hasCurrentUser
                ? 'bg-primary-100 dark:bg-primary-900 ring-1 ring-primary-500'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
          title={`${reaction.userIds.length}명이 반응했습니다`}
        >
          <span>{reaction.emoji}</span>
          {reaction.count > 1 && (
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {reaction.count}
            </span>
          )}
        </button>
      ))}

      {/* 반응 추가 버튼 */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`
            inline-flex items-center justify-center w-6 h-6 rounded-full
            text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
            ${isOwnMessage ? 'mr-auto' : 'ml-auto'}
          `}
          aria-label="반응 추가"
        >
          <FiSmile className="w-4 h-4" />
        </button>

        {/* 이모지 피커 */}
        {showPicker && (
          <>
            {/* 배경 클릭 시 닫기 */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowPicker(false)}
            />

            <div
              className={`
                absolute z-20 mt-1 p-2 bg-white dark:bg-gray-800
                rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
                grid grid-cols-5 gap-1
                ${isOwnMessage ? 'left-0' : 'right-0'}
              `}
            >
              {allowedEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="
                    w-8 h-8 flex items-center justify-center
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    rounded transition-colors duration-200
                    text-xl
                  "
                  title={`${emoji} 반응 추가`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageReactions);
