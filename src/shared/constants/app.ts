/**
 * Application Constants
 * Common values used throughout the application
 */

export const APP_NAME = 'EssayBridge';
export const APP_DESCRIPTION = '입시 논술 전문 첨삭 및 컨설팅 플랫폼';

/**
 * User Roles
 */
export const USER_ROLES = {
  STUDENT: 'student',
  EXPERT: 'expert',
  CONSULTANT: 'consultant',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Essay Status
 */
export const ESSAY_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in_review',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export type EssayStatus = (typeof ESSAY_STATUS)[keyof typeof ESSAY_STATUS];

/**
 * Essay Status Labels (Korean)
 */
export const ESSAY_STATUS_LABELS: Record<EssayStatus, string> = {
  draft: '작성중',
  submitted: '제출됨',
  in_review: '첨삭중',
  completed: '완료',
  archived: '보관됨',
};

/**
 * Essay Status Colors
 */
export const ESSAY_STATUS_COLORS: Record<EssayStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  in_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

/**
 * Essay Types
 */
export const ESSAY_TYPES = {
  GENERAL: 'general',
  UNIVERSITY_SPECIFIC: 'university_specific',
  INTERVIEW_PREP: 'interview_prep',
} as const;

export type EssayType = (typeof ESSAY_TYPES)[keyof typeof ESSAY_TYPES];

/**
 * Essay Type Labels (Korean)
 */
export const ESSAY_TYPE_LABELS: Record<EssayType, string> = {
  general: '일반 논술',
  university_specific: '대학별 논술',
  interview_prep: '면접 대비',
};

/**
 * Payment Status
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

/**
 * Subscription Status
 */
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  PAUSED: 'paused',
} as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

/**
 * Course Levels
 */
export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export type CourseLevel = (typeof COURSE_LEVELS)[keyof typeof COURSE_LEVELS];

/**
 * Course Level Labels (Korean)
 */
export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
};

/**
 * File Upload Limits
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['.pdf', '.doc', '.docx', '.hwp', '.txt'],
  ALLOWED_IMAGE_TYPES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * API Timeouts (milliseconds)
 */
export const TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 120000, // 2 minutes
  LONG_POLL: 60000, // 1 minute
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'essaybridge_access_token',
  REFRESH_TOKEN: 'essaybridge_refresh_token',
  USER: 'essaybridge_user',
  THEME: 'essaybridge_theme',
} as const;

/**
 * Date/Time Formats
 */
export const DATE_FORMATS = {
  DISPLAY: 'YYYY년 MM월 DD일',
  DISPLAY_WITH_TIME: 'YYYY년 MM월 DD일 HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
} as const;

/**
 * Popular Korean Universities
 */
export const POPULAR_UNIVERSITIES = [
  '서울대학교',
  '연세대학교',
  '고려대학교',
  '성균관대학교',
  '한양대학교',
  '이화여자대학교',
  '중앙대학교',
  '경희대학교',
  '한국외국어대학교',
  '서울시립대학교',
  'KAIST',
  'POSTECH',
  'UNIST',
  'GIST',
  'DGIST',
] as const;

/**
 * Popular Academic Departments
 */
export const POPULAR_DEPARTMENTS = [
  '경영학과',
  '경제학과',
  '컴퓨터공학과',
  '전기전자공학과',
  '기계공학과',
  '화학공학과',
  '생명과학과',
  '의예과',
  '법학과',
  '영어영문학과',
  '심리학과',
  '사회학과',
  '정치외교학과',
  '국어국문학과',
  '수학과',
] as const;
