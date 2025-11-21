/**
 * MarkdownPlugin - Markdown 포맷팅 플러그인
 *
 * 벤치마킹: Discord의 Markdown 시스템
 *
 * 책임:
 * - Markdown 파싱 및 렌더링
 * - 포맷팅 단축키 지원
 * - 코드 블록 신택스 하이라이팅
 * - 이모지 단축키 변환
 *
 * 특징:
 * - Discord 스타일 Markdown
 * - 독립적인 모듈
 * - Feature Toggle로 제어 가능
 */

import { BasePlugin } from '../core/Plugin';
import type { PluginContext, PluginMetadata } from '../core/Plugin';
import { PluginStatus } from '../core/Plugin';
import { FeatureFlag, getFeatureToggle } from '../core/FeatureToggle';

export interface MarkdownRule {
  name: string;
  pattern: RegExp;
  replacement: (match: string, ...groups: string[]) => string;
  multiline?: boolean;
}

interface MarkdownPluginConfig {
  enableBold?: boolean;
  enableItalic?: boolean;
  enableUnderline?: boolean;
  enableStrikethrough?: boolean;
  enableCode?: boolean;
  enableCodeBlock?: boolean;
  enableQuote?: boolean;
  enableEmoji?: boolean;
  enableSpoiler?: boolean;
}

export class MarkdownPlugin extends BasePlugin {
  private config: Required<MarkdownPluginConfig> = {
    enableBold: true,
    enableItalic: true,
    enableUnderline: true,
    enableStrikethrough: true,
    enableCode: true,
    enableCodeBlock: true,
    enableQuote: true,
    enableEmoji: true,
    enableSpoiler: true,
  };

  // 이모지 단축키 맵
  private emojiMap: Record<string, string> = {
    ':smile:': '😊',
    ':laughing:': '😂',
    ':heart:': '❤️',
    ':thumbsup:': '👍',
    ':thumbsdown:': '👎',
    ':fire:': '🔥',
    ':sparkles:': '✨',
    ':star:': '⭐',
    ':clap:': '👏',
    ':tada:': '🎉',
    ':thinking:': '🤔',
    ':eyes:': '👀',
    ':100:': '💯',
    ':rocket:': '🚀',
    ':wave:': '👋',
    ':ok_hand:': '👌',
    ':pray:': '🙏',
    ':point_right:': '👉',
    ':point_left:': '👈',
    ':raised_hands:': '🙌',
  };

  constructor(config?: MarkdownPluginConfig) {
    const metadata: PluginMetadata = {
      id: 'markdown',
      name: 'Markdown Formatter',
      version: '1.0.0',
      description: 'Discord 스타일 Markdown 포맷팅',
      author: 'EssayBridge Team',
    };

    super(metadata);

    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.status = PluginStatus.ACTIVE;

    this.log.info('Initializing...');

    // Feature Toggle 확인
    const featureToggle = getFeatureToggle();
    if (!featureToggle.isEnabled(FeatureFlag.RICH_TEXT_FORMATTING)) {
      this.log.info('Feature disabled by toggle');
      this.enabled = false;
      return;
    }

    this.log.info('Initialized successfully');
  }

  async destroy(): Promise<void> {
    this.log.info('Destroying...');
    this.status = PluginStatus.DESTROYED;
    this.log.info('Destroyed');
  }

