/**
 * Essay API Service
 */

import api from '../../../api/client';
import type { Essay, EssayReview, EssayStatus, EssayType } from '../../../types';

export interface CreateEssayRequest {
  title: string;
  content: string;
  university: string;
  department: string;
  essayType: EssayType;
}

export interface UpdateEssayRequest {
  title?: string;
  content?: string;
  university?: string;
  department?: string;
  status?: EssayStatus;
}

export interface GetEssaysQuery {
  status?: EssayStatus;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  order?: 'asc' | 'desc';
}

export interface GetEssaysResponse {
  essays: Essay[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubmitEssayForReviewRequest {
  essayId: string;
  preferredExpertId?: string;
}

const essayService = {
  /**
   * Get all essays for current user
   */
  getEssays: async (query?: GetEssaysQuery): Promise<GetEssaysResponse> => {
    return api.get<GetEssaysResponse>('/essays', { params: query });
  },

  /**
   * Get essay by ID
   */
  getEssayById: async (id: string): Promise<Essay> => {
    return api.get<Essay>(`/essays/${id}`);
  },

  /**
   * Create new essay
   */
  createEssay: async (data: CreateEssayRequest): Promise<Essay> => {
    return api.post<Essay>('/essays', data);
  },

  /**
   * Update essay
   */
  updateEssay: async (id: string, data: UpdateEssayRequest): Promise<Essay> => {
    return api.patch<Essay>(`/essays/${id}`, data);
  },

  /**
   * Delete essay
   */
  deleteEssay: async (id: string): Promise<void> => {
    return api.delete<void>(`/essays/${id}`);
  },

  /**
   * Submit essay for review
   */
  submitForReview: async (data: SubmitEssayForReviewRequest): Promise<Essay> => {
    return api.post<Essay>(`/essays/${data.essayId}/submit`, {
      preferredExpertId: data.preferredExpertId,
    });
  },

  /**
   * Get essay reviews
   */
  getEssayReviews: async (essayId: string): Promise<EssayReview[]> => {
    return api.get<EssayReview[]>(`/essays/${essayId}/reviews`);
  },

  /**
   * Get specific review
   */
  getReviewById: async (essayId: string, reviewId: string): Promise<EssayReview> => {
    return api.get<EssayReview>(`/essays/${essayId}/reviews/${reviewId}`);
  },

  /**
   * Upload essay file
   */
  uploadEssayFile: async (
    file: File,
    onProgress?: (progress: { loaded: number; total?: number }) => void
  ): Promise<{ url: string; filename: string }> => {
    return api.upload('/essays/upload', file, onProgress);
  },

  /**
   * Get essay statistics
   */
  getStatistics: async (): Promise<{
    total: number;
    draft: number;
    submitted: number;
    inReview: number;
    completed: number;
  }> => {
    return api.get('/essays/statistics');
  },
};

export default essayService;
