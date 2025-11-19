/**
 * Chat API Service
 * 채팅 관련 모든 API 호출을 담당
 */

import api from '../../../api/client';
import type {
  ChatRoom,
  ChatMessage,
  CreateRoomRequest,
  SendMessageRequest,
  GetMessagesQuery,
  GetMessagesResponse,
  GetRoomsResponse,
  MarkAsReadRequest,
  SearchMessagesRequest,
  SearchMessagesResponse,
  MessageReaction,
} from '../types';

// API 엔드포인트 기본 경로
const CHAT_API = '/chat';

export const chatService = {
  // ============ 채팅방 관련 ============

  /**
   * 채팅방 목록 조회
   */
  async getRooms(): Promise<GetRoomsResponse> {
    return api.get<GetRoomsResponse>(`${CHAT_API}/rooms`);
  },

  /**
   * 특정 채팅방 조회
   */
  async getRoomById(roomId: string): Promise<ChatRoom> {
    return api.get<ChatRoom>(`${CHAT_API}/rooms/${roomId}`);
  },

  /**
   * 새 채팅방 생성
   */
  async createRoom(data: CreateRoomRequest): Promise<ChatRoom> {
    return api.post<ChatRoom>(`${CHAT_API}/rooms`, data);
  },

  /**
   * 채팅방 나가기
   */
  async leaveRoom(roomId: string): Promise<void> {
    return api.delete(`${CHAT_API}/rooms/${roomId}/leave`);
  },

  /**
   * 채팅방 핀 설정/해제
   */
  async togglePinRoom(roomId: string, isPinned: boolean): Promise<ChatRoom> {
    return api.patch<ChatRoom>(`${CHAT_API}/rooms/${roomId}`, { isPinned });
  },

  /**
   * 채팅방 음소거 설정/해제
   */
  async toggleMuteRoom(roomId: string, isMuted: boolean): Promise<ChatRoom> {
    return api.patch<ChatRoom>(`${CHAT_API}/rooms/${roomId}`, { isMuted });
  },

  // ============ 메시지 관련 ============

  /**
   * 메시지 목록 조회 (무한 스크롤)
   */
  async getMessages(query: GetMessagesQuery): Promise<GetMessagesResponse> {
    const params = new URLSearchParams();
    if (query.cursor) params.append('cursor', query.cursor);
    if (query.limit) params.append('limit', query.limit.toString());

    return api.get<GetMessagesResponse>(
      `${CHAT_API}/rooms/${query.roomId}/messages?${params.toString()}`
    );
  },

  /**
   * 메시지 전송
   */
  async sendMessage(data: SendMessageRequest): Promise<ChatMessage> {
    // 파일 첨부가 있는 경우 FormData 사용
    if (data.attachments && data.attachments.length > 0) {
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('type', data.type);
      if (data.replyToId) formData.append('replyToId', data.replyToId);

      data.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      return api.post<ChatMessage>(
        `${CHAT_API}/rooms/${data.roomId}/messages`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    }

    return api.post<ChatMessage>(`${CHAT_API}/rooms/${data.roomId}/messages`, {
      content: data.content,
      type: data.type,
      replyToId: data.replyToId,
    });
  },

  /**
   * 메시지 수정
   */
  async editMessage(
    roomId: string,
    messageId: string,
    content: string
  ): Promise<ChatMessage> {
    return api.patch<ChatMessage>(
      `${CHAT_API}/rooms/${roomId}/messages/${messageId}`,
      { content }
    );
  },

  /**
   * 메시지 삭제
   */
  async deleteMessage(roomId: string, messageId: string): Promise<void> {
    return api.delete(`${CHAT_API}/rooms/${roomId}/messages/${messageId}`);
  },

  /**
   * 메시지 읽음 처리
   */
  async markAsRead(data: MarkAsReadRequest): Promise<void> {
    return api.post(`${CHAT_API}/rooms/${data.roomId}/read`, {
      messageIds: data.messageIds,
    });
  },

  /**
   * 메시지 핀 설정/해제
   */
  async togglePinMessage(
    roomId: string,
    messageId: string,
    isPinned: boolean
  ): Promise<ChatMessage> {
    return api.patch<ChatMessage>(
      `${CHAT_API}/rooms/${roomId}/messages/${messageId}`,
      { isPinned }
    );
  },

  // ============ 리액션 관련 ============

  /**
   * 리액션 추가
   */
  async addReaction(
    roomId: string,
    messageId: string,
    emoji: string
  ): Promise<MessageReaction[]> {
    return api.post<MessageReaction[]>(
      `${CHAT_API}/rooms/${roomId}/messages/${messageId}/reactions`,
      { emoji }
    );
  },

  /**
   * 리액션 제거
   */
  async removeReaction(
    roomId: string,
    messageId: string,
    emoji: string
  ): Promise<MessageReaction[]> {
    return api.delete<MessageReaction[]>(
      `${CHAT_API}/rooms/${roomId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`
    );
  },

  // ============ 검색 관련 ============

  /**
   * 메시지 검색
   */
  async searchMessages(
    request: SearchMessagesRequest
  ): Promise<SearchMessagesResponse> {
    return api.post<SearchMessagesResponse>(`${CHAT_API}/search`, request);
  },

  // ============ 타이핑 관련 ============

  /**
   * 타이핑 상태 전송
   */
  async sendTypingStatus(roomId: string, isTyping: boolean): Promise<void> {
    return api.post(`${CHAT_API}/rooms/${roomId}/typing`, { isTyping });
  },

  // ============ 파일 업로드 ============

  /**
   * 파일 업로드
   */
  async uploadFile(
    roomId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; name: string; size: number; mimeType: string }> {
    return api.upload(
      `${CHAT_API}/rooms/${roomId}/upload`,
      file,
      onProgress
        ? (progressEvent) => {
            const percent = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            onProgress(percent);
          }
        : undefined
    );
  },

  // ============ 핀된 메시지 ============

  /**
   * 핀된 메시지 목록 조회
   */
  async getPinnedMessages(roomId: string): Promise<ChatMessage[]> {
    return api.get<ChatMessage[]>(`${CHAT_API}/rooms/${roomId}/pinned`);
  },
};

export default chatService;
