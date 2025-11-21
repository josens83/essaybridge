/**
 * Mention Plugin
 * Slack 스타일 멘션 시스템
 */

import type { MentionUser, Mention, MentionMatch, SpecialMention } from './types';
import { eventBus } from './EventBus';

const MENTION_REGEX = /@(\w+)/g;
const SPECIAL_MENTIONS: SpecialMention[] = ['channel', 'here', 'everyone'];

class MentionPlugin {
  private users: MentionUser[];

  constructor() {
    this.users = [];
    this.loadUsers();
  }

  /**
   * 사용자 목록 로드
   */
  private loadUsers(): void {
    // Mock users - 실제로는 API에서 가져와야 함
    this.users = [
      { id: 'student1', name: '김학생', role: '학생', isOnline: true },
      { id: 'tutor1', name: '이튜터', role: '튜터', isOnline: true },
      { id: 'expert1', name: '박전문가', role: '전문가', isOnline: false },
      { id: 'admin1', name: '최관리자', role: '관리자', isOnline: true },
    ];
  }

  /**
   * 텍스트에서 @ 감지 및 자동완성 후보 반환
   */
  detectMention(text: string, cursorPosition: number): MentionMatch | null {
    // 커서 위치 이전의 텍스트에서 마지막 @ 찾기
    const textBeforeCursor = text.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex === -1) return null;

    // @ 이후의 텍스트 (공백 전까지)
    const afterAt = textBeforeCursor.substring(lastAtIndex + 1);

    // 공백이나 특수문자가 있으면 멘션이 아님
    if (/\s/.test(afterAt)) return null;

    const searchText = afterAt.toLowerCase();

    // 특수 멘션 확인
    const matchingSpecial = SPECIAL_MENTIONS.find(s => s.startsWith(searchText));
    if (matchingSpecial) {
      return {
        type: 'special',
        special: matchingSpecial,
        matchText: searchText,
        cursorPosition: lastAtIndex,
      };
    }

    // 사용자 검색
    const matchingUser = this.users.find(u =>
      u.name.toLowerCase().includes(searchText)
    );

    if (matchingUser) {
      return {
        type: 'user',
        user: matchingUser,
        matchText: searchText,
        cursorPosition: lastAtIndex,
      };
    }

    // 검색어는 있지만 매치되는 것이 없음
    return {
      type: 'user',
      matchText: searchText,
      cursorPosition: lastAtIndex,
    };
  }

  /**
   * 자동완성 후보 목록 가져오기
   */
  getSuggestions(searchText: string): (MentionUser | { type: 'special'; name: string })[] {
    const suggestions: (MentionUser | { type: 'special'; name: string })[] = [];

    // 특수 멘션
    SPECIAL_MENTIONS.forEach(special => {
      if (special.startsWith(searchText.toLowerCase())) {
        suggestions.push({ type: 'special', name: special });
      }
    });

    // 사용자 (온라인 우선)
    const matchingUsers = this.users
      .filter(u => u.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => {
        // 온라인 상태 우선
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return a.name.localeCompare(b.name);
      });

    suggestions.push(...matchingUsers);

    return suggestions;
  }

  /**
   * 멘션 삽입
   */
  insertMention(
    text: string,
    cursorPosition: number,
    user: MentionUser | { type: 'special'; name: string }
  ): { newText: string; newCursorPosition: number } {
    // @ 위치 찾기
    const textBeforeCursor = text.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex === -1) {
      return { newText: text, newCursorPosition: cursorPosition };
    }

    const mentionText = 'type' in user ? `@${user.name}` : `@${user.name}`;
    const before = text.substring(0, lastAtIndex);
    const after = text.substring(cursorPosition);

    const newText = before + mentionText + ' ' + after;
    const newCursorPosition = lastAtIndex + mentionText.length + 1;

    // 이벤트 발행
    eventBus.emit('mention:select', { user, cursorPosition: lastAtIndex });

    return { newText, newCursorPosition };
  }

  /**
   * 텍스트에서 멘션 파싱
   */
  parseMentions(text: string): Mention[] {
    const mentions: Mention[] = [];
    let match: RegExpExecArray | null;

    const regex = new RegExp(MENTION_REGEX);

    while ((match = regex.exec(text)) !== null) {
      const userName = match[1];
      const user = this.users.find(u => u.name === userName);

      if (user || SPECIAL_MENTIONS.includes(userName as SpecialMention)) {
        mentions.push({
          id: `mention-${Date.now()}-${match.index}`,
          userId: user?.id || userName,
          userName: userName,
          displayText: match[0],
          position: {
            start: match.index,
            end: match.index + match[0].length,
          },
        });
      }
    }

    return mentions;
  }

  /**
   * 멘션을 HTML/JSX로 변환하기 위한 파트 분리
   */
  splitTextWithMentions(text: string): Array<{ type: 'text' | 'mention'; content: string; userId?: string; userName?: string }> {
    const mentions = this.parseMentions(text);

    if (mentions.length === 0) {
      return [{ type: 'text', content: text }];
    }

    const parts: Array<{ type: 'text' | 'mention'; content: string; userId?: string; userName?: string }> = [];
    let lastIndex = 0;

    mentions.forEach(mention => {
      // 멘션 이전의 텍스트
      if (mention.position.start > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, mention.position.start),
        });
      }

      // 멘션
      parts.push({
        type: 'mention',
        content: mention.displayText,
        userId: mention.userId,
        userName: mention.userName,
      });

      lastIndex = mention.position.end;
    });

    // 마지막 멘션 이후의 텍스트
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex),
      });
    }

    return parts;
  }

  /**
   * 사용자 목록 업데이트
   */
  updateUsers(users: MentionUser[]): void {
    this.users = users;
  }

  /**
   * 사용자 추가
   */
  addUser(user: MentionUser): void {
    if (!this.users.find(u => u.id === user.id)) {
      this.users.push(user);
    }
  }
}

// Singleton instance
export const mentionPlugin = new MentionPlugin();
export default MentionPlugin;
