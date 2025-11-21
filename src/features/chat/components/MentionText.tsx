/**
 * MentionText Component
 * 텍스트에서 멘션을 파싱하고 하이라이트하는 컴포넌트
 *
 * 벤치마킹: Slack의 멘션 렌더링
 */

import React, { useMemo } from 'react';
import { usePlugin } from '../contexts/PluginProvider';
import type { MentionPlugin, Mention } from '../plugins/MentionPlugin';
import { useFeatureToggle } from '../core/FeatureToggle';
import { FeatureFlag } from '../core/FeatureToggle';

interface MentionTextProps {
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

export const MentionText: React.FC<MentionTextProps> = ({
  text,
  messageId,
  roomId,
  className = '',
}) => {
  const plugin = usePlugin<MentionPlugin>('mentions');
  const isEnabled = useFeatureToggle(FeatureFlag.MENTION_NOTIFICATIONS);

  // 텍스트를 파싱하여 세그먼트로 분리
  const segments = useMemo((): TextSegment[] => {
    if (!plugin || !isEnabled) {
      return [{ type: 'text', content: text }];
    }

    const mentions = plugin.parseMentions(text, roomId);
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
  }, [text, roomId, plugin, isEnabled]);

  // 멘션 클릭 핸들러
  const handleMentionClick = async (mention: Mention) => {
    if (!plugin) return;

    await plugin['context']?.eventBus.emit('mention:clicked', {
      userId: mention.userId || mention.type,
      messageId,
    });
  };

  // 멘션 스타일 결정
  const getMentionStyle = (mention: Mention): string => {
    const baseStyle = 'inline-flex items-center px-1.5 py-0.5 rounded font-medium cursor-pointer transition-colors';

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

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <React.Fragment key={index}>{segment.content}</React.Fragment>;
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

export default React.memo(MentionText);
