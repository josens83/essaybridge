/**
 * FormattedText Component
 * 멘션과 Markdown을 모두 처리하는 통합 텍스트 렌더링 컴포넌트
 *
 * 처리 순서:
 * 1. 멘션 감지 및 파싱
 * 2. Markdown 포맷팅 적용
 */

import React, { useMemo } from 'react';
import { usePlugin } from '../contexts/PluginProvider';
import type { MentionPlugin, Mention } from '../plugins/MentionPlugin';
import type { MarkdownPlugin } from '../plugins/MarkdownPlugin';
import { useFeatureToggle } from '../core/FeatureToggle';
import { FeatureFlag } from '../core/FeatureToggle';

interface FormattedTextProps {
  text: string;
  messageId: string;
  roomId: string;
  className?: string;
}

interface TextSegment {
  type: 'text' | 'mention';
  content: string;
  mention?: Mention;
}

export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  messageId,
  roomId,
  className = '',
}) => {
  const mentionPlugin = usePlugin<MentionPlugin>('mentions');
  const markdownPlugin = usePlugin<MarkdownPlugin>('markdown');
  const mentionEnabled = useFeatureToggle(FeatureFlag.MENTION_NOTIFICATIONS);
  const markdownEnabled = useFeatureToggle(FeatureFlag.RICH_TEXT_FORMATTING);

  // 텍스트를 파싱하여 세그먼트로 분리
  const segments = useMemo((): TextSegment[] => {
    // 멘션 비활성화 시 전체를 하나의 텍스트로 처리
    if (!mentionPlugin || !mentionEnabled) {
      return [{ type: 'text', content: text }];
    }

    const mentions = mentionPlugin.parseMentions(text, roomId);
    if (mentions.length === 0) {
      return [{ type: 'text', content: text }];
    }

    const result: TextSegment[] = [];
    let lastIndex = 0;

    // 멘션 정렬 (startIndex 순)
    const sortedMentions = [...mentions].sort((a, b) => a.startIndex - b.startIndex);

    for (const mention of sortedMentions) {
      // 멘션 이전의 일반 텍스트
      if (mention.startIndex > lastIndex) {
        result.push({
          type: 'text',
          content: text.slice(lastIndex, mention.startIndex),
        });
      }

      // 멘션
      result.push({
        type: 'mention',
        content: mention.displayText,
        mention,
      });

      lastIndex = mention.endIndex;
    }

    // 마지막 멘션 이후의 일반 텍스트
    if (lastIndex < text.length) {
      result.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return result;
  }, [text, roomId, mentionPlugin, mentionEnabled]);

  // 멘션 클릭 핸들러
  const handleMentionClick = async (mention: Mention) => {
    if (!mentionPlugin) return;

    await mentionPlugin['context']?.eventBus.emit('mention:clicked', {
      userId: mention.userId || mention.type,
      messageId,
    });
  };

  // 멘션 스타일 결정
  const getMentionStyle = (mention: Mention): string => {
    const baseStyle =
      'inline-flex items-center px-1.5 py-0.5 rounded font-medium cursor-pointer transition-colors';

    switch (mention.type) {
      case 'user':
        return `${baseStyle} bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50`;
      case 'channel':
      case 'here':
      case 'everyone':
        return `${baseStyle} bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50`;
      default:
        return baseStyle;
    }
  };

  // Markdown 파싱 (텍스트 세그먼트에만 적용)
  const parseMarkdown = (content: string): string => {
    if (!markdownPlugin || !markdownEnabled) {
      return content;
    }
    return markdownPlugin.parse(content);
  };

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          // 일반 텍스트: Markdown 파싱 적용
          const html = parseMarkdown(segment.content);
          return (
            <span
              key={index}
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        // 멘션 렌더링
        if (segment.mention) {
          return (
            <span
              key={index}
              className={getMentionStyle(segment.mention)}
              onClick={() => handleMentionClick(segment.mention!)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMentionClick(segment.mention!);
                }
              }}
              title={
                segment.mention.type === 'user'
                  ? `${segment.mention.displayText} 프로필 보기`
                  : segment.mention.displayText
              }
            >
              {segment.content}
            </span>
          );
        }

        return null;
      })}
    </span>
  );
};

export default React.memo(FormattedText);
