/**
 * Application Route Constants
 * Centralized route definitions for type-safe navigation
 */

export const ROUTES = {
  // Public Routes
  HOME: '/',
  PRICING: '/pricing',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  CONTACT: '/contact',

  // Student Routes
  STUDENT: {
    DASHBOARD: '/student',
    ESSAYS: '/student/essays',
    ESSAY_NEW: '/student/essays/new',
    ESSAY_DETAIL: (id: string) => `/student/essays/${id}`,
    ESSAY_EDIT: (id: string) => `/student/essays/${id}/edit`,
    COURSES: '/student/courses',
    COURSE_DETAIL: (id: string) => `/student/courses/${id}`,
    CONSULTING: '/student/consulting',
    PAYMENT: '/student/payment',
    SETTINGS: '/student/settings',
  },

  // Expert Routes
  EXPERT: {
    DASHBOARD: '/expert',
    REVIEW_REQUESTS: '/expert/reviews',
    REVIEW_DETAIL: (id: string) => `/expert/reviews/${id}`,
    EARNINGS: '/expert/earnings',
    SETTINGS: '/expert/settings',
  },

  // Consultant Routes
  CONSULTANT: {
    DASHBOARD: '/consultant',
    SESSIONS: '/consultant/sessions',
    SESSION_DETAIL: (id: string) => `/consultant/sessions/${id}`,
    SCHEDULE: '/consultant/schedule',
    EARNINGS: '/consultant/earnings',
    SETTINGS: '/consultant/settings',
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    ESSAYS: '/admin/essays',
    PAYMENTS: '/admin/payments',
    SETTINGS: '/admin/settings',
  },
} as const;

/**
 * Get dashboard route based on user role
 */
export const getDashboardRoute = (role: string): string => {
  switch (role) {
    case 'student':
      return ROUTES.STUDENT.DASHBOARD;
    case 'expert':
      return ROUTES.EXPERT.DASHBOARD;
    case 'consultant':
      return ROUTES.CONSULTANT.DASHBOARD;
    case 'admin':
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};
