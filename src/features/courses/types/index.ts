/**
 * Courses Feature Types
 * Online courses and learning materials related types
 */

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseCategory = 'general' | 'university_specific' | 'writing_basics' | 'analysis';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  category: CourseCategory;
  level: CourseLevel;
  universities: string[];
  thumbnail: string;
  price: number;
  duration: number; // in minutes
  lessons: Lesson[];
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  materials?: string[];
  order: number;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // 0-100
  completedLessons: string[];
  enrolledAt: string;
  lastAccessedAt: string;
}
