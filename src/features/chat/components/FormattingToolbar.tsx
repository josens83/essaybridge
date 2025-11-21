/**
 * FormattingToolbar Component
 * Discord 스타일 텍스트 포맷팅 툴바
 *
 * 벤치마킹: Discord의 포맷팅 툴바
 */

import React from 'react';
import { FiBold, FiItalic, FiCode, FiLink } from 'react-icons/fi';
import { MdFormatStrikethrough, MdFormatUnderlined } from 'react-icons/md';

interface FormattingToolbarProps {
  onFormat: (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'spoiler') => void;
  className?: string;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  onFormat,
  className = '',
}) => {
  const buttons = [
    {
      format: 'bold' as const,
      icon: FiBold,
      tooltip: '굵게 (Ctrl+B)',
      label: '**텍스트**',
    },
    {
      format: 'italic' as const,
      icon: FiItalic,
      tooltip: '기울임 (Ctrl+I)',
      label: '*텍스트*',
    },
    {
      format: 'underline' as const,
      icon: MdFormatUnderlined,
      tooltip: '밑줄 (Ctrl+U)',
      label: '__텍스트__',
    },
    {
      format: 'strikethrough' as const,
      icon: MdFormatStrikethrough,
      tooltip: '취소선',
      label: '~~텍스트~~',
    },
    {
      format: 'code' as const,
      icon: FiCode,
      tooltip: '코드',
      label: '`코드`',
    },
    {
      format: 'spoiler' as const,
      icon: FiLink,
      tooltip: '스포일러',
      label: '||스포일러||',
    },
  ];

  return (
    <div
      className={`flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {buttons.map((button) => {
        const Icon = button.icon;
        return (
          <button
            key={button.format}
            onClick={() => onFormat(button.format)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors group relative"
            title={button.tooltip}
            aria-label={button.tooltip}
          >
            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />

            {/* 툴팁 */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {button.tooltip}
              <div className="text-[10px] text-gray-400 mt-0.5">{button.label}</div>
            </div>
          </button>
        );
      })}

      {/* 안내 텍스트 */}
      <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
        Markdown 지원
      </div>
    </div>
  );
};

export default React.memo(FormattingToolbar);
