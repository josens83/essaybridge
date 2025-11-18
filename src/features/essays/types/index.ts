/**
 * Essays Feature Types
 * Essay writing, submission, and review related types
 */

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
