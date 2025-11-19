import { describe, it, expect } from 'vitest';
import {
  formatTime,
  formatDate,
  formatRelativeTime,
  isDifferentDay,
  formatFileSize,
  validateFile,
  getFileType,
  escapeHtml,
  isValidUrl,
  isSafeUrl,
  sanitizeMessage,
  extractUrls,
  getDomain,
  generateSecureId,
} from './index';

describe('날짜/시간 포맷 함수', () => {
  describe('formatTime', () => {
    it('시간을 올바른 형식으로 변환해야 함', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatTime(date.toISOString());
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('formatDate', () => {
    it('오늘 날짜는 "오늘"로 표시해야 함', () => {
      const today = new Date();
      const result = formatDate(today.toISOString());
      expect(result).toBe('오늘');
    });

    it('어제 날짜는 "어제"로 표시해야 함', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatDate(yesterday.toISOString());
      expect(result).toBe('어제');
    });

    it('그 외 날짜는 전체 날짜 형식으로 표시해야 함', () => {
      const oldDate = new Date('2023-01-15');
      const result = formatDate(oldDate.toISOString());
      expect(result).toContain('2023');
    });
  });

  describe('formatRelativeTime', () => {
    it('1분 미만은 "방금 전"으로 표시해야 함', () => {
      const now = new Date();
      const result = formatRelativeTime(now.toISOString());
      expect(result).toBe('방금 전');
    });

    it('1시간 미만은 "N분 전"으로 표시해야 함', () => {
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
      const result = formatRelativeTime(thirtyMinsAgo.toISOString());
      expect(result).toMatch(/\d+분 전/);
    });
  });

  describe('isDifferentDay', () => {
    it('같은 날짜는 false를 반환해야 함', () => {
      const date1 = '2024-01-15T10:00:00';
      const date2 = '2024-01-15T20:00:00';
      expect(isDifferentDay(date1, date2)).toBe(false);
    });

    it('다른 날짜는 true를 반환해야 함', () => {
      const date1 = '2024-01-15T10:00:00';
      const date2 = '2024-01-16T10:00:00';
      expect(isDifferentDay(date1, date2)).toBe(true);
    });
  });
});

describe('파일 관련 함수', () => {
  describe('formatFileSize', () => {
    it('바이트를 올바르게 포맷해야 함', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });

  describe('validateFile', () => {
    it('유효한 이미지 파일은 통과해야 함', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    it('크기가 너무 큰 파일은 실패해야 함', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }); // 11MB
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('크기');
    });

    it('허용되지 않은 파일 타입은 실패해야 함', () => {
      const file = new File([''], 'test.exe', { type: 'application/x-msdownload' });
      Object.defineProperty(file, 'size', { value: 1024 });
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('지원하지 않는');
    });
  });

  describe('getFileType', () => {
    it('이미지 타입을 올바르게 반환해야 함', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      expect(getFileType(file)).toBe('image');
    });

    it('문서 타입을 올바르게 반환해야 함', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      expect(getFileType(file)).toBe('document');
    });

    it('알 수 없는 타입은 "unknown"을 반환해야 함', () => {
      const file = new File([''], 'test.xyz', { type: 'application/unknown' });
      expect(getFileType(file)).toBe('unknown');
    });
  });
});

describe('보안 관련 함수', () => {
  describe('escapeHtml', () => {
    it('HTML 특수문자를 이스케이프해야 함', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
      expect(escapeHtml("'test'")).toBe('&#039;test&#039;');
      expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('일반 텍스트는 변경하지 않아야 함', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('isValidUrl', () => {
    it('유효한 URL은 true를 반환해야 함', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://test.com/path')).toBe(true);
    });

    it('유효하지 않은 URL은 false를 반환해야 함', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://test.com')).toBe(false);
    });
  });

  describe('isSafeUrl', () => {
    it('안전한 URL은 true를 반환해야 함', () => {
      expect(isSafeUrl('https://example.com')).toBe(true);
    });

    it('위험한 프로토콜은 false를 반환해야 함', () => {
      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    });
  });

  describe('sanitizeMessage', () => {
    it('앞뒤 공백을 제거해야 함', () => {
      expect(sanitizeMessage('  hello  ')).toBe('hello');
    });

    it('연속 줄바꿈을 제한해야 함', () => {
      expect(sanitizeMessage('a\n\n\n\nb')).toBe('a\n\nb');
    });

    it('최대 길이를 제한해야 함', () => {
      const longMessage = 'a'.repeat(6000);
      const result = sanitizeMessage(longMessage);
      expect(result.length).toBe(5000);
    });
  });
});

describe('URL 관련 함수', () => {
  describe('extractUrls', () => {
    it('텍스트에서 URL을 추출해야 함', () => {
      const text = 'Check out https://example.com and http://test.com';
      const urls = extractUrls(text);
      expect(urls).toHaveLength(2);
      expect(urls).toContain('https://example.com');
      expect(urls).toContain('http://test.com');
    });

    it('URL이 없는 텍스트는 빈 배열을 반환해야 함', () => {
      expect(extractUrls('No URLs here')).toEqual([]);
    });

    it('위험한 URL은 제외해야 함', () => {
      const text = 'Bad: javascript:alert(1) Good: https://safe.com';
      const urls = extractUrls(text);
      expect(urls).toHaveLength(1);
      expect(urls[0]).toBe('https://safe.com');
    });
  });

  describe('getDomain', () => {
    it('URL에서 도메인을 추출해야 함', () => {
      expect(getDomain('https://www.example.com/path')).toBe('example.com');
      expect(getDomain('https://subdomain.test.com')).toBe('subdomain.test.com');
    });

    it('유효하지 않은 URL은 원본을 반환해야 함', () => {
      expect(getDomain('not-a-url')).toBe('not-a-url');
    });
  });
});

describe('기타 유틸리티', () => {
  describe('generateSecureId', () => {
    it('유니크한 ID를 생성해야 함', () => {
      const id1 = generateSecureId();
      const id2 = generateSecureId();
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
    });
  });
});
