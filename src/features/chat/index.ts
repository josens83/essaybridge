/**
 * Chat Feature Export
 */

// Pages
export { default as ChatPage } from './pages/ChatPage';

// Context & Hooks
export { ChatProvider, useChat } from './hooks/useChatContext';
export { GlobalChatProvider, useGlobalChat } from './hooks/useGlobalChat';
export { useChatNotifications } from './hooks/useChatNotifications';
export { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Components
export * from './components';

// Types
export * from './types';

// API Service
export { chatService } from './api/chat.service';
