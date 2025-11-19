/**
 * Chat Context & Provider
 * 채팅 상태를 전역으로 관리하는 Context
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type {
  ChatRoom,
  ChatMessage,
  ChatUIState,
  TypingEvent,
} from '../types';
import { mockChatRooms, mockMessages, delay, generateId, generateAutoResponse } from '../api/chat.mock';
import { useAuth } from '../../auth';

// ============ Context 타입 ============

interface ChatContextType {
  // 채팅방 관련
  rooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  selectRoom: (roomId: string | null) => void;

  // 메시지 관련
  messages: ChatMessage[];
  sendMessage: (content: string, type?: 'text' | 'image' | 'file', attachments?: File[], replyToId?: string) => Promise<void>;
  loadMoreMessages: () => Promise<boolean>;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, newContent: string) => void;

  // 리액션
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;

  // 읽음 처리
  markAsRead: (messageIds?: string[]) => void;

  // 검색
  searchMessages: (query: string) => ChatMessage[];

  // 핀
  togglePinMessage: (messageId: string) => void;
  getPinnedMessages: () => ChatMessage[];
  togglePinRoom: (roomId: string) => void;
  toggleMuteRoom: (roomId: string) => void;

  // 타이핑
  typingUsers: TypingEvent[];
  setTyping: (isTyping: boolean) => void;

  // UI 상태
  uiState: ChatUIState;
  setReplyingTo: (message: ChatMessage | null) => void;
  setEditingMessage: (message: ChatMessage | null) => void;
  setSearchOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;

  // 로딩 상태
  isLoading: boolean;
  isSending: boolean;
  hasMoreMessages: boolean;

  // 전체 안읽은 메시지 수
  totalUnreadCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ============ Provider 컴포넌트 ============

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'student1'; // mock용 기본값

  // 상태
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  // UI 상태
  const [uiState, setUIState] = useState<ChatUIState>({
    selectedRoomId: null,
    isSearchOpen: false,
    searchQuery: '',
    replyingTo: null,
    editingMessage: null,
    isEmojiPickerOpen: false,
    isAttachmentMenuOpen: false,
  });

  // 타이핑 타이머 ref
  const typingTimeoutRef = useRef<number | null>(null);

  // 선택된 채팅방
  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || null;

  // 전체 안읽은 메시지 수
  const totalUnreadCount = rooms.reduce((sum, room) => sum + room.unreadCount, 0);

  // ============ 초기 데이터 로드 ============

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await delay(500); // 시뮬레이션

      // Mock 데이터 로드
      setRooms(mockChatRooms);
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  // ============ 채팅방 선택 시 메시지 로드 ============

  useEffect(() => {
    if (!selectedRoomId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      await delay(300);

      const roomMessages = mockMessages[selectedRoomId] || [];
      setMessages(roomMessages);
      setHasMoreMessages(roomMessages.length >= 20);
      setIsLoading(false);

      // 메시지 읽음 처리
      markAsRead();
    };

    loadMessages();
  }, [selectedRoomId]);

  // ============ 채팅방 선택 ============

  const selectRoom = useCallback((roomId: string | null) => {
    setSelectedRoomId(roomId);
    setUIState(prev => ({
      ...prev,
      selectedRoomId: roomId,
      replyingTo: null,
      editingMessage: null,
    }));
  }, []);

  // ============ 메시지 전송 ============

  const sendMessage = useCallback(async (
    content: string,
    type: 'text' | 'image' | 'file' = 'text',
    _attachments?: File[],
    replyToId?: string
  ) => {
    if (!selectedRoomId || !content.trim()) return;

    setIsSending(true);

    // 새 메시지 생성
    const newMessage: ChatMessage = {
      id: generateId(),
      roomId: selectedRoomId,
      senderId: currentUserId,
      senderName: user?.name || '김학생',
      senderRole: user?.role || 'student',
      content: content.trim(),
      type,
      status: 'sending',
      isPinned: false,
      isEdited: false,
      readBy: [currentUserId],
      createdAt: new Date().toISOString(),
      ...(replyToId && {
        replyTo: {
          messageId: replyToId,
          content: messages.find(m => m.id === replyToId)?.content || '',
          senderName: messages.find(m => m.id === replyToId)?.senderName || '',
          type: messages.find(m => m.id === replyToId)?.type || 'text',
        },
      }),
    };

    // 낙관적 업데이트
    setMessages(prev => [...prev, newMessage]);

    // 채팅방 마지막 메시지 업데이트
    setRooms(prev => prev.map(room =>
      room.id === selectedRoomId
        ? { ...room, lastMessage: newMessage, updatedAt: newMessage.createdAt }
        : room
    ));

    // UI 상태 초기화
    setUIState(prev => ({ ...prev, replyingTo: null, editingMessage: null }));

    // 전송 시뮬레이션
    await delay(500);

    // 상태 업데이트 (sent → delivered)
    setMessages(prev => prev.map(msg =>
      msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
    ));

    await delay(300);

    setMessages(prev => prev.map(msg =>
      msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
    ));

    setIsSending(false);

    // 자동 응답 시뮬레이션 (50% 확률)
    if (Math.random() > 0.5) {
      await delay(2000 + Math.random() * 3000);

      // 타이핑 표시
      const room = rooms.find(r => r.id === selectedRoomId);
      const otherParticipant = room?.participants.find(p => p.userId !== currentUserId);

      if (otherParticipant) {
        setTypingUsers([{
          userId: otherParticipant.userId,
          userName: otherParticipant.name,
          isTyping: true,
        }]);

        await delay(1500 + Math.random() * 1500);

        setTypingUsers([]);

        // 자동 응답 추가
        const autoResponse = generateAutoResponse(selectedRoomId, content);
        if (autoResponse) {
          setMessages(prev => [...prev, autoResponse]);
          setRooms(prev => prev.map(r =>
            r.id === selectedRoomId
              ? { ...r, lastMessage: autoResponse, updatedAt: autoResponse.createdAt }
              : r
          ));
        }
      }
    }
  }, [selectedRoomId, currentUserId, user, messages, rooms]);

  // ============ 더 많은 메시지 로드 ============

  const loadMoreMessages = useCallback(async (): Promise<boolean> => {
    if (!selectedRoomId || !hasMoreMessages || isLoading) return false;

    setIsLoading(true);
    await delay(500);

    // 실제로는 cursor 기반 페이징, 여기선 시뮬레이션
    setHasMoreMessages(false);
    setIsLoading(false);

    return false;
  }, [selectedRoomId, hasMoreMessages, isLoading]);

  // ============ 메시지 삭제 ============

  const deleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  }, []);

  // ============ 메시지 수정 ============

  const editMessage = useCallback((messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, content: newContent, isEdited: true, editedAt: new Date().toISOString() }
        : msg
    ));
    setUIState(prev => ({ ...prev, editingMessage: null }));
  }, []);

  // ============ 리액션 추가/제거 ============

  const addReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;

      const reactions = msg.reactions || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        // 이미 있는 리액션에 사용자 추가
        if (existingReaction.users.some(u => u.userId === currentUserId)) return msg;

        return {
          ...msg,
          reactions: reactions.map(r =>
            r.emoji === emoji
              ? {
                  ...r,
                  users: [...r.users, { userId: currentUserId, name: user?.name || '김학생' }],
                  count: r.count + 1,
                }
              : r
          ),
        };
      } else {
        // 새 리액션 추가
        return {
          ...msg,
          reactions: [
            ...reactions,
            {
              emoji,
              users: [{ userId: currentUserId, name: user?.name || '김학생' }],
              count: 1,
            },
          ],
        };
      }
    }));
  }, [currentUserId, user]);

  const removeReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;

      const reactions = msg.reactions || [];
      return {
        ...msg,
        reactions: reactions
          .map(r => {
            if (r.emoji !== emoji) return r;
            const newUsers = r.users.filter(u => u.userId !== currentUserId);
            return { ...r, users: newUsers, count: newUsers.length };
          })
          .filter(r => r.count > 0),
      };
    }));
  }, [currentUserId]);

  // ============ 읽음 처리 ============

  const markAsRead = useCallback((messageIds?: string[]) => {
    if (!selectedRoomId) return;

    const idsToMark = messageIds || messages
      .filter(m => !m.readBy.includes(currentUserId))
      .map(m => m.id);

    if (idsToMark.length === 0) return;

    // 메시지 읽음 상태 업데이트
    setMessages(prev => prev.map(msg =>
      idsToMark.includes(msg.id) && !msg.readBy.includes(currentUserId)
        ? { ...msg, readBy: [...msg.readBy, currentUserId], status: 'read' }
        : msg
    ));

    // 채팅방 unreadCount 업데이트
    setRooms(prev => prev.map(room =>
      room.id === selectedRoomId ? { ...room, unreadCount: 0 } : room
    ));
  }, [selectedRoomId, messages, currentUserId]);

  // ============ 검색 ============

  const searchMessages = useCallback((query: string): ChatMessage[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return messages.filter(m =>
      m.content.toLowerCase().includes(lowerQuery) ||
      m.senderName.toLowerCase().includes(lowerQuery)
    );
  }, [messages]);

  // ============ 핀 기능 ============

  const togglePinMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    ));
  }, []);

  const getPinnedMessages = useCallback((): ChatMessage[] => {
    return messages.filter(m => m.isPinned);
  }, [messages]);

  const togglePinRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId ? { ...room, isPinned: !room.isPinned } : room
    ));
  }, []);

  const toggleMuteRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId ? { ...room, isMuted: !room.isMuted } : room
    ));
  }, []);

  // ============ 타이핑 상태 ============

  const setTyping = useCallback((isTyping: boolean) => {
    // 실제로는 WebSocket으로 전송
    // 여기선 타이머로 자동 해제
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 3000);
    }
  }, []);

  // ============ UI 상태 함수들 ============

  const setReplyingTo = useCallback((message: ChatMessage | null) => {
    setUIState(prev => ({ ...prev, replyingTo: message, editingMessage: null }));
  }, []);

  const setEditingMessage = useCallback((message: ChatMessage | null) => {
    setUIState(prev => ({ ...prev, editingMessage: message, replyingTo: null }));
  }, []);

  const setSearchOpen = useCallback((isOpen: boolean) => {
    setUIState(prev => ({ ...prev, isSearchOpen: isOpen, searchQuery: '' }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setUIState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // ============ Context 값 ============

  const value: ChatContextType = {
    rooms,
    selectedRoom,
    selectRoom,
    messages,
    sendMessage,
    loadMoreMessages,
    deleteMessage,
    editMessage,
    addReaction,
    removeReaction,
    markAsRead,
    searchMessages,
    togglePinMessage,
    getPinnedMessages,
    togglePinRoom,
    toggleMuteRoom,
    typingUsers,
    setTyping,
    uiState,
    setReplyingTo,
    setEditingMessage,
    setSearchOpen,
    setSearchQuery,
    isLoading,
    isSending,
    hasMoreMessages,
    totalUnreadCount,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// ============ Hook ============

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
