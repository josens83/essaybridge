/**
 * UserStatusSelector Component
 * 사용자 상태 선택 드롭다운
 */

import React, { useState } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { presencePlugin, type UserStatus } from '../plugins/PresencePlugin';
import PresenceIndicator from './PresenceIndicator';

interface UserStatusSelectorProps {
  currentStatus: UserStatus;
  onStatusChange?: (status: UserStatus) => void;
}

const UserStatusSelector: React.FC<UserStatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const statuses: Array<{ value: UserStatus; label: string; description: string }> = [
    { value: 'online', label: '온라인', description: '활동 중' },
    { value: 'away', label: '자리비움', description: '잠시 자리를 비웠습니다' },
    { value: 'busy', label: '다른 용무 중', description: '방해 금지' },
    { value: 'offline', label: '오프라인', description: '숨김' },
  ];

  const handleStatusChange = (status: UserStatus) => {
    presencePlugin.updateStatus(status, customMessage);
    onStatusChange?.(status);
    setIsOpen(false);
  };

  const handleCustomMessageSave = () => {
    presencePlugin.updateStatus(currentStatus, customMessage);
    setShowCustomInput(false);
  };

  const currentStatusConfig = statuses.find(s => s.value === currentStatus);

  return (
    <div className="relative">
      {/* 현재 상태 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <PresenceIndicator status={currentStatus} size="md" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentStatusConfig?.label}
        </span>
        <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 메뉴 */}
          <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
            {/* 상태 목록 */}
            <div className="px-2">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    currentStatus === status.value ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PresenceIndicator status={status.value} size="md" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {status.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {status.description}
                      </div>
                    </div>
                  </div>
                  {currentStatus === status.value && (
                    <FiCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
              ))}
            </div>

            {/* 구분선 */}
            <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

            {/* 커스텀 메시지 */}
            <div className="px-4 py-2">
              {showCustomInput ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="상태 메시지 입력..."
                    maxLength={50}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCustomMessageSave}
                      className="flex-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomMessage('');
                      }}
                      className="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {customMessage || '상태 메시지 설정...'}
                </button>
              )}
            </div>

            {/* 도움말 */}
            <div className="px-4 py-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 5분간 활동이 없으면 자동으로 자리비움 상태로 변경됩니다.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserStatusSelector;
