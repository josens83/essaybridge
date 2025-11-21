/**
 * Thread Plugin
 * Slack 스타일 스레드 답장 시스템
 */

import type { ChatMessage } from '../types';
import { eventBus } from './EventBus';

export interface Thread {
  id: string;
  parentMessageId: string;
  parentMessage: ChatMessage;
  replies: ChatMessage[];
  replyCount: number;
  lastReplyAt: Date;
  participants: string[]; // 참여한 사용자 ID 목록
}

class ThreadPlugin {
  private threads: Map<string, Thread>;

  constructor() {
    this.threads = new Map();
    this.loadFromStorage();
  }

  /**
   * 스레드 생성 또는 가져오기
   */
  getOrCreateThread(parentMessage: ChatMessage): Thread {
    const existingThread = this.threads.get(parentMessage.id);

    if (existingThread) {
      return existingThread;
    }

    const thread: Thread = {
      id: `thread-${parentMessage.id}`,
      parentMessageId: parentMessage.id,
      parentMessage,
      replies: [],
      replyCount: 0,
      lastReplyAt: new Date(parentMessage.createdAt),
      participants: [parentMessage.senderId],
    };

    this.threads.set(parentMessage.id, thread);
    this.saveToStorage();

    return thread;
  }

  /**
   * 스레드에 답장 추가
   */
  addReply(parentMessageId: string, reply: ChatMessage): void {
    const thread = this.threads.get(parentMessageId);

    if (!thread) {
      console.error('Thread not found:', parentMessageId);
      return;
    }

    thread.replies.push(reply);
    thread.replyCount = thread.replies.length;
    thread.lastReplyAt = new Date(reply.createdAt);

    // 참여자 추가
    if (!thread.participants.includes(reply.senderId)) {
      thread.participants.push(reply.senderId);
    }

    this.saveToStorage();

    // 이벤트 발행
    eventBus.emit('thread:reply_added', {
      threadId: thread.id,
      reply,
      replyCount: thread.replyCount,
    });
  }

  /**
   * 스레드 가져오기
   */
  getThread(parentMessageId: string): Thread | null {
    return this.threads.get(parentMessageId) || null;
  }

  /**
   * 스레드 답글 목록 가져오기
   */
  getReplies(parentMessageId: string): ChatMessage[] {
    const thread = this.threads.get(parentMessageId);
    return thread ? thread.replies : [];
  }

  /**
   * 스레드 답글 개수
   */
  getReplyCount(parentMessageId: string): number {
    const thread = this.threads.get(parentMessageId);
    return thread ? thread.replyCount : 0;
  }

  /**
   * 마지막 답글 시간
   */
  getLastReplyTime(parentMessageId: string): Date | null {
    const thread = this.threads.get(parentMessageId);
    return thread ? thread.lastReplyAt : null;
  }

  /**
   * 스레드 참여자 목록
   */
  getParticipants(parentMessageId: string): string[] {
    const thread = this.threads.get(parentMessageId);
    return thread ? thread.participants : [];
  }

  /**
   * 모든 스레드 가져오기
   */
  getAllThreads(): Thread[] {
    return Array.from(this.threads.values());
  }

  /**
   * 채팅방의 스레드 목록
   */
  getRoomThreads(roomId: string): Thread[] {
    return this.getAllThreads().filter(
      thread => thread.parentMessage.roomId === roomId
    );
  }

  /**
   * 활성 스레드 (최근 답글이 있는)
   */
  getActiveThreads(roomId: string, hours: number = 24): Thread[] {
    const now = Date.now();
    const cutoff = now - hours * 60 * 60 * 1000;

    return this.getRoomThreads(roomId).filter(
      thread => thread.lastReplyAt.getTime() > cutoff
    );
  }

  /**
   * 스레드 삭제
   */
  deleteThread(parentMessageId: string): void {
    this.threads.delete(parentMessageId);
    this.saveToStorage();

    eventBus.emit('thread:deleted', { parentMessageId });
  }

  /**
   * 스레드 답글 삭제
   */
  deleteReply(parentMessageId: string, replyId: string): void {
    const thread = this.threads.get(parentMessageId);

    if (!thread) return;

    thread.replies = thread.replies.filter(r => r.id !== replyId);
    thread.replyCount = thread.replies.length;

    if (thread.replies.length > 0) {
      thread.lastReplyAt = new Date(thread.replies[thread.replies.length - 1].createdAt);
    }

    this.saveToStorage();

    eventBus.emit('thread:reply_deleted', {
      threadId: thread.id,
      replyId,
      replyCount: thread.replyCount,
    });
  }

  /**
   * Local Storage에 저장
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.threads.entries());
      localStorage.setItem('chat_threads', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save threads:', error);
    }
  }

  /**
   * Local Storage에서 로드
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('chat_threads');
      if (stored) {
        const data = JSON.parse(stored);
        this.threads = new Map(data);
      }
    } catch (error) {
      console.error('Failed to load threads:', error);
    }
  }

  /**
   * 스레드 통계
   */
  getStatistics(roomId: string): {
    totalThreads: number;
    totalReplies: number;
    activeThreads: number;
    avgRepliesPerThread: number;
  } {
    const roomThreads = this.getRoomThreads(roomId);
    const activeThreads = this.getActiveThreads(roomId);
    const totalReplies = roomThreads.reduce((sum, t) => sum + t.replyCount, 0);

    return {
      totalThreads: roomThreads.length,
      totalReplies,
      activeThreads: activeThreads.length,
      avgRepliesPerThread: roomThreads.length > 0
        ? totalReplies / roomThreads.length
        : 0,
    };
  }
}

// Singleton instance
export const threadPlugin = new ThreadPlugin();
export default ThreadPlugin;
