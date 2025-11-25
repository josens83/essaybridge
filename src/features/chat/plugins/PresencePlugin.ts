/**
 * Presence Plugin
 * 실시간 온라인 상태 관리 시스템
 */

import { eventBus } from './EventBus';

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export interface UserPresence {
  userId: string;
  status: UserStatus;
  lastSeen: Date;
  lastActivity: Date;
  isTyping: boolean;
  customMessage?: string;
}

export interface PresenceUpdate {
  userId: string;
  status: UserStatus;
  timestamp: Date;
}

class PresencePlugin {
  private presences: Map<string, UserPresence>;
  private currentUserId: string | null;
  private activityTimer: number | null;
  private awayTimeout: number;
  private checkInterval: number | null;

  constructor() {
    this.presences = new Map();
    this.currentUserId = null;
    this.activityTimer = null;
    this.awayTimeout = 5 * 60 * 1000; // 5분
    this.checkInterval = null;

    this.initializeActivityTracking();
    this.loadFromStorage();
  }

  /**
   * 현재 사용자 설정
   */
  setCurrentUser(userId: string): void {
    this.currentUserId = userId;
    this.updateStatus('online');
  }

  /**
   * 사용자 상태 업데이트
   */
  updateStatus(status: UserStatus, customMessage?: string): void {
    if (!this.currentUserId) return;

    const presence: UserPresence = {
      userId: this.currentUserId,
      status,
      lastSeen: new Date(),
      lastActivity: new Date(),
      isTyping: false,
      customMessage,
    };

    this.presences.set(this.currentUserId, presence);
    this.saveToStorage();

    // 이벤트 발행
    eventBus.emit<PresenceUpdate>('presence:update', {
      userId: this.currentUserId,
      status,
      timestamp: new Date(),
    });
  }

  /**
   * 사용자 활동 기록
   */
  recordActivity(): void {
    if (!this.currentUserId) return;

    const presence = this.presences.get(this.currentUserId);
    if (presence) {
      presence.lastActivity = new Date();

      // 자리비움 상태였다면 온라인으로 복귀
      if (presence.status === 'away') {
        this.updateStatus('online');
      }
    }

    // 자리비움 타이머 재설정
    this.resetAwayTimer();
  }

  /**
   * 타이핑 상태 설정
   */
  setTyping(isTyping: boolean): void {
    if (!this.currentUserId) return;

    const presence = this.presences.get(this.currentUserId);
    if (presence) {
      presence.isTyping = isTyping;

      if (isTyping) {
        this.recordActivity();
      }

      eventBus.emit('presence:typing', {
        userId: this.currentUserId,
        isTyping,
      });
    }
  }

  /**
   * 사용자 상태 가져오기
   */
  getPresence(userId: string): UserPresence | null {
    return this.presences.get(userId) || null;
  }

  /**
   * 내 현재 상태 가져오기
   */
  getMyStatus(): UserStatus {
    if (!this.currentUserId) return 'offline';
    const presence = this.presences.get(this.currentUserId);
    return presence?.status || 'offline';
  }

  /**
   * 모든 상태 가져오기
   */
  getAllPresences(): UserPresence[] {
    return Array.from(this.presences.values());
  }

  /**
   * 온라인 사용자 목록
   */
  getOnlineUsers(): UserPresence[] {
    return this.getAllPresences().filter(p =>
      p.status === 'online' || p.status === 'away' || p.status === 'busy'
    );
  }

  /**
   * 마지막 접속 시간 포맷
   */
  getLastSeenText(userId: string): string {
    const presence = this.presences.get(userId);
    if (!presence) return 'Unknown';

    if (presence.status === 'online') return '온라인';

    const now = new Date().getTime();
    const lastSeen = presence.lastSeen.getTime();
    const diff = now - lastSeen;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return presence.lastSeen.toLocaleDateString('ko-KR');
  }

  /**
   * 활동 추적 초기화
   */
  private initializeActivityTracking(): void {
    // 마우스/키보드 활동 감지
    if (typeof window !== 'undefined') {
      const handleActivity = () => this.recordActivity();

      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);

      // 페이지 숨김/표시 감지
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.updateStatus('away');
        } else {
          this.updateStatus('online');
        }
      });

      // 주기적으로 상태 확인
      this.checkInterval = window.setInterval(() => {
        this.checkIdleStatus();
      }, 30000); // 30초마다
    }
  }

  /**
   * 유휴 상태 확인
   */
  private checkIdleStatus(): void {
    if (!this.currentUserId) return;

    const presence = this.presences.get(this.currentUserId);
    if (!presence || presence.status === 'offline') return;

    const now = new Date().getTime();
    const lastActivity = presence.lastActivity.getTime();
    const idle = now - lastActivity;

    // 5분 이상 활동 없으면 자리비움
    if (idle > this.awayTimeout && presence.status === 'online') {
      this.updateStatus('away');
    }
  }

  /**
   * 자리비움 타이머 재설정
   */
  private resetAwayTimer(): void {
    if (this.activityTimer) {
      window.clearTimeout(this.activityTimer);
    }

    this.activityTimer = window.setTimeout(() => {
      if (this.currentUserId) {
        const presence = this.presences.get(this.currentUserId);
        if (presence && presence.status === 'online') {
          this.updateStatus('away');
        }
      }
    }, this.awayTimeout);
  }

  /**
   * 다른 사용자 상태 업데이트 (실시간 이벤트용)
   */
  updateUserPresence(userId: string, status: UserStatus, lastSeen?: Date): void {
    const existing = this.presences.get(userId);

    const presence: UserPresence = {
      userId,
      status,
      lastSeen: lastSeen || new Date(),
      lastActivity: existing?.lastActivity || new Date(),
      isTyping: existing?.isTyping || false,
      customMessage: existing?.customMessage,
    };

    this.presences.set(userId, presence);
  }

  /**
   * Local Storage에 저장
   */
  private saveToStorage(): void {
    try {
      if (!this.currentUserId) return;

      const presence = this.presences.get(this.currentUserId);
      if (presence) {
        localStorage.setItem('user_presence', JSON.stringify({
          userId: presence.userId,
          status: presence.status,
          customMessage: presence.customMessage,
        }));
      }
    } catch (error) {
      console.error('Failed to save presence:', error);
    }
  }

  /**
   * Local Storage에서 로드
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('user_presence');
      if (stored) {
        const data = JSON.parse(stored);
        // 저장된 상태는 오프라인으로 시작 (새로 로그인 필요)
        this.presences.set(data.userId, {
          userId: data.userId,
          status: 'offline',
          lastSeen: new Date(),
          lastActivity: new Date(),
          isTyping: false,
          customMessage: data.customMessage,
        });
      }
    } catch (error) {
      console.error('Failed to load presence:', error);
    }
  }

  /**
   * 정리
   */
  cleanup(): void {
    if (this.activityTimer) {
      window.clearTimeout(this.activityTimer);
    }
    if (this.checkInterval) {
      window.clearInterval(this.checkInterval);
    }

    // 오프라인 상태로 변경
    if (this.currentUserId) {
      this.updateStatus('offline');
    }
  }
}

// Singleton instance
export const presencePlugin = new PresencePlugin();
export default PresencePlugin;
