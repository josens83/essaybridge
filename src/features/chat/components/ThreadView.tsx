/**
 * ThreadView Component
 * 스레드 답글 보기 사이드 패널
 */

import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiMessageSquare, FiSend } from 'react-icons/fi';
import { threadPlugin, type Thread } from '../plugins/ThreadPlugin';
import type { ChatMessage } from '../types';
import ChatBubble from './ChatBubble';

interface ThreadViewProps {
  thread: Thread;
  onClose: () => void;
  onSendReply: (content: string, parentMessageId: string) => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({ thread, onClose, onSendReply }) => {
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<ChatMessage[]>(thread.replies);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 스레드 업데이트 감지
    const updatedThread = threadPlugin.getThread(thread.parentMessageId);
    if (updatedThread) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReplies(updatedThread.replies);
    }
  }, [thread.parentMessageId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies]);

  const handleSend = () => {
    if (!replyText.trim()) return;

    onSendReply(replyText.trim(), thread.parentMessageId);
    setReplyText('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // textarea 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [replyText]);

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FiMessageSquare className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            스레드
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* 원본 메시지 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <ChatBubble message={thread.parentMessage} showAvatar={true} />
      </div>

      {/* 답글 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {replies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <FiMessageSquare className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-sm">아직 답글이 없습니다</p>
            <p className="text-xs">첫 번째 답글을 작성해보세요!</p>
          </div>
        ) : (
          <>
            {replies.map((reply, index) => {
              const prevReply = replies[index - 1];
              const isGrouped =
                prevReply &&
                prevReply.senderId === reply.senderId &&
                new Date(reply.createdAt).getTime() - new Date(prevReply.createdAt).getTime() < 60000;

              return (
                <ChatBubble
                  key={reply.id}
                  message={reply}
                  showAvatar={!isGrouped}
                  isGrouped={isGrouped}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 답글 입력 */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="스레드에 답글 작성..."
            rows={1}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            style={{ maxHeight: '150px' }}
          />
          <button
            onClick={handleSend}
            disabled={!replyText.trim()}
            className={`p-2.5 rounded-full transition-colors ${
              replyText.trim()
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            } disabled:opacity-50`}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>

        {/* 참여자 표시 */}
        {thread.participants.length > 1 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{thread.participants.length}명 참여 중</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadView;
