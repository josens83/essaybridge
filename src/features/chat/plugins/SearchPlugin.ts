/**
 * Search Plugin
 * Slack 스타일 고급 검색 시스템
 */

import type { ChatMessage } from '../types';

export interface SearchFilter {
  query: string;
  from?: string; // 발신자
  to?: string; // 수신자
  in?: string; // 채팅방
  has?: 'link' | 'file' | 'image' | 'mention';
  before?: Date;
  after?: Date;
  during?: Date;
}

export interface SearchResult {
  message: ChatMessage;
  matchScore: number;
  highlights: Array<{ start: number; end: number }>;
}

class SearchPlugin {
  /**
   * 고급 검색
   */
  search(messages: ChatMessage[], filter: SearchFilter): SearchResult[] {
    let results = messages;

    // 텍스트 검색
    if (filter.query) {
      results = results.filter(msg =>
        msg.content.toLowerCase().includes(filter.query.toLowerCase())
      );
    }

    // from: 필터
    if (filter.from) {
      results = results.filter(msg =>
        msg.senderName.toLowerCase().includes(filter.from!.toLowerCase())
      );
    }

    // in: 필터 (채팅방)
    if (filter.in) {
      results = results.filter(msg =>
        msg.roomId.includes(filter.in!)
      );
    }

    // has: 필터
    if (filter.has) {
      results = results.filter(msg => {
        switch (filter.has) {
          case 'link':
            return /https?:\/\//.test(msg.content);
          case 'file':
            return msg.type === 'file' && msg.attachments && msg.attachments.length > 0;
          case 'image':
            return msg.type === 'image' || (msg.attachments?.some(a => a.type === 'image'));
          case 'mention':
            return /@\w+/.test(msg.content);
          default:
            return true;
        }
      });
    }

    // before: 필터
    if (filter.before) {
      results = results.filter(msg =>
        new Date(msg.createdAt) < filter.before!
      );
    }

    // after: 필터
    if (filter.after) {
      results = results.filter(msg =>
        new Date(msg.createdAt) > filter.after!
      );
    }

    // during: 필터 (같은 날)
    if (filter.during) {
      const targetDate = filter.during;
      results = results.filter(msg => {
        const msgDate = new Date(msg.createdAt);
        return (
          msgDate.getFullYear() === targetDate.getFullYear() &&
          msgDate.getMonth() === targetDate.getMonth() &&
          msgDate.getDate() === targetDate.getDate()
        );
      });
    }

    // 검색 결과 스코어링
    return results.map(message => {
      const score = this.calculateScore(message, filter);
      const highlights = this.findHighlights(message.content, filter.query);

      return {
        message,
        matchScore: score,
        highlights,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * 검색 쿼리 파싱 (Slack 스타일)
   * 예: "hello from:john has:link after:2024-01-01"
   */
  parseQuery(queryString: string): SearchFilter {
    const filter: SearchFilter = { query: '' };
    const parts = queryString.match(/(\w+:\S+)|(\S+)/g) || [];

    const plainWords: string[] = [];

    parts.forEach(part => {
      if (part.includes(':')) {
        const [key, value] = part.split(':');

        switch (key.toLowerCase()) {
          case 'from':
            filter.from = value;
            break;
          case 'to':
            filter.to = value;
            break;
          case 'in':
            filter.in = value;
            break;
          case 'has':
            filter.has = value as 'link' | 'file' | 'image' | 'mention';
            break;
          case 'before':
            filter.before = new Date(value);
            break;
          case 'after':
            filter.after = new Date(value);
            break;
          case 'during':
            filter.during = new Date(value);
            break;
        }
      } else {
        plainWords.push(part);
      }
    });

    filter.query = plainWords.join(' ');

    return filter;
  }

  /**
   * 매치 스코어 계산
   */
  private calculateScore(message: ChatMessage, filter: SearchFilter): number {
    let score = 0;

    // 쿼리 매치
    if (filter.query) {
      const content = message.content.toLowerCase();
      const query = filter.query.toLowerCase();

      // 완전 일치
      if (content === query) {
        score += 100;
      }
      // 단어 시작 부분 매치
      else if (content.startsWith(query)) {
        score += 50;
      }
      // 포함
      else if (content.includes(query)) {
        score += 25;
      }

      // 매치 횟수
      const matches = content.split(query).length - 1;
      score += matches * 10;
    }

    // 최근 메시지에 가산점
    const age = Date.now() - new Date(message.createdAt).getTime();
    const dayInMs = 86400000;
    if (age < dayInMs) score += 20;
    else if (age < dayInMs * 7) score += 10;
    else if (age < dayInMs * 30) score += 5;

    // 핀 메시지에 가산점
    if (message.isPinned) score += 15;

    // 리액션이 많은 메시지에 가산점
    if (message.reactions) {
      const reactionCount = message.reactions.reduce((sum, r) => sum + r.count, 0);
      score += Math.min(reactionCount * 2, 20);
    }

    return score;
  }

  /**
   * 하이라이트 위치 찾기
   */
  private findHighlights(content: string, query: string): Array<{ start: number; end: number }> {
    if (!query) return [];

    const highlights: Array<{ start: number; end: number }> = [];
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();

    let index = 0;
    while ((index = lowerContent.indexOf(lowerQuery, index)) !== -1) {
      highlights.push({
        start: index,
        end: index + query.length,
      });
      index += query.length;
    }

    return highlights;
  }

  /**
   * 검색 제안
   */
  getSuggestions(messages: ChatMessage[], partialQuery: string): string[] {
    const suggestions = new Set<string>();

    // 최근 검색어 (localStorage에서)
    const recentSearches = this.getRecentSearches();
    recentSearches.forEach(s => {
      if (s.toLowerCase().includes(partialQuery.toLowerCase())) {
        suggestions.add(s);
      }
    });

    // 자주 등장하는 단어
    if (partialQuery.length > 2) {
      messages.forEach(msg => {
        const words = msg.content.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.includes(partialQuery.toLowerCase()) && word.length > 3) {
            suggestions.add(word);
          }
        });
      });
    }

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * 검색 저장
   */
  saveSearch(query: string): void {
    const searches = this.getRecentSearches();
    searches.unshift(query);

    // 중복 제거 및 최대 10개 유지
    const unique = Array.from(new Set(searches)).slice(0, 10);

    try {
      localStorage.setItem('chat_recent_searches', JSON.stringify(unique));
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  }

  /**
   * 최근 검색어 가져오기
   */
  getRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem('chat_recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      return [];
    }
  }

  /**
   * 검색어 클리어
   */
  clearRecentSearches(): void {
    try {
      localStorage.removeItem('chat_recent_searches');
    } catch (error) {
      console.error('Failed to clear searches:', error);
    }
  }
}

// Singleton instance
export const searchPlugin = new SearchPlugin();
export default SearchPlugin;
