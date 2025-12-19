/**
 * Global Chat Context
 * 앱 전역에서 채팅 unread count를 사용할 수 있게 하는 간단한 Context
 */
/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockChatRooms } from '../api/chat.mock';

interface GlobalChatContextType {
  totalUnreadCount: number;
  refreshUnreadCount: () => void;
}

const GlobalChatContext = createContext<GlobalChatContextType | undefined>(undefined);

export const GlobalChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const refreshUnreadCount = () => {
    // Mock 데이터에서 unread count 계산
    const count = mockChatRooms.reduce((sum, room) => sum + room.unreadCount, 0);
    setTotalUnreadCount(count);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUnreadCount();

    // 실제로는 WebSocket이나 polling으로 주기적 업데이트
    const interval = setInterval(refreshUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlobalChatContext.Provider value={{ totalUnreadCount, refreshUnreadCount }}>
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
