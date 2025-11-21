/**
 * MentionText Component
 * 멘션이 포함된 텍스트를 하이라이트하여 렌더링
 */

import React from 'react';
import { mentionPlugin } from './MentionPlugin';
import { eventBus } from './EventBus';

interface MentionTextProps {
  text: string;
  className?: string;
}

const MentionText: React.FC<MentionTextProps> = ({ text, className = '' }) => {
  const parts = mentionPlugin.splitTextWithMentions(text);

  const handleMentionClick = (userId: string, userName: string) => {
    // 멘션 클릭 이벤트 발행
    eventBus.emit('mention:click', { userId, userName });
  };

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === 'mention') {
          const isSpecial = ['channel', 'here', 'everyone'].includes(part.userName || '');

          return (
            <button
              key={index}
              onClick={() => handleMentionClick(part.userId || '', part.userName || '')}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium transition-colors ${
                isSpecial
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
              }`}
              title={`${part.userName} 프로필 보기`}
            >
              <span>@</span>
              <span>{part.userName}</span>
            </button>
          );
        }

        return <span key={index}>{part.content}</span>;
      })}
    </span>
  );
};

export default MentionText;
