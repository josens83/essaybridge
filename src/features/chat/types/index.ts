/**
 * Chat Feature Types
 * 최고 수준의 실시간 채팅 시스템을 위한 타입 정의
 */

import type { UserRole } from '../../../shared/types';

// ============ 기본 타입 ============

export type ChatRoomType = 'essay_review' | 'consulting' | 'support' | 'direct';
export type MessageType = 'text' | 'image' | 'file' | 'system' | 'essay_link';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type ParticipantStatus = 'online' | 'offline' | 'away' | 'busy';

// ============ 채팅방 관련 타입 ============

export interface ChatParticipant {
  userId: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  status: ParticipantStatus;
  lastSeen?: string;
  isTyping?: boolean;
}

export interface ChatRoom {
  id: string;
  type: ChatRoomType;
  name?: string;  // 그룹 채팅용 (현재는 1:1만)
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  metadata?: {
    essayId?: string;
    essayTitle?: string;
    consultingSessionId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============ 메시지 관련 타입 ============

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  size: number;  // bytes
  mimeType: string;
  thumbnail?: string;  // 이미지 썸네일
}

export interface MessageReaction {
  emoji: string;
  users: { userId: string; name: string }[];
  count: number;
}

export interface MessageReply {
  messageId: string;
  content: string;
  senderName: string;
  type: MessageType;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderImage?: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  replyTo?: MessageReply;
  isPinned: boolean;
  isEdited: boolean;
  editedAt?: string;
  readBy: string[];  // userId 배열
  createdAt: string;

  // 스레드 관련 (Discord/Slack 스타일)
  threadId?: string;  // 이 메시지가 속한 스레드 ID (없으면 메인 채팅)
  threadReplyCount?: number;  // 이 메시지에 달린 스레드 답글 수
  hasThread?: boolean;  // 스레드가 시작된 메시지인지

  // 시스템 메시지용
  systemData?: {
    action: 'room_created' | 'user_joined' | 'user_left' | 'essay_submitted' | 'review_completed';
    targetUserId?: string;
    targetUserName?: string;
  };
}

// ============ 스레드 관련 타입 ============

export interface MessageThread {
  id: string;
  parentMessageId: string;  // 스레드를 시작한 메시지
  roomId: string;
  messages: ChatMessage[];  // 스레드 내 메시지들
  participantIds: string[];  // 스레드에 참여한 사용자들
  unreadCount: number;  // 읽지 않은 답글 수
  lastReplyAt: string;
  createdAt: string;
}

// ============ API 요청/응답 타입 ============

export interface CreateRoomRequest {
  type: ChatRoomType;
  participantIds: string[];
  metadata?: {
    essayId?: string;
    consultingSessionId?: string;
  };
}

export interface SendMessageRequest {
  roomId: string;
  content: string;
  type: MessageType;
  attachments?: File[];
  replyToId?: string;
}

export interface GetMessagesQuery {
  roomId: string;
  cursor?: string;  // 무한 스크롤용
  limit?: number;
}

export interface GetMessagesResponse {
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface GetRoomsResponse {
  rooms: ChatRoom[];
  total: number;
}

export interface MarkAsReadRequest {
  roomId: string;
  messageIds: string[];
}

export interface SearchMessagesRequest {
  query: string;
  roomId?: string;
  startDate?: string;
  endDate?: string;
  type?: MessageType;
}

export interface SearchMessagesResponse {
  messages: ChatMessage[];
  total: number;
}

// ============ 실시간 이벤트 타입 ============

export type ChatEventType =
  | 'message:new'
  | 'message:updated'
  | 'message:deleted'
  | 'message:reaction'
  | 'room:updated'
  | 'typing:start'
  | 'typing:stop'
  | 'user:status'
  | 'messages:read';

export interface ChatEvent<T = unknown> {
  type: ChatEventType;
  roomId: string;
  data: T;
  timestamp: string;
}

export interface TypingEvent {
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface UserStatusEvent {
  userId: string;
  status: ParticipantStatus;
  lastSeen?: string;
}

export interface MessagesReadEvent {
  userId: string;
  messageIds: string[];
}

// ============ UI 상태 타입 ============

export interface ChatUIState {
  selectedRoomId: string | null;
  isSearchOpen: boolean;
  searchQuery: string;
  replyingTo: ChatMessage | null;
  editingMessage: ChatMessage | null;
  isEmojiPickerOpen: boolean;
  isAttachmentMenuOpen: boolean;
}

// ============ 알림 타입 ============

export interface ChatNotification {
  id: string;
  roomId: string;
  messageId: string;
  senderName: string;
  content: string;
  type: 'message' | 'mention' | 'reaction';
  isRead: boolean;
  createdAt: string;
}

// ============ 설정 타입 ============

export interface ChatSettings {
  notifications: {
    sound: boolean;
    desktop: boolean;
    email: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showReadReceipts: boolean;
  };
  display: {
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
  };
}
