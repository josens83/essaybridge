/**
 * Validation Utilities
 * Common validation functions for forms and inputs
 */

/**
 * Email validation (RFC 5322 simplified)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password strength validation
 * Returns object with strength level and feedback
 */
export interface PasswordStrength {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  feedback: string[];
}

export function validatePassword(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    feedback.push('최소 8자 이상이어야 합니다');
  } else {
    score++;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('대문자를 포함해야 합니다');
  } else {
    score++;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('소문자를 포함해야 합니다');
  } else {
    score++;
  }

  // Number check
  if (!/\d/.test(password)) {
    feedback.push('숫자를 포함해야 합니다');
  } else {
    score++;
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('특수문자를 포함해야 합니다');
  } else {
    score++;
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return {
    isValid: score >= 4,
    strength,
    feedback,
  };
}

/**
 * Korean phone number validation
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');

  // Korean phone numbers: 010-XXXX-XXXX or 02-XXX-XXXX, etc.
  const phoneRegex = /^(01[016789]|02|0[3-9]{1}[0-9]{1})\d{3,4}\d{4}$/;

  return phoneRegex.test(cleaned);
}

/**
 * Korean resident registration number validation (simplified)
 * Note: Use with caution for privacy reasons
 */
export function isValidResidentNumber(rrn: string): boolean {
  const cleaned = rrn.replace(/\D/g, '');

  if (cleaned.length !== 13) return false;

  // Basic format check only (actual validation is complex)
  const month = parseInt(cleaned.substring(2, 4));
  const day = parseInt(cleaned.substring(4, 6));

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  return true;
}

/**
 * File type validation
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  return allowedTypes.includes(fileExtension);
}

/**
 * File size validation
 */
export function isValidFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes;
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string contains only Korean characters
 */
export function isKorean(text: string): boolean {
  const koreanRegex = /^[가-힣\s]+$/;
  return koreanRegex.test(text);
}

/**
 * Check if string contains only English characters
 */
export function isEnglish(text: string): boolean {
  const englishRegex = /^[a-zA-Z\s]+$/;
  return englishRegex.test(text);
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate age (must be between min and max)
 */
export function isValidAge(birthDate: Date, minAge = 14, maxAge = 100): boolean {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;

  return actualAge >= minAge && actualAge <= maxAge;
}

/**
 * Validate date range
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return endDate >= startDate;
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate username (alphanumeric, underscore, hyphen)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}
