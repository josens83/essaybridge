/**
 * Consulting Feature Types
 * 1:1 consulting and mentoring session related types
 */

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
