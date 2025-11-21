/**
 * Notification Plugin
 * 실시간 알림 시스템 (데스크톱 + 사운드)
 */

import { eventBus } from './EventBus';
import type { ChatMessage } from '../types';

export interface NotificationSettings {
  desktop: boolean;
  sound: boolean;
  email: boolean;
  mentionsOnly: boolean;
  mutedRooms: string[];
}

class NotificationPlugin {
  private settings: NotificationSettings;
  private permission: NotificationPermission;
  private audioContext: AudioContext | null;

  constructor() {
    this.settings = {
      desktop: true,
      sound: true,
      email: false,
      mentionsOnly: false,
      mutedRooms: [],
    };
    this.permission = 'default';
    this.audioContext = null;

    this.loadSettings();
    this.initializeAudio();
  }

  /**
   * 알림 권한 요청
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }

    return false;
  }

  /**
   * 메시지 알림 표시
   */
  notify(message: ChatMessage, roomName?: string): void {
    // 음소거된 방인지 확인
    if (this.settings.mutedRooms.includes(message.roomId)) {
      return;
    }

    // 멘션 전용 모드
    if (this.settings.mentionsOnly && !/@/.test(message.content)) {
      return;
    }

    // 데스크톱 알림
    if (this.settings.desktop && this.permission === 'granted') {
      this.showDesktopNotification(message, roomName);
    }

    // 사운드 알림
    if (this.settings.sound) {
      this.playNotificationSound();
    }

    // 이벤트 발행
    eventBus.emit('notification:show', {
      message,
      roomName,
      timestamp: new Date(),
    });
  }

  /**
   * 데스크톱 알림 표시
   */
  private showDesktopNotification(message: ChatMessage, roomName?: string): void {
    const title = roomName ? `${message.senderName} (${roomName})` : message.senderName;
    const body = this.getNotificationBody(message);

    const notification = new Notification(title, {
      body,
      icon: message.senderImage || '/logo.png',
      badge: '/logo.png',
      tag: message.roomId, // 같은 방의 알림은 그룹화
      requireInteraction: false,
      silent: !this.settings.sound, // 시스템 사운드 제어
    });

    // 클릭 시 처리
    notification.onclick = () => {
      window.focus();
      eventBus.emit('notification:click', {
        messageId: message.id,
        roomId: message.roomId,
      });
      notification.close();
    };

    // 자동 닫기
    setTimeout(() => notification.close(), 5000);
  }

  /**
   * 알림 본문 생성
   */
  private getNotificationBody(message: ChatMessage): string {
    if (message.type === 'image') {
      return '📷 이미지를 보냈습니다';
    }
    if (message.type === 'file') {
      return '📎 파일을 보냈습니다';
    }

    // 텍스트 메시지 (최대 100자)
    return message.content.length > 100
      ? message.content.substring(0, 100) + '...'
      : message.content;
  }

  /**
   * 알림 사운드 재생
   */
  private playNotificationSound(): void {
    // Web Audio API를 사용한 간단한 알림음
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.2
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }

  /**
   * Audio Context 초기화
   */
  private initializeAudio(): void {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  /**
   * 설정 업데이트
   */
  updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();

    eventBus.emit('notification:settings_updated', this.settings);
  }

  /**
   * 방 음소거/해제
   */
  toggleRoomMute(roomId: string): boolean {
    const index = this.settings.mutedRooms.indexOf(roomId);

    if (index > -1) {
      this.settings.mutedRooms.splice(index, 1);
      this.saveSettings();
      return false;
    } else {
      this.settings.mutedRooms.push(roomId);
      this.saveSettings();
      return true;
    }
  }

  /**
   * 방이 음소거되어 있는지 확인
   */
  isRoomMuted(roomId: string): boolean {
    return this.settings.mutedRooms.includes(roomId);
  }

  /**
   * 설정 가져오기
   */
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * 설정 저장
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('chat_notification_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  }

  /**
   * 설정 로드
   */
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('chat_notification_settings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  }

  /**
   * 테스트 알림
   */
  sendTestNotification(): void {
    const testMessage: ChatMessage = {
      id: 'test',
      roomId: 'test',
      senderId: 'system',
      senderName: 'EssayBridge',
      senderRole: 'admin',
      content: '테스트 알림입니다! 🎉',
      type: 'text',
      status: 'sent',
      isPinned: false,
      isEdited: false,
      readBy: [],
      createdAt: new Date().toISOString(),
    };

    this.notify(testMessage, '테스트');
  }
}

// Singleton instance
export const notificationPlugin = new NotificationPlugin();
export default NotificationPlugin;