  /**
   * Markdown 규칙 정의
   */
  private getRules(): MarkdownRule[] {
    const rules: MarkdownRule[] = [];

    // 코드 블록 (가장 먼저 처리)
    if (this.config.enableCodeBlock) {
      rules.push({
        name: 'code-block',
        pattern: /```(\w+)?\n([\s\S]*?)```/g,
        replacement: (_match, lang, code) => {
          const language = lang || 'text';
          return `<pre class="bg-gray-900 text-gray-100 rounded p-3 my-2 overflow-x-auto"><code class="language-${language}">${this.escapeHtml(code)}</code></pre>`;
        },
        multiline: true,
      });
    }

    // 인라인 코드
    if (this.config.enableCode) {
      rules.push({
        name: 'inline-code',
        pattern: /`([^`]+)`/g,
        replacement: (_match, code) => {
          return `<code class="bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono">${this.escapeHtml(code)}</code>`;
        },
      });
    }

    // 스포일러
    if (this.config.enableSpoiler) {
      rules.push({
        name: 'spoiler',
        pattern: /\|\|(.*?)\|\|/g,
        replacement: (_match, text) => {
          return `<span class="spoiler bg-gray-800 dark:bg-gray-600 text-gray-800 dark:text-gray-600 hover:bg-transparent hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer select-none" title="클릭하여 보기">${text}</span>`;
        },
      });
    }

    // 굵게 (Bold)
    if (this.config.enableBold) {
      rules.push({
        name: 'bold',
        pattern: /\*\*(.+?)\*\*/g,
        replacement: (_match, text) => `<strong class="font-bold">${text}</strong>`,
      });
    }

    // 밑줄 (Underline)
    if (this.config.enableUnderline) {
      rules.push({
        name: 'underline',
        pattern: /__(.+?)__/g,
        replacement: (_match, text) => `<u class="underline">${text}</u>`,
      });
    }

    // 취소선 (Strikethrough)
    if (this.config.enableStrikethrough) {
      rules.push({
        name: 'strikethrough',
        pattern: /~~(.+?)~~/g,
        replacement: (_match, text) => `<s class="line-through text-gray-500 dark:text-gray-400">${text}</s>`,
      });
    }

    // 기울임 (Italic) - 마지막에 처리 (*, _ 모두 지원)
    if (this.config.enableItalic) {
      rules.push({
        name: 'italic-asterisk',
        pattern: /\*(?!\*)(.+?)\*/g,
        replacement: (_match, text) => `<em class="italic">${text}</em>`,
      });
      rules.push({
        name: 'italic-underscore',
        pattern: /_(?!_)(.+?)_/g,
        replacement: (_match, text) => `<em class="italic">${text}</em>`,
      });
    }

    // 인용 (Quote)
    if (this.config.enableQuote) {
      rules.push({
        name: 'quote',
        pattern: /^> (.+)$/gm,
        replacement: (_match, text) => {
          return `<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-3 py-1 text-gray-600 dark:text-gray-400 my-1">${text}</blockquote>`;
        },
        multiline: true,
      });
    }

    return rules;
  }

  /**
   * HTML 이스케이프
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char] || char);
  }

  /**
   * 이모지 단축키 변환
   */
  private convertEmojis(text: string): string {
    if (!this.config.enableEmoji) return text;

    let result = text;
    for (const [shortcut, emoji] of Object.entries(this.emojiMap)) {
      result = result.replace(new RegExp(this.escapeRegex(shortcut), 'g'), emoji);
    }
    return result;
  }

  /**
   * 정규식 문자 이스케이프
   */
  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Markdown을 HTML로 변환 (public API)
   */
  parse(text: string): string {
    if (!this.enabled) return text;

    let result = text;

    // 이모지 단축키 변환
    result = this.convertEmojis(result);

    // Markdown 규칙 적용
    const rules = this.getRules();
    for (const rule of rules) {
      result = result.replace(rule.pattern, (...args) => {
        // args는 [fullMatch, ...captureGroups, offset, string]
        const match = args[0];
        const groups = args.slice(1, -2);
        return rule.replacement(match, ...groups);
      });
    }

    return result;
  }

  /**
   * 텍스트를 Markdown으로 래핑 (public API)
   * 주어진 포맷으로 선택된 텍스트를 감싸기
   */
  wrap(text: string, format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'spoiler'): string {
    switch (format) {
      case 'bold':
        return `**${text}**`;
      case 'italic':
        return `*${text}*`;
      case 'underline':
        return `__${text}__`;
      case 'strikethrough':
        return `~~${text}~~`;
      case 'code':
        return `\`${text}\``;
      case 'spoiler':
        return `||${text}||`;
      default:
        return text;
    }
  }

  /**
   * 코드 블록 생성 (public API)
   */
  createCodeBlock(code: string, language = ''): string {
    return `\`\`\`${language}\n${code}\n\`\`\``;
  }

  /**
   * 인용 생성 (public API)
   */
  createQuote(text: string): string {
    return text
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n');
  }

  /**
   * 이모지 단축키 목록 가져오기 (public API)
   */
  getEmojiShortcuts(): Record<string, string> {
    return { ...this.emojiMap };
  }

  /**
   * 설정 변경
   */
  async configure(config: Record<string, unknown>): Promise<void> {
    const typedConfig = config as Partial<MarkdownPluginConfig>;
    this.config = { ...this.config, ...typedConfig };
    this.log.info('Configuration updated', this.config);
  }
}

export default MarkdownPlugin;
