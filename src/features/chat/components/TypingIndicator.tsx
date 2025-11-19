/**
 * TypingIndicator Component
 * 상대방이 타이핑 중일 때 표시되는 인디케이터
 */

import React from 'react';
import type { TypingEvent } from '../types';

interface TypingIndicatorProps {
  typingUsers: TypingEvent[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const names = typingUsers.map(t => t.userName);
  const displayText = names.length === 1
    ? `${names[0]}님이 입력 중...`
    : names.length === 2
    ? `${names[0]}님, ${names[1]}님이 입력 중...`
    : `${names[0]}님 외 ${names.length - 1}명이 입력 중...`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
      {/* 타이핑 애니메이션 */}
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{displayText}</span>
    </div>
  );
};

export default TypingIndicator;
