/**
 * useKeyboardShortcuts Hook
 * 채팅에서 사용할 키보드 단축키 관리
 */

import { useEffect, useCallback } from 'react';
import { useChat } from './useChatContext';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const {
    selectRoom,
    rooms,
    selectedRoom,
    setSearchOpen,
    uiState,
    setReplyingTo,
    setEditingMessage,
  } = useChat();

  // 이전/다음 채팅방으로 이동
  const goToPreviousRoom = useCallback(() => {
    if (!selectedRoom || rooms.length === 0) return;
    const currentIndex = rooms.findIndex(r => r.id === selectedRoom.id);
    if (currentIndex > 0) {
      selectRoom(rooms[currentIndex - 1].id);
    }
  }, [rooms, selectedRoom, selectRoom]);

  const goToNextRoom = useCallback(() => {
    if (!selectedRoom || rooms.length === 0) return;
    const currentIndex = rooms.findIndex(r => r.id === selectedRoom.id);
    if (currentIndex < rooms.length - 1) {
      selectRoom(rooms[currentIndex + 1].id);
    }
  }, [rooms, selectedRoom, selectRoom]);

  // 검색 토글
  const toggleSearch = useCallback(() => {
    setSearchOpen(!uiState.isSearchOpen);
  }, [setSearchOpen, uiState.isSearchOpen]);

  // 현재 입력 취소 (ESC)
  const cancelCurrentAction = useCallback(() => {
    if (uiState.editingMessage) {
      setEditingMessage(null);
    } else if (uiState.replyingTo) {
      setReplyingTo(null);
    } else if (uiState.isSearchOpen) {
      setSearchOpen(false);
    }
  }, [uiState, setEditingMessage, setReplyingTo, setSearchOpen]);

  // 단축키 설정
  const shortcuts: ShortcutConfig[] = [
    {
      key: 'k',
      ctrl: true,
      action: toggleSearch,
      description: '검색 열기/닫기',
    },
    {
      key: 'ArrowUp',
      alt: true,
      action: goToPreviousRoom,
      description: '이전 채팅방으로 이동',
    },
    {
      key: 'ArrowDown',
      alt: true,
      action: goToNextRoom,
      description: '다음 채팅방으로 이동',
    },
    {
      key: 'Escape',
      action: cancelCurrentAction,
      description: '현재 작업 취소',
    },
  ];

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 입력 중인 경우 일부 단축키 무시
    const isInputActive = ['INPUT', 'TEXTAREA'].includes(
      (e.target as HTMLElement)?.tagName || ''
    );

    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey;
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = shortcut.alt ? e.altKey : !e.altKey;

      if (
        e.key === shortcut.key &&
        ctrlMatch &&
        shiftMatch &&
        altMatch
      ) {
        // ESC는 항상 동작
        if (shortcut.key === 'Escape') {
          e.preventDefault();
          shortcut.action();
          return;
        }

        // 입력 중이면 다른 단축키 무시
        if (isInputActive && shortcut.key !== 'Escape') {
          continue;
        }

        e.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts]);

  // 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    shortcuts: shortcuts.map(s => ({
      key: s.key,
      ctrl: s.ctrl,
      shift: s.shift,
      alt: s.alt,
      description: s.description,
    })),
  };
};

export default useKeyboardShortcuts;
