/**
 * MarkdownText Component
 * Markdown 포맷팅된 텍스트를 렌더링하는 컴포넌트
 *
 * 벤치마킹: Discord의 Markdown 렌더링
 */

import React, { useMemo } from 'react';
import { usePlugin } from '../contexts/PluginProvider';
import type { MarkdownPlugin } from '../plugins/MarkdownPlugin';
import { useFeatureToggle } from '../core/FeatureToggle';
import { FeatureFlag } from '../core/FeatureToggle';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className = '' }) => {
  const plugin = usePlugin<MarkdownPlugin>('markdown');
  const isEnabled = useFeatureToggle(FeatureFlag.RICH_TEXT_FORMATTING);

  // Markdown 파싱
  const html = useMemo(() => {
    if (!plugin || !isEnabled) {
      return text;
    }

    return plugin.parse(text);
  }, [text, plugin, isEnabled]);

  // Markdown이 비활성화된 경우 일반 텍스트
  if (!plugin || !isEnabled) {
    return <span className={className}>{text}</span>;
  }

  // HTML 렌더링 (dangerouslySetInnerHTML 사용)
  // 주의: plugin.parse()는 신뢰할 수 있는 HTML만 생성해야 함
  return (
    <span
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default React.memo(MarkdownText);
