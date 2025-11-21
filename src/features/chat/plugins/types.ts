/**
 * Chat Plugin System Types
 * 채팅 플러그인 시스템 타입 정의
 */

// ============ 멘션 관련 타입 ============

export interface MentionUser {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  isOnline?: boolean;
}

export interface Mention {
  id: string;
  userId: string;
  userName: string;
  displayText: string;
  position: {
    start: number;
    end: number;
  };
}

export interface MentionMatch {
  type: 'user' | 'special';
  user?: MentionUser;
  special?: SpecialMention;
  matchText: string;
  cursorPosition: number;
}

export type SpecialMention = 'channel' | 'here' | 'everyone';

// ============ Markdown 관련 타입 ============

export type MarkdownFormat = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'codeblock';

export interface MarkdownNode {
  type: 'text' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'codeblock' | 'mention';
  content: string;
  children?: MarkdownNode[];
  // 멘션용
  mentionUserId?: string;
  mentionUserName?: string;
}

// ============ 플러그인 이벤트 타입 ============

export type PluginEventType =
  | 'mention:select'
  | 'mention:remove'
  | 'markdown:format'
  | 'markdown:clear';

export interface PluginEvent<T = unknown> {
  type: PluginEventType;
  data: T;
  timestamp: number;
}

export interface MentionSelectEvent {
  user: MentionUser;
  cursorPosition: number;
}

export interface MarkdownFormatEvent {
  format: MarkdownFormat;
  selection: {
    start: number;
    end: number;
  };
}
