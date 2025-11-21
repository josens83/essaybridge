/**
 * MentionAutocomplete Component
 * Slack 스타일 멘션 자동완성 드롭다운
 *
 * 벤치마킹: Slack의 멘션 자동완성 UI
 */

import React, { useEffect, useRef, useState } from 'react';
import { usePlugin } from '../contexts/PluginProvider';
import type { MentionPlugin, MentionUser } from '../plugins/MentionPlugin';
import { useFeatureToggle } from '../core/FeatureToggle';
import { FeatureFlag } from '../core/FeatureToggle';

interface MentionAutocompleteProps {
  query: string;
  roomId: string;
  onSelect: (user: MentionUser | { type: 'special'; text: string }) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

export const MentionAutocomplete: React.FC<MentionAutocompleteProps> = ({
  query,
  roomId,
  onSelect,
  onClose,
  position,
}) => {
  const plugin = usePlugin<MentionPlugin>('mentions');
  const isEnabled = useFeatureToggle(FeatureFlag.MENTION_NOTIFICATIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 사용자 제안 가져오기
  const userSuggestions = plugin?.getSuggestions(roomId, query) || [];

  // 특수 멘션 제안 가져오기 (쿼리가 비어있거나 짧을 때만)
  const specialSuggestions = query.length < 3
    ? plugin?.getSpecialMentionSuggestions() || []
    : [];

  const allSuggestions = [...userSuggestions, ...specialSuggestions];

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allSuggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < allSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : allSuggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          const selected = allSuggestions[selectedIndex];
          if (selected) {
            if ('type' in selected && selected.type !== 'user') {
              // 특수 멘션
              onSelect({ type: 'special', text: selected.text });
            } else {
              // 사용자 멘션
              onSelect(selected as MentionUser);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [allSuggestions, selectedIndex, onSelect, onClose]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // 선택된 항목이 보이도록 스크롤
  useEffect(() => {
    const selectedElement = dropdownRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isEnabled || !plugin || allSuggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      style={position ? { top: position.top, left: position.left } : undefined}
    >
      {/* 헤더 */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          멘션할 사용자 선택
        </p>
      </div>

      {/* 제안 목록 */}
      <div className="max-h-64 overflow-y-auto">
        {/* 사용자 멘션 */}
        {userSuggestions.map((user, index) => (
          <button
            key={user.id}
            data-index={index}
            onClick={() => onSelect(user)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 text-left transition-colors
              ${
                selectedIndex === index
                  ? 'bg-primary-50 dark:bg-primary-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            {/* 아바타 */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.displayName || user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {(user.displayName || user.name).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* 사용자 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.displayName || user.name}
                </p>
                {user.isOnline && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
              {user.displayName && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  @{user.name}
                </p>
              )}
            </div>
          </button>
        ))}

        {/* 특수 멘션 */}
        {specialSuggestions.length > 0 && (
          <>
            {userSuggestions.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            )}
            {specialSuggestions.map((suggestion, index) => {
              const actualIndex = userSuggestions.length + index;
              return (
                <button
                  key={suggestion.text}
                  data-index={actualIndex}
                  onClick={() => onSelect({ type: 'special', text: suggestion.text })}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 text-left transition-colors
                    ${
                      selectedIndex === actualIndex
                        ? 'bg-primary-50 dark:bg-primary-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {/* 아이콘 */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <span className="text-amber-600 dark:text-amber-400 text-lg">
                      📢
                    </span>
                  </div>

                  {/* 특수 멘션 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* 힌트 */}
      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-[10px]">
            ↑↓
          </kbd>{' '}
          이동 ·{' '}
          <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-[10px]">
            Enter
          </kbd>{' '}
          선택 ·{' '}
          <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-[10px]">
            Esc
          </kbd>{' '}
          닫기
        </p>
      </div>
    </div>
  );
};

export default React.memo(MentionAutocomplete);
