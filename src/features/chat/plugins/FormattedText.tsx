/**
 * FormattedText Component
 * 멘션 + Markdown 통합 렌더링
 */

import React from 'react';
import { mentionPlugin } from './MentionPlugin';
import { markdownPlugin } from './MarkdownPlugin';
import { eventBus } from './EventBus';

interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  // 1. 먼저 멘션으로 텍스트 분리
  const mentionParts = mentionPlugin.splitTextWithMentions(text);

  const handleMentionClick = (userId: string, userName: string) => {
    eventBus.emit('mention:click', { userId, userName });
  };

  // 2. 각 파트를 Markdown으로 파싱하여 렌더링
  const renderPart = (part: typeof mentionParts[0], index: number) => {
    if (part.type === 'mention') {
      const isSpecial = ['channel', 'here', 'everyone'].includes(part.userName || '');

      return (
        <button
          key={index}
          onClick={() => handleMentionClick(part.userId || '', part.userName || '')}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium transition-colors ${
            isSpecial
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
          }`}
          title={`${part.userName} 프로필 보기`}
        >
          <span>@</span>
          <span>{part.userName}</span>
        </button>
      );
    }

    // 일반 텍스트는 Markdown 파싱
    const nodes = markdownPlugin.parse(part.content);

    return (
      <span key={index}>
        {nodes.map((node, nodeIndex) => renderMarkdownNode(node, nodeIndex))}
      </span>
    );
  };

  // 3. Markdown 노드 렌더링
  const renderMarkdownNode = (node: ReturnType<typeof markdownPlugin.parse>[0], index: number) => {
    switch (node.type) {
      case 'bold':
        return <strong key={index} className="font-bold">{node.content}</strong>;
      case 'italic':
        return <em key={index} className="italic">{node.content}</em>;
      case 'underline':
        return <u key={index}>{node.content}</u>;
      case 'strikethrough':
        return <s key={index} className="line-through">{node.content}</s>;
      case 'code':
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-sm font-mono"
          >
            {node.content}
          </code>
        );
      case 'codeblock':
        return (
          <pre
            key={index}
            className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto"
          >
            <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
              {node.content}
            </code>
          </pre>
        );
      case 'text':
      default:
        return <span key={index}>{node.content}</span>;
    }
  };

  return (
    <span className={className}>
      {mentionParts.map((part, index) => renderPart(part, index))}
    </span>
  );
};

export default FormattedText;
