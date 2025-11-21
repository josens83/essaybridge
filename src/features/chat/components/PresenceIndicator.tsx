/**
 * PresenceIndicator Component
 * 사용자 온라인 상태 표시
 */

import React from 'react';
import type { UserStatus } from '../plugins/PresencePlugin';

interface PresenceIndicatorProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: '온라인',
      ring: 'ring-green-200 dark:ring-green-900',
    },
    away: {
      color: 'bg-yellow-500',
      label: '자리비움',
      ring: 'ring-yellow-200 dark:ring-yellow-900',
    },
    busy: {
      color: 'bg-red-500',
      label: '다른 용무 중',
      ring: 'ring-red-200 dark:ring-red-900',
    },
    offline: {
      color: 'bg-gray-400',
      label: '오프라인',
      ring: 'ring-gray-200 dark:ring-gray-700',
    },
  };

  const config = statusConfig[status];

  if (showLabel) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className={`${sizeClasses[size]} ${config.color} rounded-full ring-2 ${config.ring}`} />
        <span className="text-sm text-gray-700 dark:text-gray-300">{config.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${config.color} rounded-full ring-2 ${config.ring} ${className}`}
      title={config.label}
    />
  );
};

export default PresenceIndicator;
