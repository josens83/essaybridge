/**
 * useChatNotifications Hook
 * 채팅 알림 (사운드 + 브라우저 알림) 관리
 */

import { useEffect, useRef, useCallback } from 'react';
import type { ChatMessage } from '../types';

interface NotificationOptions {
  soundEnabled?: boolean;
  browserNotificationsEnabled?: boolean;
}

export const useChatNotifications = (options: NotificationOptions = {}) => {
  const { soundEnabled = true, browserNotificationsEnabled = true } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // 오디오 요소 초기화
  useEffect(() => {
    // 간단한 알림 사운드 (Base64 인코딩된 짧은 비프음)
    const notificationSound = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJugtZZwXkJtkJyzq5d6X0NNXGqOo7K3p5N5YUk7RFpph5mrubesmYN7bWNcV1RPTEpMUVlgaXN+iZKZnp+em5WNhHxwZFZKQDpDUmZ4i5+wvL+3qZV+aVZLRkVIUWN1iJuqtrq1pp2OgXBiVEdBRU1ga3uKl6SrraefkIB0ZVdOR0VKVGJueoiTnKCfnJSJfnFiVElFRktTXGl3hI+YnJ2aj4V6b2NVSUJASFFcaXaCi5OYmpaOhHdqXVBFP0FIUl1qeIWOlJaUkIh9c2dbTkRAPkVPW2p4hY2Sk5KPiH50aFtOR0NDR1BbZ3aDi5CRkI6JgHZrXlJJQ0FES1ViaXmEi4+PjoqEfXNmWk5HQ0FES1ZhanmDio6OjIeAd2xfUklEQUNJVGBqeISKjIyKhoB4bWFVTEdEQkdRXWl4hImLi4mFf3huYlZMR0RDR1FeaniEiYqJh4N9dWleUkpGREZNWWR0gIiJiYiEfnVpXVFKRkRFSlRfbHqFiYiHhYB6cGRYT0hFREhOWGV0f4aIh4aBeXFkWE9IRERGTVdja3mDh4eGg311bGBUT0lGRUhNV2JreIOHhYSCfXVsYFVPSkdGSE1XX2t5goaEg4F8dWxgVE9KR0ZIT1hibHqDhYSDgHt0a19UT0pHR0hNV2BqeIKFg4KAfHRrYFVQSkdHSE1WX2l2gISCgX99dWxgVVBLSEdITVVeaHV/g4GAgH14b2RZU05KSElOV19oeICBgH9+eHFoXVRPS0lJS1BYYGl3foCAfn15cmhfVVBMSkpMUFhfaHR9gH5+fHlyanFnXVVRTUpLTVJYX2l1fH5+fXx5c2pjWlRPTEpLTlNaY211e318e3p4c2xmXlZRTUtLTlRaYmtzent7ent3c21nX1dSTEtKTE9UW2Rsc3l6eXl4d3NuaGFZU09MS01QU1pkbHN5eXh4eHdzbmllXlhST0xLTFFVXGVscnh4d3d3dnJtaGJcVlJOTEtOUlhfZ25zeHd2dnd1c21oY11XUk9NTE1QVWF';

    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  // 브라우저 알림 권한 요청
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  // 사운드 알림 재생
  const playNotificationSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // 자동 재생이 차단된 경우 무시
      });
    }
  }, [soundEnabled]);

  // 브라우저 알림 표시
  const showBrowserNotification = useCallback((title: string, body: string, icon?: string) => {
    if (!browserNotificationsEnabled || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'chat-notification',
      });

      // 클릭 시 창 포커스
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // 5초 후 자동 닫기
      setTimeout(() => notification.close(), 5000);
    }
  }, [browserNotificationsEnabled]);

  // 새 메시지 알림
  const notifyNewMessage = useCallback((message: ChatMessage, roomName?: string) => {
    // 같은 메시지에 대해 중복 알림 방지
    if (message.id === lastMessageIdRef.current) {
      return;
    }
    lastMessageIdRef.current = message.id;

    // 현재 탭이 포커스 상태가 아닐 때만 알림
    if (document.hidden) {
      // 사운드 알림
      playNotificationSound();

      // 브라우저 알림
      const title = roomName || message.senderName;
      let body = message.content;

      if (message.type === 'image') {
        body = '📷 이미지를 보냈습니다';
      } else if (message.type === 'file') {
        body = '📎 파일을 보냈습니다';
      }

      showBrowserNotification(title, body);
    }
  }, [playNotificationSound, showBrowserNotification]);

  return {
    requestNotificationPermission,
    playNotificationSound,
    showBrowserNotification,
    notifyNewMessage,
  };
};

export default useChatNotifications;
