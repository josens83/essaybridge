/**
 * Chat Utilities
 * 채팅 기능에서 사용하는 공통 유틸리티 함수들
 */

// ============ 날짜/시간 포맷 ============

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return '오늘';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '어제';
  } else {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  }
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return formatDate(dateString);
};

export const isDifferentDay = (date1: string, date2: string): boolean => {
  return new Date(date1).toDateString() !== new Date(date2).toDateString();
};

// ============ 파일 관련 ============

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// 허용된 파일 타입
export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/x-hwp',
    'text/plain',
  ],
};

// 최대 파일 크기 (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // 파일 크기 검사
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `파일 크기는 ${formatFileSize(MAX_FILE_SIZE)}를 초과할 수 없습니다.`,
    };
  }

  // 파일 타입 검사
  const allAllowedTypes = [...ALLOWED_FILE_TYPES.image, ...ALLOWED_FILE_TYPES.document];
  if (!allAllowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: '지원하지 않는 파일 형식입니다.',
    };
  }

  return { valid: true };
};

export const getFileType = (file: File): 'image' | 'document' | 'unknown' => {
  if (ALLOWED_FILE_TYPES.image.includes(file.type)) return 'image';
  if (ALLOWED_FILE_TYPES.document.includes(file.type)) return 'document';
  return 'unknown';
};

// ============ 보안 관련 ============

// HTML 엔티티 이스케이프 (XSS 방지)
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// URL 유효성 검사
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// 안전한 URL인지 검사 (javascript: 등 차단)
export const isSafeUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;

  const parsed = new URL(url);
  // javascript:, data:, vbscript: 등 차단
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  return !dangerousProtocols.includes(parsed.protocol.toLowerCase());
};

// 메시지 내용 sanitize
export const sanitizeMessage = (content: string): string => {
  // 앞뒤 공백 제거
  let sanitized = content.trim();

  // 연속 줄바꿈 제한 (최대 2개)
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  // 최대 길이 제한 (5000자)
  if (sanitized.length > 5000) {
    sanitized = sanitized.substring(0, 5000);
  }

  return sanitized;
};

// ============ URL 관련 ============

export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
  const matches = text.match(urlRegex) || [];
  // 유효하고 안전한 URL만 반환
  return matches.filter(url => isSafeUrl(url));
};

export const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// ============ 기타 유틸리티 ============

// 디바운스 함수
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};

// 쓰로틀 함수
export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// 랜덤 ID 생성 (crypto API 사용)
export const generateSecureId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // 폴백: 덜 안전하지만 기능은 동작
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
