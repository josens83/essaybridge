/**
 * Dashboard Feature Types
 * Dashboard statistics and data related types
 */

import type { StudentProfile } from '../../../shared/types';
import type { ConsultingSession } from '../../consulting/types';
import type { CourseEnrollment } from '../../courses/types';

export interface StudentDashboard {
  user: StudentProfile;
  essayStats: {
    total: number;
    inReview: number;
    completed: number;
  };
  upcomingConsultations: ConsultingSession[];
  enrolledCourses: CourseEnrollment[];
  recentPosts: unknown[]; // Post type from community feature (to be created)
}

export interface ExpertStats {
  totalReviews: number;
  pendingReviews: number;
  completedThisMonth: number;
  averageRating: number;
  earnings: number;
}

export interface ConsultantStats {
  totalSessions: number;
  upcomingSessions: number;
  completedThisMonth: number;
  averageRating: number;
  earnings: number;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  essaysInReview: number;
}
