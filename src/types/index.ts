// User Types
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
  subscriptionPlan: SubscriptionPlan;
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

// Essay Types
export type EssayStatus = 'draft' | 'submitted' | 'in_review' | 'completed';
export type EssayType = 'general' | 'university_specific' | 'interview_prep';

export interface Essay {
  id: string;
  studentId: string;
  title: string;
  content: string;
  university: string;
  department: string;
  essayType: EssayType;
  status: EssayStatus;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  expertId?: string;
}

export interface EssayReview {
  id: string;
  essayId: string;
  expertId: string;
  expertName: string;
  comments: Comment[];
  overallFeedback: string;
  score?: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  position: number;
  length: number;
  text: string;
  type: 'grammar' | 'logic' | 'expression' | 'structure' | 'content';
}

// Course Types
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

// Community Types
export type PostCategory = 'free' | 'qna' | 'success_story' | 'university_specific' | 'study_tips';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: PostCategory;
  university?: string;
  isAnonymous: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
}

// Consulting Types
export interface ConsultingSession {
  id: string;
  studentId: string;
  consultantId: string;
  consultantName: string;
  type: 'essay_review' | 'university_selection' | 'interview_prep' | 'general';
  scheduledAt: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

// Payment Types
export type SubscriptionPlan = 'free' | 'basic' | 'premium';

export interface PricingPlan {
  id: string;
  name: SubscriptionPlan;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  essayReviewsPerMonth: number;
  consultingHoursPerMonth: number;
  courseAccess: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  type: 'subscription' | 'course' | 'essay_review' | 'consulting';
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
}

// Dashboard Types
export interface StudentDashboard {
  user: StudentProfile;
  essayStats: {
    total: number;
    inReview: number;
    completed: number;
  };
  upcomingConsultations: ConsultingSession[];
  enrolledCourses: CourseEnrollment[];
  recentPosts: Post[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'essay_review' | 'consultation' | 'course' | 'community' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
