/**
 * Formatting Utilities
 * Common formatting functions for display
 */

/**
 * Format number as Korean Won currency
 */
export function formatCurrency(amount: number): string {
  if (amount === 0) return '무료';
  return `₩${amount.toLocaleString('ko-KR')}`;
}

/**
 * Format date to Korean format
 */
export function formatDate(date: string | Date, includeTime = false): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '-';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  if (!includeTime) {
    return `${year}년 ${month}월 ${day}일`;
  }

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

/**
 * Format relative time (e.g., "2시간 전", "3일 전")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 30) return `${days}일 전`;
  if (months < 12) return `${months}개월 전`;
  return `${years}년 전`;
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format duration in minutes to human-readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${remainingMinutes}분`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format phone number (Korean format)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  return phone;
}

/**
 * Format credit card number (with masking)
 */
export function formatCardNumber(cardNumber: string, masked = true): string {
  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length !== 16) return cardNumber;

  if (masked) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-****-****-$4');
  }

  return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * Format name with privacy masking
 */
export function maskName(name: string): string {
  if (name.length <= 2) {
    return name.charAt(0) + '*';
  }

  const first = name.charAt(0);
  const last = name.charAt(name.length - 1);
  const middle = '*'.repeat(name.length - 2);

  return first + middle + last;
}

/**
 * Format email with privacy masking
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');

  if (!domain) return email;

  const visibleChars = Math.min(3, Math.floor(localPart.length / 2));
  const masked = localPart.substring(0, visibleChars) + '***';

  return `${masked}@${domain}`;
}
