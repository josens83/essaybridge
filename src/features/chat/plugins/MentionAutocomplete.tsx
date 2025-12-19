/**
 * MentionAutocomplete Component
 * Slack 스타일 멘션 자동완성 드롭다운
 */

import React, { useEffect, useState, useRef } from 'react';
import type { MentionUser } from './types';

interface MentionAutocompleteProps {
  suggestions: (MentionUser | { type: 'special'; name: string })[];
  onSelect: (item: MentionUser | { type: 'special'; name: string }) => void;
  position: { top: number; left: number };
  searchText: string;
}

const MentionAutocomplete: React.FC<MentionAutocompleteProps> = ({
  suggestions,
  onSelect,
  position,
  searchText,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          // 부모에서 처리
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedIndex, onSelect]);

  // 선택된 아이템 스크롤
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selectedElement = container.children[selectedIndex] as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // 검색어 변경 시 선택 인덱스 초기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [searchText]);

  if (suggestions.length === 0) return null;

  const isSpecialMention = (item: MentionUser | { type: 'special'; name: string }): item is { type: 'special'; name: string } => {
    return 'type' in item && item.type === 'special';
  };

  return (
    <div
      ref={containerRef}
      className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[240px] max-h-[280px] overflow-y-auto"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {suggestions.map((item, index) => {
        const isSpecial = isSpecialMention(item);
        const isSelected = index === selectedIndex;

        return (
          <button
            key={isSpecial ? item.name : item.id}
            onClick={() => onSelect(item)}
            className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors ${
              isSelected
                ? 'bg-primary-50 dark:bg-primary-900/30'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {/* 아바타 또는 아이콘 */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isSpecial
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  : item.isOnline
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {isSpecial ? (
                <span className="text-lg">@</span>
              ) : item.avatar ? (
                <img src={item.avatar} alt={item.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-semibold">
                  {item.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* 이름 및 정보 */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium truncate ${
                    isSelected
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {isSpecial ? `@${item.name}` : item.name}
                </span>
                {!isSpecial && item.isOnline && (
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                )}
              </div>
              {!isSpecial && item.role && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.role}</span>
              )}
              {isSpecial && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.name === 'channel' && '채널의 모든 멤버에게 알림'}
                  {item.name === 'here' && '현재 온라인인 멤버에게 알림'}
                  {item.name === 'everyone' && '모든 멤버에게 알림'}
                </span>
              )}
            </div>

            {/* 키보드 힌트 */}
            {isSelected && (
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                ↵
              </span>
            )}
          </button>
        );
      })}

      {/* 푸터 힌트 */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-4 pb-1">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>↑↓ 이동</span>
          <span>↵ 선택</span>
          <span>Esc 닫기</span>
        </div>
      </div>
    </div>
  );
};

export default MentionAutocomplete;
