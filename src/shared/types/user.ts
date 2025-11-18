/**
 * Shared User Types
 * Base user types used across all features
 */

export type UserRole = 'student' | 'expert' | 'consultant' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
}

export interface StudentProfile extends User {
  role: 'student';
  grade: number;
  targetUniversities: string[];
  interests: string[];
  subscriptionPlan: string; // Changed to string to avoid circular dependency
}

export interface ExpertProfile extends User {
  role: 'expert';
  specialties: string[];
  universities: string[];
  rating: number;
  reviewCount: number;
}

export interface ConsultantProfile extends User {
  role: 'consultant';
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
}
