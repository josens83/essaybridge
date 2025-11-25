/**
 * ChatPage Component
 * 채팅 메인 페이지 - 채팅방 목록 + 메시지 뷰 + 스레드 + 고급 검색 통합
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  FiMessageSquare,
  FiSearch,
  FiPlus,
  FiX,
  FiArrowDown,
  FiFilter,
  FiSettings,
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
  ThreadView,
} from '../components';
import { LoadingSpinner } from '../../../shared/components';
import type { ChatRoomType, ChatMessage } from '../types';
import { threadPlugin, type Thread } from '../plugins/ThreadPlugin';
import { searchPlugin, type SearchFilter } from '../plugins/SearchPlugin';
import { notificationPlugin } from '../plugins/NotificationPlugin';

// 고급 검색 패널 컴포넌트
const AdvancedSearchPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}> = ({ isOpen, onClose, messages }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({ query: '' });
  const [showFilters, setShowFilters] = useState(false);

  // 검색 필터 파싱
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const parsedFilter = searchPlugin.parseQuery(query);
    setSearchFilter(parsedFilter);
  };

  // 검색 결과
  const searchResults = searchQuery
    ? searchPlugin.search(messages, searchFilter)
    : [];

  // 검색 저장
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      searchPlugin.saveSearch(searchQuery);
    }
  };

  // 최근 검색어
  const recentSearches = searchPlugin.getRecentSearches();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-white dark:bg-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              placeholder="메시지 검색... (from:이름, has:link, after:날짜)"
              autoFocus
              className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <FiX className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters
                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
            title="고급 검색 필터"
          >
            <FiFilter className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* 고급 필터 옵션 */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-xs text-gray-500 dark:text-gray-400 w-full mb-1">
              검색 필터 예시:
            </span>
            <button
              onClick={() => handleSearch(searchQuery + ' from:')}
              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              from:발신자
            </button>
            <button
              onClick={() => handleSearch(searchQuery + ' has:link')}
              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              has:link
            </button>
            <button
              onClick={() => handleSearch(searchQuery + ' has:file')}
              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              has:file
            </button>
            <button
              onClick={() => handleSearch(searchQuery + ' has:mention')}
              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              has:mention
            </button>
            <button
              onClick={() => handleSearch(searchQuery + ' after:2024-01-01')}
              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              after:날짜
            </button>
          </div>
        )}

        {/* 최근 검색어 */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">최근 검색:</span>
            {recentSearches.slice(0, 5).map((term, index) => (
              <button
                key={index}
                onClick={() => handleSearch(term)}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {searchQuery ? (
          searchResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {searchResults.length}개의 결과
              </p>
              {searchResults.map((result) => (
                <div
                  key={result.message.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    onClose();
                    // 해당 메시지로 스크롤 (실제 구현 필요)
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.message.senderName}
                      </span>
                      {result.matchScore > 50 && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded">
                          높은 관련도
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(result.message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {result.message.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">검색 결과가 없습니다</p>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">검색어를 입력하세요</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Ctrl+K로 검색을 열 수 있습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// 알림 설정 패널
const NotificationSettingsPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(notificationPlugin.getSettings());

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    notificationPlugin.updateSettings(newSettings);
  };

  const handleTestNotification = () => {
    notificationPlugin.sendTestNotification();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">알림 설정</h3>
      </div>

      <div className="p-4 space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700 dark:text-gray-300">데스크톱 알림</span>
          <input
            type="checkbox"
            checked={settings.desktop}
            onChange={(e) => handleSettingChange('desktop', e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700 dark:text-gray-300">사운드 알림</span>
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(e) => handleSettingChange('sound', e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700 dark:text-gray-300">멘션만 알림</span>
          <input
            type="checkbox"
            checked={settings.mentionsOnly}
            onChange={(e) => handleSettingChange('mentionsOnly', e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
        </label>

        <button
          onClick={handleTestNotification}
          className="w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          테스트 알림 보내기
        </button>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          완료
        </button>
      </div>
    </div>
  );
};

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
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

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
          <div className="flex items-center gap-1">
            {/* 알림 설정 버튼 */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                title="알림 설정"
              >
                <FiSettings className="w-5 h-5" />
              </button>
              <NotificationSettingsPanel
                isOpen={showNotificationSettings}
                onClose={() => setShowNotificationSettings(false)}
              />
            </div>
            <button
              onClick={onNewChat}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              title="새 대화"
            >
              <FiPlus className="w-5 h-5" />
            </button>
          </div>
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
              onClick={() => setFilter(key as typeof filter)}
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
  } = useChat();

  const { notifyNewMessage, requestNotificationPermission } = useChatNotifications();

  // 키보드 단축키 활성화
  useKeyboardShortcuts();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesCountRef = useRef(messages.length);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 스레드 상태
  const [activeThread, setActiveThread] = useState<Thread | null>(null);

  // 스크롤 위치 감지
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // 하단으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 스레드 시작/열기
  const handleStartThread = useCallback((message: ChatMessage) => {
    const thread = threadPlugin.getOrCreateThread(message);
    setActiveThread(thread);
  }, []);

  // 스레드 답글 전송
  const handleSendThreadReply = useCallback(async (content: string, parentMessageId: string) => {
    // 스레드에 답글 추가 (실제로는 API 호출 필요)
    const reply: ChatMessage = {
      id: `reply-${Date.now()}`,
      roomId: selectedRoom?.id || '',
      senderId: 'student1',
      senderName: '김학생',
      senderRole: 'student',
      content,
      type: 'text',
      status: 'sent',
      isPinned: false,
      isEdited: false,
      readBy: ['student1'],
      createdAt: new Date().toISOString(),
    };
    threadPlugin.addReply(parentMessageId, reply);

    // 스레드 상태 업데이트
    const updatedThread = threadPlugin.getThread(parentMessageId);
    if (updatedThread) {
      setActiveThread({ ...updatedThread });
    }
  }, [selectedRoom]);

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      });
    }
  };

  // 날짜가 다른지 확인
  const isDifferentDay = (date1: string, date2: string) => {
    return new Date(date1).toDateString() !== new Date(date2).toDateString();
  };

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

        // NotificationPlugin 사용
        notificationPlugin.notify(latestMessage, otherParticipant?.name);
      }
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages, notifyNewMessage, selectedRoom]);

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
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 relative">
      {/* 헤더 */}
      <ChatHeader
        room={selectedRoom}
        onBack={() => selectRoom(null)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 고급 검색 패널 */}
      <AdvancedSearchPanel
        isOpen={isSearchOpen || uiState.isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchOpen(false);
        }}
        messages={messages}
      />

      {/* 메시지 영역 */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-2 relative"
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

              // 날짜 구분선 표시 여부
              const showDateDivider = index === 0 ||
                (prevMessage && isDifferentDay(prevMessage.createdAt, message.createdAt));

              return (
                <React.Fragment key={message.id}>
                  {/* 날짜 구분선 */}
                  {showDateDivider && (
                    <div className="flex items-center justify-center my-4">
                      <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
                      <span className="px-4 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                        {formatDate(message.createdAt)}
                      </span>
                      <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
                    </div>
                  )}
                  <ChatBubble
                    message={message}
                    showAvatar={!isGrouped}
                    isGrouped={isGrouped}
                    onStartThread={handleStartThread}
                  />
                </React.Fragment>
              );
            })}

            {/* 타이핑 인디케이터 */}
            <TypingIndicator typingUsers={typingUsers} />

            <div ref={messagesEndRef} />
          </>
        )}

        {/* 스크롤 하단 버튼 */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 p-3 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-10"
            title="최신 메시지로 이동"
          >
            <FiArrowDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput />

      {/* 스레드 뷰 사이드패널 */}
      {activeThread && (
        <ThreadView
          thread={activeThread}
          onClose={() => setActiveThread(null)}
          onSendReply={handleSendThreadReply}
        />
      )}
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
