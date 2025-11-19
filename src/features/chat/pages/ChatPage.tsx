/**
 * ChatPage Component
 * 채팅 메인 페이지 - 채팅방 목록 + 메시지 뷰 통합
 */

import React, { useRef, useEffect } from 'react';
import {
  FiMessageSquare,
  FiSearch,
  FiPlus,
  FiX,
} from 'react-icons/fi';
import { ChatProvider, useChat } from '../hooks/useChatContext';
import { useChatNotifications } from '../hooks/useChatNotifications';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import {
  ChatBubble,
  ChatInput,
  ChatHeader,
  ChatRoomItem,
  TypingIndicator,
  NewChatModal,
} from '../components';
import { LoadingSpinner } from '../../../shared/components';
import type { ChatRoomType } from '../types';

// 채팅방 목록 컴포넌트
const ChatRoomList: React.FC<{ onNewChat: () => void }> = ({ onNewChat }) => {
  const {
    rooms,
    selectedRoom,
    selectRoom,
    isLoading,
    totalUnreadCount,
  } = useChat();

  const [filter, setFilter] = React.useState<'all' | 'essay' | 'consulting' | 'support'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  // 필터링된 채팅방
  const filteredRooms = rooms
    .filter(room => {
      if (filter === 'all') return true;
      if (filter === 'essay') return room.type === 'essay_review';
      if (filter === 'consulting') return room.type === 'consulting';
      if (filter === 'support') return room.type === 'support';
      return true;
    })
    .filter(room => {
      if (!searchTerm) return true;
      const otherParticipant = room.participants.find(p => p.userId !== 'student1');
      return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             room.metadata?.essayTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      // 핀 고정된 것 먼저
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // 최신 메시지 순
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="채팅방을 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">메시지</h1>
            {totalUnreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-medium rounded-full">
                {totalUnreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onNewChat}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </div>

        {/* 검색 */}
        <div className="relative mb-3">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="대화 검색..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500"
          />
        </div>

        {/* 필터 탭 */}
        <div className="flex gap-1">
          {[
            { key: 'all', label: '전체' },
            { key: 'essay', label: '첨삭' },
            { key: 'consulting', label: '컨설팅' },
            { key: 'support', label: '지원' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === key
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FiMessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? '검색 결과가 없습니다' : '채팅방이 없습니다'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredRooms.map((room) => (
              <ChatRoomItem
                key={room.id}
                room={room}
                isSelected={selectedRoom?.id === room.id}
                onClick={() => selectRoom(room.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 메시지 뷰 컴포넌트
const ChatMessageView: React.FC = () => {
  const {
    selectedRoom,
    messages,
    selectRoom,
    isLoading,
    typingUsers,
    uiState,
    setSearchOpen,
    searchMessages,
    setSearchQuery,
  } = useChat();

  const { notifyNewMessage, requestNotificationPermission } = useChatNotifications();

  // 키보드 단축키 활성화
  useKeyboardShortcuts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesCountRef = useRef(messages.length);

  // 컴포넌트 마운트 시 알림 권한 요청
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // 새 메시지 시 스크롤 및 알림
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // 새 메시지가 추가된 경우에만 알림
    if (messages.length > prevMessagesCountRef.current && messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      // 자신이 보낸 메시지가 아닌 경우에만 알림
      if (latestMessage.senderId !== 'student1') {
        const otherParticipant = selectedRoom?.participants.find(p => p.userId !== 'student1');
        notifyNewMessage(latestMessage, otherParticipant?.name);
      }
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages, notifyNewMessage, selectedRoom]);

  // 검색 결과
  const searchResults = uiState.searchQuery ? searchMessages(uiState.searchQuery) : [];

  // 선택된 채팅방이 없을 때
  if (!selectedRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-8">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <FiMessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          대화를 선택하세요
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          왼쪽 목록에서 대화를 선택하여 메시지를 확인하고 답장을 보내세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <ChatHeader room={selectedRoom} onBack={() => selectRoom(null)} />

      {/* 검색 오버레이 */}
      {uiState.isSearchOpen && (
        <div className="absolute inset-0 z-50 bg-white dark:bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={uiState.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="메시지 검색..."
                autoFocus
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {uiState.searchQuery ? (
              searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setSearchOpen(false);
                        // 해당 메시지로 스크롤 (실제로는 구현 필요)
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {msg.senderName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  검색 결과가 없습니다
                </p>
              )
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                검색어를 입력하세요
              </p>
            )}
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-2"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="md" text="메시지를 불러오는 중..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 dark:text-gray-400">
              대화를 시작해보세요!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isGrouped =
                prevMessage &&
                prevMessage.senderId === message.senderId &&
                message.type !== 'system' &&
                new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() < 60000;

              return (
                <ChatBubble
                  key={message.id}
                  message={message}
                  showAvatar={!isGrouped}
                  isGrouped={isGrouped}
                />
              );
            })}

            {/* 타이핑 인디케이터 */}
            <TypingIndicator typingUsers={typingUsers} />

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput />
    </div>
  );
};

// 메인 채팅 페이지 (반응형)
const ChatPageContent: React.FC = () => {
  const { selectedRoom, createRoom } = useChat();
  const [isNewChatModalOpen, setNewChatModalOpen] = React.useState(false);

  const handleCreateRoom = async (type: ChatRoomType, participantId: string) => {
    try {
      await createRoom(type, participantId);
      setNewChatModalOpen(false);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white dark:bg-gray-800">
      {/* 채팅방 목록 (데스크톱: 항상 표시, 모바일: 채팅방 미선택 시만) */}
      <div className={`w-full lg:w-96 border-r border-gray-200 dark:border-gray-700 ${
        selectedRoom ? 'hidden lg:flex flex-col' : 'flex flex-col'
      }`}>
        <ChatRoomList onNewChat={() => setNewChatModalOpen(true)} />
      </div>

      {/* 메시지 뷰 (데스크톱: 항상 표시, 모바일: 채팅방 선택 시만) */}
      <div className={`flex-1 relative ${
        selectedRoom ? 'flex flex-col' : 'hidden lg:flex flex-col'
      }`}>
        <ChatMessageView />
      </div>

      {/* 새 채팅 모달 */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

// 래퍼 컴포넌트 (Provider 포함)
const ChatPage: React.FC = () => {
  return (
    <ChatProvider>
      <ChatPageContent />
    </ChatProvider>
  );
};

export default ChatPage;
