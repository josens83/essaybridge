/**
 * ChatBubble Component
 * 메시지 버블 컴포넌트 - 텍스트, 파일, 시스템 메시지 지원
 */

import React, { useState } from 'react';
import {
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiMoreVertical,
  FiCornerUpLeft,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiBookmark,
  FiFile,
  FiDownload,
  FiAlertCircle,
} from 'react-icons/fi';
import type { ChatMessage } from '../types';
import { useChat } from '../hooks/useChatContext';
import { useAuth } from '../../auth';
import ImageLightbox from './ImageLightbox';
import LinkPreview, { extractUrls } from './LinkPreview';
import FormattedText from '../plugins/FormattedText';

interface ChatBubbleProps {
  message: ChatMessage;
  showAvatar?: boolean;
  isGrouped?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  showAvatar = true,
  isGrouped = false,
}) => {
  const { user } = useAuth();
  const {
    setReplyingTo,
    setEditingMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    togglePinMessage,
  } = useChat();

  const [showMenu, setShowMenu] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);

  const currentUserId = user?.id || 'student1';
  const isOwnMessage = message.senderId === currentUserId;
  const isSystemMessage = message.type === 'system';

  // 시간 포맷
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 상태 아이콘
  const StatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <FiClock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <FiCheck className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <FiCheckCircle className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <FiCheckCircle className="w-3 h-3 text-blue-500" />;
      case 'failed':
        return <FiAlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  // 시스템 메시지
  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  // 빠른 이모지 목록
  const quickEmojis = ['👍', '❤️', '😊', '🎉', '👏', '🤔'];

  return (
    <div
      className={`flex items-end gap-2 group ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} ${
        isGrouped ? 'mt-1' : 'mt-4'
      }`}
    >
      {/* 아바타 */}
      {showAvatar && !isOwnMessage && !isGrouped ? (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
          {message.senderImage ? (
            <img src={message.senderImage} alt={message.senderName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
              {message.senderName[0]}
            </div>
          )}
        </div>
      ) : !isOwnMessage ? (
        <div className="w-8 flex-shrink-0" />
      ) : null}

      {/* 메시지 컨테이너 */}
      <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {/* 발신자 이름 (그룹화되지 않은 경우만) */}
        {!isOwnMessage && !isGrouped && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
            {message.senderName}
          </span>
        )}

        {/* 답장 표시 */}
        {message.replyTo && (
          <div
            className={`flex items-center gap-1 text-xs px-3 py-1.5 mb-1 rounded-lg ${
              isOwnMessage
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiCornerUpLeft className="w-3 h-3" />
            <span className="font-medium">{message.replyTo.senderName}</span>
            <span className="truncate max-w-[150px]">{message.replyTo.content}</span>
          </div>
        )}

        {/* 메시지 버블 */}
        <div className="relative">
          <div
            className={`relative px-4 py-2.5 rounded-2xl break-words ${
              isOwnMessage
                ? 'bg-primary-600 text-white rounded-br-md'
                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md shadow-sm'
            } ${message.isPinned ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}`}
          >
            {/* 핀 표시 */}
            {message.isPinned && (
              <FiBookmark className={`absolute -top-1 -right-1 w-3 h-3 ${
                isOwnMessage ? 'text-yellow-300' : 'text-yellow-500'
              }`} />
            )}

            {/* 텍스트 메시지 */}
            {message.type === 'text' && (
              <>
                <FormattedText text={message.content} className="whitespace-pre-wrap" />
                {/* URL 링크 프리뷰 */}
                {extractUrls(message.content).slice(0, 1).map((url) => (
                  <LinkPreview key={url} url={url} isOwnMessage={isOwnMessage} />
                ))}
              </>
            )}

            {/* 파일/이미지 메시지 */}
            {(message.type === 'file' || message.type === 'image') && message.attachments && (
              <div className="space-y-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id}>
                    {attachment.type === 'image' ? (
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="max-w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setLightboxImage({ url: attachment.url, name: attachment.name })}
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isOwnMessage
                            ? 'bg-primary-500/30'
                            : 'bg-gray-100 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`p-2 rounded ${
                          isOwnMessage ? 'bg-primary-500/50' : 'bg-gray-200 dark:bg-gray-500'
                        }`}>
                          <FiFile className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                          <p className={`text-xs ${
                            isOwnMessage ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                        <button className={`p-1.5 rounded-full hover:bg-black/10 ${
                          isOwnMessage ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          <FiDownload className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {message.content && <p className="mt-2">{message.content}</p>}
              </div>
            )}

            {/* 수정됨 표시 */}
            {message.isEdited && (
              <span className={`text-xs ${
                isOwnMessage ? 'text-primary-200' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {' '}(수정됨)
              </span>
            )}
          </div>

          {/* 액션 메뉴 (hover 시 표시) */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${
              isOwnMessage ? 'right-full mr-2' : 'left-full ml-2'
            }`}
          >
            {/* 빠른 이모지 */}
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className="p-1.5 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
            >
              😊
            </button>

            {/* 답장 */}
            <button
              onClick={() => setReplyingTo(message)}
              className="p-1.5 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
            >
              <FiCornerUpLeft className="w-4 h-4" />
            </button>

            {/* 더보기 메뉴 */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
              >
                <FiMoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className={`absolute z-50 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 ${
                  isOwnMessage ? 'right-0' : 'left-0'
                }`}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(message.content);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FiCopy className="w-4 h-4" /> 복사
                  </button>
                  <button
                    onClick={() => {
                      togglePinMessage(message.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FiBookmark className="w-4 h-4" /> {message.isPinned ? '핀 해제' : '핀 고정'}
                  </button>
                  {isOwnMessage && (
                    <>
                      <button
                        onClick={() => {
                          setEditingMessage(message);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <FiEdit2 className="w-4 h-4" /> 수정
                      </button>
                      <button
                        onClick={() => {
                          deleteMessage(message.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 flex items-center gap-2"
                      >
                        <FiTrash2 className="w-4 h-4" /> 삭제
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 빠른 이모지 선택기 */}
          {showReactionPicker && (
            <div className={`absolute z-50 top-full mt-1 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-2 py-1 flex items-center gap-1 ${
              isOwnMessage ? 'right-0' : 'left-0'
            }`}>
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    const hasReacted = message.reactions?.some(
                      r => r.emoji === emoji && r.users.some(u => u.userId === currentUserId)
                    );
                    if (hasReacted) {
                      removeReaction(message.id, emoji);
                    } else {
                      addReaction(message.id, emoji);
                    }
                    setShowReactionPicker(false);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 리액션 표시 */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {message.reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => {
                  const hasReacted = reaction.users.some(u => u.userId === currentUserId);
                  if (hasReacted) {
                    removeReaction(message.id, reaction.emoji);
                  } else {
                    addReaction(message.id, reaction.emoji);
                  }
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                  reaction.users.some(u => u.userId === currentUserId)
                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* 시간 및 상태 */}
        <div className={`flex items-center gap-1.5 mt-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatTime(message.createdAt)}
          </span>
          {isOwnMessage && <StatusIcon />}

          {/* 읽음 상태 - 읽은 사람 아바타 표시 */}
          {isOwnMessage && message.readBy && message.readBy.length > 1 && (
            <div className="flex items-center -space-x-1 ml-1">
              {message.readBy
                .filter(userId => userId !== currentUserId)
                .slice(0, 3)
                .map((userId, index) => (
                  <div
                    key={userId}
                    className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-gray-300"
                    title={`읽음`}
                    style={{ zIndex: 3 - index }}
                  >
                    {userId.charAt(0).toUpperCase()}
                  </div>
                ))}
              {message.readBy.length > 4 && (
                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-gray-800 flex items-center justify-center text-[7px] text-gray-500 dark:text-gray-400">
                  +{message.readBy.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 이미지 라이트박스 */}
      {lightboxImage && (
        <ImageLightbox
          isOpen={true}
          imageUrl={lightboxImage.url}
          fileName={lightboxImage.name}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};

export default ChatBubble;
