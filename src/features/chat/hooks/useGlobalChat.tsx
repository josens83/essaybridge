/**
 * Global Chat Context
 * 앱 전역에서 채팅 unread count를 사용할 수 있게 하는 간단한 Context
 * + 플러그인 시스템 통합
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockChatRooms } from '../api/chat.mock';
import { PluginProvider } from '../contexts/PluginProvider';
import { useAuth } from '../../auth';

interface GlobalChatContextType {
  totalUnreadCount: number;
  refreshUnreadCount: () => void;
  currentRoomId: string | null;
  setCurrentRoomId: (roomId: string | null) => void;
}

const GlobalChatContext = createContext<GlobalChatContextType | undefined>(undefined);

export const GlobalChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const { user } = useAuth();

  const refreshUnreadCount = () => {
    // Mock 데이터에서 unread count 계산
    const count = mockChatRooms.reduce((sum, room) => sum + room.unreadCount, 0);
    setTotalUnreadCount(count);
  };

  const getCurrentRoomId = () => currentRoomId;

  useEffect(() => {
    refreshUnreadCount();

    // 실제로는 WebSocket이나 polling으로 주기적 업데이트
    const interval = setInterval(refreshUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    totalUnreadCount,
    refreshUnreadCount,
    currentRoomId,
    setCurrentRoomId,
  };

  // 플러그인 시스템은 로그인한 사용자에게만 활성화
  if (user) {
    return (
      <GlobalChatContext.Provider value={contextValue}>
        <PluginProvider
          currentUserId={user.id}
          getCurrentRoomId={getCurrentRoomId}
        >
          {children}
        </PluginProvider>
      </GlobalChatContext.Provider>
    );
  }

  return (
    <GlobalChatContext.Provider value={contextValue}>
      {children}
    </GlobalChatContext.Provider>
  );
};

export const useGlobalChat = (): GlobalChatContextType => {
  const context = useContext(GlobalChatContext);
  if (!context) {
    throw new Error('useGlobalChat must be used within a GlobalChatProvider');
  }
  return context;
};

export default GlobalChatContext;
