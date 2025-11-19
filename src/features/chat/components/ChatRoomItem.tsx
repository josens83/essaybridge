/**
 * ChatRoomItem Component
 * 채팅방 목록의 개별 아이템
 */

import React from 'react';
import {
  FiBookmark,
  FiVolumeX,
  FiFileText,
  FiUsers,
  FiHeadphones,
} from 'react-icons/fi';
import type { ChatRoom } from '../types';
import { useAuth } from '../../auth';

interface ChatRoomItemProps {
  room: ChatRoom;
  isSelected: boolean;
  onClick: () => void;
}

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ room, isSelected, onClick }) => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'student1';

  // 상대방 정보 (1:1 채팅)
  const otherParticipant = room.participants.find(p => p.userId !== currentUserId);

  // 채팅방 타입별 아이콘
  const getRoomIcon = () => {
    switch (room.type) {
      case 'essay_review':
        return <FiFileText className="w-4 h-4" />;
      case 'consulting':
        return <FiUsers className="w-4 h-4" />;
      case 'support':
        return <FiHeadphones className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // 채팅방 타입별 레이블
  const getRoomTypeLabel = () => {
    switch (room.type) {
      case 'essay_review':
        return '논술 첨삭';
      case 'consulting':
        return '입시 컨설팅';
      case 'support':
        return '고객 지원';
      default:
        return '';
    }
  };

  // 온라인 상태 색상
  const getStatusColor = () => {
    switch (otherParticipant?.status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  // 시간 포맷
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('ko-KR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
  };

  // 마지막 메시지 미리보기
  const getMessagePreview = () => {
    if (!room.lastMessage) return '대화를 시작해보세요';

    if (room.lastMessage.type === 'file' || room.lastMessage.type === 'image') {
      return room.lastMessage.type === 'image' ? '📷 사진' : '📎 파일';
    }

    if (room.lastMessage.type === 'system') {
      return room.lastMessage.content;
    }

    return room.lastMessage.content;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left ${
        isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
      }`}
    >
      {/* 아바타 */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {otherParticipant?.profileImage ? (
            <img
              src={otherParticipant.profileImage}
              alt={otherParticipant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-600 dark:text-gray-300">
              {otherParticipant?.name[0] || '?'}
            </div>
          )}
        </div>

        {/* 온라인 상태 표시 */}
        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor()}`} />
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {otherParticipant?.name || '알 수 없음'}
            </h3>
            {room.isPinned && (
              <FiBookmark className="w-3 h-3 text-gray-400" />
            )}
            {room.isMuted && (
              <FiVolumeX className="w-3 h-3 text-gray-400" />
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {room.lastMessage && formatTime(room.lastMessage.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
            room.type === 'essay_review'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : room.type === 'consulting'
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            {getRoomIcon()}
            {getRoomTypeLabel()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {room.lastMessage?.senderId === currentUserId && (
              <span className="text-gray-400 dark:text-gray-500">나: </span>
            )}
            {getMessagePreview()}
          </p>

          {/* 안읽은 메시지 배지 */}
          {room.unreadCount > 0 && (
            <span className="flex-shrink-0 ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs font-medium rounded-full min-w-[20px] text-center">
              {room.unreadCount > 99 ? '99+' : room.unreadCount}
            </span>
          )}
        </div>

        {/* 메타데이터 (에세이 제목 등) */}
        {room.metadata?.essayTitle && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 truncate">
            📝 {room.metadata.essayTitle}
          </p>
        )}
      </div>
    </button>
  );
};

export default ChatRoomItem;
