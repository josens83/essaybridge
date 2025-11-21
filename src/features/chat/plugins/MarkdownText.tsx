/**
 * MarkdownText Component
 * 순수 Markdown만 렌더링 (멘션 제외)
 */

import React from 'react';
import { markdownPlugin } from './MarkdownPlugin';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className = '' }) => {
  const nodes = markdownPlugin.parse(text);

  const renderNode = (node: typeof nodes[0], index: number) => {
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
      {nodes.map((node, index) => renderNode(node, index))}
    </span>
  );
};

export default MarkdownText;
