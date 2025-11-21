/**
 * Markdown Plugin
 * Discord 스타일 Markdown 파싱 엔진
 */

import type { MarkdownNode, MarkdownFormat } from './types';

class MarkdownPlugin {
  /**
   * Markdown 파싱
   * **bold** -> bold
   * *italic* -> italic
   * __underline__ -> underline
   * ~~strikethrough~~ -> strikethrough
   * `code` -> code
   * ```codeblock``` -> codeblock
   */
  parse(text: string): MarkdownNode[] {
    const nodes: MarkdownNode[] = [];
    let currentIndex = 0;

    // 정규식 패턴 (우선순위 순서)
    const patterns = [
      { type: 'codeblock' as const, regex: /```([^`]+)```/g },
      { type: 'bold' as const, regex: /\*\*([^*]+)\*\*/g },
      { type: 'underline' as const, regex: /__([^_]+)__/g },
      { type: 'strikethrough' as const, regex: /~~([^~]+)~~/g },
      { type: 'italic' as const, regex: /\*([^*]+)\*/g },
      { type: 'code' as const, regex: /`([^`]+)`/g },
    ];

    // 모든 매치 찾기
    interface Match {
      type: 'text' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'codeblock';
      content: string;
      start: number;
      end: number;
    }

    const matches: Match[] = [];

    patterns.forEach(({ type, regex }) => {
      const regexCopy = new RegExp(regex.source, regex.flags);
      let match: RegExpExecArray | null;

      while ((match = regexCopy.exec(text)) !== null) {
        // 겹치는 매치 제거 (이미 다른 타입으로 매치된 부분)
        const isOverlapping = matches.some(
          m => (match!.index >= m.start && match!.index < m.end) ||
               (match!.index + match![0].length > m.start && match!.index + match![0].length <= m.end)
        );

        if (!isOverlapping) {
          matches.push({
            type,
            content: match[1], // 캡처된 그룹 (마크다운 마커 제외)
            start: match.index,
            end: match.index + match[0].length,
          });
        }
      }
    });

    // 시작 위치로 정렬
    matches.sort((a, b) => a.start - b.start);

    // 노드 생성
    matches.forEach(match => {
      // 매치 이전의 일반 텍스트
      if (match.start > currentIndex) {
        nodes.push({
          type: 'text',
          content: text.substring(currentIndex, match.start),
        });
      }

      // 포맷된 텍스트
      nodes.push({
        type: match.type,
        content: match.content,
      });

      currentIndex = match.end;
    });

    // 마지막 일반 텍스트
    if (currentIndex < text.length) {
      nodes.push({
        type: 'text',
        content: text.substring(currentIndex),
      });
    }

    return nodes.length > 0 ? nodes : [{ type: 'text', content: text }];
  }

  /**
   * 텍스트에 포맷 적용
   */
  applyFormat(text: string, format: MarkdownFormat, start: number, end: number): string {
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    let formatted: string;

    switch (format) {
      case 'bold':
        formatted = `**${selected}**`;
        break;
      case 'italic':
        formatted = `*${selected}*`;
        break;
      case 'underline':
        formatted = `__${selected}__`;
        break;
      case 'strikethrough':
        formatted = `~~${selected}~~`;
        break;
      case 'code':
        formatted = `\`${selected}\``;
        break;
      case 'codeblock':
        formatted = `\`\`\`${selected}\`\`\``;
        break;
      default:
        formatted = selected;
    }

    return before + formatted + after;
  }

  /**
   * 선택 영역의 포맷 토글
   */
  toggleFormat(text: string, format: MarkdownFormat, start: number, end: number): {
    newText: string;
    newStart: number;
    newEnd: number
  } {
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    // 현재 선택 영역에 포맷이 적용되어 있는지 확인
    const formatMarkers: Record<MarkdownFormat, { start: string; end: string }> = {
      bold: { start: '**', end: '**' },
      italic: { start: '*', end: '*' },
      underline: { start: '__', end: '__' },
      strikethrough: { start: '~~', end: '~~' },
      code: { start: '`', end: '`' },
      codeblock: { start: '```', end: '```' },
    };

    const marker = formatMarkers[format];
    const markerLength = marker.start.length;

    // 마커 검사 (앞뒤로 충분한 길이가 있는지 확인)
    const hasMarkerBefore = start >= markerLength &&
      text.substring(start - markerLength, start) === marker.start;
    const hasMarkerAfter = end + markerLength <= text.length &&
      text.substring(end, end + markerLength) === marker.end;

    if (hasMarkerBefore && hasMarkerAfter) {
      // 포맷 제거
      const newText =
        text.substring(0, start - markerLength) +
        selected +
        text.substring(end + markerLength);

      return {
        newText,
        newStart: start - markerLength,
        newEnd: end - markerLength,
      };
    } else {
      // 포맷 적용
      const newText = before + marker.start + selected + marker.end + after;

      return {
        newText,
        newStart: start + markerLength,
        newEnd: end + markerLength,
      };
    }
  }

  /**
   * Plain text로 변환 (모든 마크다운 제거)
   */
  toPlainText(text: string): string {
    return text
      .replace(/```([^`]+)```/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1');
  }
}

// Singleton instance
export const markdownPlugin = new MarkdownPlugin();
export default MarkdownPlugin;
