/**
 * FormattingToolbar Component
 * Discord 스타일 포맷팅 툴바
 */

import React from 'react';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiCode,
} from 'react-icons/fi';
import { TbStrikethrough } from 'react-icons/tb';
import type { MarkdownFormat } from './types';

interface FormattingToolbarProps {
  onFormat: (format: MarkdownFormat) => void;
  show: boolean;
  position: { top: number; left: number };
}

const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  onFormat,
  show,
  position,
}) => {
  if (!show) return null;

  const buttons: Array<{ format: MarkdownFormat; icon: React.ReactNode; label: string; shortcut: string }> = [
    { format: 'bold', icon: <FiBold />, label: '굵게', shortcut: 'Ctrl+B' },
    { format: 'italic', icon: <FiItalic />, label: '기울임', shortcut: 'Ctrl+I' },
    { format: 'underline', icon: <FiUnderline />, label: '밑줄', shortcut: 'Ctrl+U' },
    { format: 'strikethrough', icon: <TbStrikethrough />, label: '취소선', shortcut: 'Ctrl+Shift+X' },
    { format: 'code', icon: <FiCode />, label: '코드', shortcut: 'Ctrl+E' },
  ];

  return (
    <div
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-1 flex items-center gap-1"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {buttons.map(({ format, icon, label, shortcut }) => (
        <button
          key={format}
          onClick={() => onFormat(format)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
          title={`${label} (${shortcut})`}
        >
          <span className="w-4 h-4">{icon}</span>
        </button>
      ))}

      {/* 툴바 힌트 */}
      <div className="border-l border-gray-200 dark:border-gray-700 ml-1 pl-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          텍스트 선택 후 포맷
        </span>
      </div>
    </div>
  );
};

export default FormattingToolbar;
