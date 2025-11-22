/**
 * useQuestions Hook
 * 논술 문제 관리 React Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { questionService } from '../services';
import type {
  EssayQuestion,
  QuestionFilter,
  PaginationResult,
  SimilarQuestionQuery,
  RecommendationRequest,
  RecommendationResult,
} from '../types';

/**
 * 문제 목록 조회 훅
 */
export function useQuestions(filter?: QuestionFilter) {
  const [data, setData] = useState<PaginationResult<EssayQuestion> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = questionService.search(filter || {});
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: fetchQuestions,
  };
}

/**
 * 단일 문제 조회 훅
 */
export function useQuestion(id: string) {
  const [data, setData] = useState<EssayQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      const question = questionService.getById(id);
      setData(question || null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    question: data,
    loading,
    error,
  };
}

/**
 * 유사 문제 찾기 훅
 */
export function useSimilarQuestions(query?: SimilarQuestionQuery) {
  const [questions, setQuestions] = useState<EssayQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const findSimilar = useCallback((searchQuery: SimilarQuestionQuery) => {
    setLoading(true);
    try {
      const similar = questionService.findSimilar(searchQuery);
      setQuestions(similar);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      findSimilar(query);
    }
  }, [query, findSimilar]);

  return {
    similarQuestions: questions,
    loading,
    findSimilar,
  };
}

/**
 * 문제 추천 훅
 */
export function useRecommendedQuestions(request?: RecommendationRequest) {
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const getRecommendations = useCallback((req: RecommendationRequest) => {
    setLoading(true);
    try {
      const result = questionService.recommend(req);
      setRecommendations(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (request) {
      getRecommendations(request);
    }
  }, [request, getRecommendations]);

  return {
    recommendations,
    loading,
    getRecommendations,
  };
}
