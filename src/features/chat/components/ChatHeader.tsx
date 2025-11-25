/**
 * ChatHeader Component
 * 채팅방 상단 헤더 - 상대방 정보, 검색, 옵션 메뉴, 내 상태 변경
 */

import React, { useState } from 'react';
import {
  FiArrowLeft,
  FiSearch,
  FiMoreVertical,
  FiBookmark,
  FiVolume,
  FiVolumeX,
  FiTrash2,
  FiFileText,
  FiInfo,
  FiBell,
  FiBellOff,
} from 'react-icons/fi';
import type { ChatRoom } from '../types';
import { useChat } from '../hooks/useChatContext';
import { useAuth } from '../../auth';
import PresenceIndicator from './PresenceIndicator';
import UserStatusSelector from './UserStatusSelector';
import { presencePlugin, type UserStatus } from '../plugins/PresencePlugin';

interface ChatHeaderProps {
  room: ChatRoom;
  onBack?: () => void;
  onOpenSearch?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ room, onBack, onOpenSearch }) => {
  const { user } = useAuth();
  const { setSearchOpen, togglePinRoom, toggleMuteRoom, getPinnedMessages } = useChat();
  const [showMenu, setShowMenu] = useState(false);
  const [showMyStatus, setShowMyStatus] = useState(false);
  const [myStatus, setMyStatus] = useState<UserStatus>(presencePlugin.getMyStatus());

  const currentUserId = user?.id || 'student1';
  const otherParticipant = room.participants.find(p => p.userId !== currentUserId);
  const pinnedMessages = getPinnedMessages();

  // 온라인 상태 텍스트
  const getStatusText = () => {
    if (!otherParticipant) return '';

    switch (otherParticipant.status) {
      case 'online':
        return '온라인';
      case 'away':
        return '자리비움';
      case 'busy':
        return '바쁨';
      default:
        if (otherParticipant.lastSeen) {
          const lastSeen = new Date(otherParticipant.lastSeen);
          const now = new Date();
          const diff = now.getTime() - lastSeen.getTime();
          const diffMinutes = Math.floor(diff / 60000);
          const diffHours = Math.floor(diff / 3600000);
          const diffDays = Math.floor(diff / 86400000);

          if (diffMinutes < 1) return '방금 전 접속';
          if (diffMinutes < 60) return `${diffMinutes}분 전 접속`;
          if (diffHours < 24) return `${diffHours}시간 전 접속`;
          return `${diffDays}일 전 접속`;
        }
        return '오프라인';
    }
  };

  // 내 상태 변경 핸들러
  const handleMyStatusChange = (status: UserStatus) => {
    setMyStatus(status);
    presencePlugin.updateStatus(status);
    setShowMyStatus(false);
  };

  return (
    <div className="h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* 뒤로가기 버튼 (모바일) */}
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}

        {/* 아바타 */}
        <div className="relative w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {otherParticipant?.profileImage ? (
            <img
              src={otherParticipant.profileImage}
              alt={otherParticipant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
              {otherParticipant?.name[0] || '?'}
            </div>
          )}
          {/* 온라인 상태 표시 */}
          <div className="absolute bottom-0 right-0">
            <PresenceIndicator status={otherParticipant?.status || 'offline'} size="sm" showBorder />
          </div>
        </div>

        {/* 정보 */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {otherParticipant?.name || '알 수 없음'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-center gap-1">
        {/* 내 상태 표시/변경 버튼 */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowMyStatus(!showMyStatus)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            title="내 상태 변경"
          >
            <PresenceIndicator status={myStatus} size="sm" />
            <span className="text-xs hidden md:inline">
              {myStatus === 'online' ? '온라인' :
               myStatus === 'away' ? '자리비움' :
               myStatus === 'busy' ? '바쁨' : '오프라인'}
            </span>
          </button>

          {showMyStatus && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMyStatus(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50">
                <UserStatusSelector
                  currentStatus={myStatus}
                  onStatusChange={handleMyStatusChange}
                />
              </div>
            </>
          )}
        </div>

        {/* 핀된 메시지 */}
        {pinnedMessages.length > 0 && (
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 relative"
            title={`핀 고정된 메시지 ${pinnedMessages.length}개`}
          >
            <FiBookmark className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center">
              {pinnedMessages.length}
            </span>
          </button>
        )}

        {/* 검색 */}
        <button
          onClick={() => onOpenSearch ? onOpenSearch() : setSearchOpen(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
          title="메시지 검색 (Ctrl+K)"
        >
          <FiSearch className="w-5 h-5" />
        </button>

        {/* 알림 상태 */}
        <button
          onClick={() => toggleMuteRoom(room.id)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
          title={room.isMuted ? '알림 켜기' : '알림 끄기'}
        >
          {room.isMuted ? <FiBellOff className="w-5 h-5" /> : <FiBell className="w-5 h-5" />}
        </button>

        {/* 더보기 메뉴 */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
            title="더보기"
          >
            <FiMoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                {room.metadata?.essayId && (
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiFileText className="w-4 h-4" />
                    논술 보기
                  </button>
                )}

                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FiInfo className="w-4 h-4" />
                  상세 정보
                </button>

                <hr className="my-1 border-gray-200 dark:border-gray-700" />

                <button
                  onClick={() => {
                    togglePinRoom(room.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <FiBookmark className="w-4 h-4" />
                  {room.isPinned ? '핀 해제' : '채팅방 핀 고정'}
                </button>

                <button
                  onClick={() => {
                    toggleMuteRoom(room.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  {room.isMuted ? (
                    <>
                      <FiVolume className="w-4 h-4" />
                      알림 켜기
                    </>
                  ) : (
                    <>
                      <FiVolumeX className="w-4 h-4" />
                      알림 끄기
                    </>
                  )}
                </button>

                <hr className="my-1 border-gray-200 dark:border-gray-700" />

                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400">
                  <FiTrash2 className="w-4 h-4" />
                  채팅방 나가기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
