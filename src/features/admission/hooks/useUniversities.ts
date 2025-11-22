/**
 * useUniversities Hook
 * 대학 데이터 관리 React Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { universityService } from '../services';
import type {
  University,
  UniversityFilter,
  UniversityStatistics,
  PaginationResult,
} from '../types';

/**
 * 대학 목록 조회 훅
 */
export function useUniversities(filter?: UniversityFilter) {
  const [data, setData] = useState<PaginationResult<Partial<University>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUniversities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = filter
        ? universityService.search(filter)
        : {
            data: universityService.getAllUniversities(),
            pagination: {
              page: 1,
              limit: 999,
              total: universityService.count(),
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
          };

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  return {
    universities: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: fetchUniversities,
  };
}

/**
 * 단일 대학 조회 훅
 */
export function useUniversity(id: string) {
  const [data, setData] = useState<Partial<University> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      const university = universityService.getById(id);
      setData(university || null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    university: data,
    loading,
    error,
  };
}

/**
 * 대학 검색 훅
 */
export function useUniversitySearch() {
  const [results, setResults] = useState<Array<{ item: Partial<University>; score: number }>>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback((query: string, limit = 10) => {
    setLoading(true);
    try {
      const searchResults = universityService.textSearch(query, limit);
      setResults(searchResults);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    loading,
    search,
    clear,
  };
}

/**
 * 대학 통계 훅
 */
export function useUniversityStatistics() {
  const [stats, setStats] = useState<UniversityStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const statistics = universityService.getStatistics();
      setStats(statistics);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    statistics: stats,
    loading,
  };
}
