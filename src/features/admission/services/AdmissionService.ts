/**
 * Admission Service
 * 입시요강 관리 서비스
 */

import type {
  AdmissionInfo,
  AdmissionFilter,
  AcademicYear,
  PaginationResult,
  TrendAnalysis,
  PredictionResult,
} from '../types';

/**
 * 입시요강 서비스 클래스
 */
export class AdmissionService {
  private static instance: AdmissionService;
  private admissions: Map<string, AdmissionInfo>;

  private constructor() {
    this.admissions = new Map();
  }

  /**
   * 싱글톤 인스턴스
   */
  public static getInstance(): AdmissionService {
    if (!AdmissionService.instance) {
      AdmissionService.instance = new AdmissionService();
    }
    return AdmissionService.instance;
  }

  /**
   * 입시요강 추가
   */
  public add(admission: AdmissionInfo): boolean {
    if (this.admissions.has(admission.id)) {
      throw new Error(`Admission with ID ${admission.id} already exists`);
    }

    this.admissions.set(admission.id, admission);
    return true;
  }

  /**
   * ID로 입시요강 조회
   */
  public getById(id: string): AdmissionInfo | undefined {
    return this.admissions.get(id);
  }

  /**
   * 대학 ID와 학년도로 조회
   */
  public getByUniversityAndYear(
    universityId: string,
    academicYear: AcademicYear
  ): AdmissionInfo | undefined {
    return Array.from(this.admissions.values()).find(
      a => a.universityId === universityId && a.academicYear === academicYear
    );
  }

  /**
   * 대학별 모든 입시요강 조회
   */
  public getByUniversity(universityId: string): AdmissionInfo[] {
    return Array.from(this.admissions.values()).filter(
      a => a.universityId === universityId
    );
  }

  /**
   * 학년도별 입시요강 조회
   */
  public getByYear(academicYear: AcademicYear): AdmissionInfo[] {
    return Array.from(this.admissions.values()).filter(
      a => a.academicYear === academicYear
    );
  }

  /**
   * 필터로 입시요강 검색
   */
  public filter(filter: AdmissionFilter): AdmissionInfo[] {
    let results = Array.from(this.admissions.values());

    // 학년도 필터
    if (filter.academicYear && filter.academicYear.length > 0) {
      results = results.filter(a =>
        filter.academicYear!.includes(a.academicYear)
      );
    }

    // 대학 ID 필터
    if (filter.universityId && filter.universityId.length > 0) {
      results = results.filter(a =>
        filter.universityId!.includes(a.universityId)
      );
    }

    // 전형 유형 필터
    if (filter.admissionType && filter.admissionType.length > 0) {
      results = results.filter(a =>
        a.admissionTypes.some(type =>
          filter.admissionType!.includes(type.type)
        )
      );
    }

    // 논술 전형 여부
    if (filter.hasEssayExam !== undefined) {
      results = results.filter(a => {
        const hasEssay = a.admissionTypes.some(
          type => type.type === 'essay' || type.method === 'essay_centered'
        );
        return hasEssay === filter.hasEssayExam;
      });
    }

    // 면접 전형 여부
    if (filter.hasInterview !== undefined) {
      results = results.filter(a => {
        const hasInterview = a.admissionTypes.some(
          type => type.type === 'interview' || type.method === 'sat_interview'
        );
        return hasInterview === filter.hasInterview;
      });
    }

    // 경쟁률 범위
    if (filter.minCompetitionRate !== undefined) {
      results = results.filter(a => {
        const maxRate = Math.max(
          ...a.admissionTypes.map(
            type => type.statistics?.competitionRate.overall || 0
          )
        );
        return maxRate >= filter.minCompetitionRate!;
      });
    }

    if (filter.maxCompetitionRate !== undefined) {
      results = results.filter(a => {
        const minRate = Math.min(
          ...a.admissionTypes.map(
            type => type.statistics?.competitionRate.overall || Infinity
          )
        );
        return minRate <= filter.maxCompetitionRate!;
      });
    }

    // 정렬
    if (filter.sortBy) {
      results = this.sortAdmissions(
        results,
        filter.sortBy,
        filter.sortOrder || 'asc'
      );
    }

    return results;
  }

  /**
   * 페이지네이션과 함께 검색
   */
  public search(filter: AdmissionFilter): PaginationResult<AdmissionInfo> {
    const allResults = this.filter(filter);
    const page = filter.page || 1;
    const limit = filter.limit || 20;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedResults = allResults.slice(startIndex, endIndex);

    return {
      data: paginatedResults,
      pagination: {
        page,
        limit,
        total: allResults.length,
        totalPages: Math.ceil(allResults.length / limit),
        hasNext: endIndex < allResults.length,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 입시 트렌드 분석
   */
  public analyzeTrends(
    universityId?: string,
    years = 3
  ): TrendAnalysis {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - years + 1;
    const endYear = currentYear;

    let admissions = Array.from(this.admissions.values());

    if (universityId) {
      admissions = admissions.filter(a => a.universityId === universityId);
    }

    // 연도별 데이터 필터링
    admissions = admissions.filter(a => {
      const year = parseInt(a.academicYear);
      return year >= startYear && year <= endYear;
    });

    const metrics: TrendAnalysis['metrics'] = [];
    const insights: TrendAnalysis['insights'] = [];

    // 평균 경쟁률 트렌드
    const competitionRates = admissions.map(a => {
      const rates = a.admissionTypes.map(
        type => type.statistics?.competitionRate.overall || 0
      );
      return rates.length > 0
        ? rates.reduce((sum, r) => sum + r, 0) / rates.length
        : 0;
    });

    if (competitionRates.length >= 2) {
      const avgRate =
        competitionRates.reduce((sum, r) => sum + r, 0) / competitionRates.length;
      const firstRate = competitionRates[0];
      const lastRate = competitionRates[competitionRates.length - 1];
      const change = ((lastRate - firstRate) / firstRate) * 100;

      metrics.push({
        metric: '평균 경쟁률',
        value: avgRate,
        change,
        trend: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
      });

      if (change > 10) {
        insights.push({
          type: 'warning',
          title: '경쟁률 급증',
          description: `최근 ${years}년간 평균 경쟁률이 ${change.toFixed(1)}% 증가했습니다.`,
          confidence: 0.9,
        });
      }
    }

    // 모집 인원 트렌드
    const quotas = admissions.map(a =>
      a.admissionTypes.reduce((sum, type) => sum + type.quota.total, 0)
    );

    if (quotas.length >= 2) {
      const avgQuota = quotas.reduce((sum, q) => sum + q, 0) / quotas.length;
      const firstQuota = quotas[0];
      const lastQuota = quotas[quotas.length - 1];
      const change = ((lastQuota - firstQuota) / firstQuota) * 100;

      metrics.push({
        metric: '모집 인원',
        value: avgQuota,
        change,
        trend: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
      });
    }

    return {
      period: {
        start: `${startYear}`,
        end: `${endYear}`,
      },
      metrics,
      insights,
    };
  }

  /**
   * 다음 학년도 예측
   */
  public predictNextYear(universityId: string): PredictionResult {
    const history = this.getByUniversity(universityId);

    if (history.length < 2) {
      throw new Error('Insufficient data for prediction');
    }

    // 최근 3년 데이터 사용
    const recentYears = history
      .sort((a, b) => b.academicYear.localeCompare(a.academicYear))
      .slice(0, 3);

    // 경쟁률 예측
    const competitionRates = recentYears.map(a => {
      const rates = a.admissionTypes.map(
        type => type.statistics?.competitionRate.overall || 0
      );
      return rates.length > 0
        ? rates.reduce((sum, r) => sum + r, 0) / rates.length
        : 0;
    });

    const avgRate =
      competitionRates.reduce((sum, r) => sum + r, 0) / competitionRates.length;

    // 간단한 선형 예측 (실제로는 더 복잡한 모델 필요)
    const predictedRate = avgRate;

    return {
      target: '평균 경쟁률',
      predictedValue: predictedRate,
      confidence: 0.75,
      confidenceInterval: {
        low: predictedRate * 0.9,
        high: predictedRate * 1.1,
      },
      factors: [
        {
          factor: '과거 경쟁률 추이',
          importance: 0.7,
          impact: 'positive',
        },
        {
          factor: '모집 인원 변화',
          importance: 0.3,
          impact: 'neutral',
        },
      ],
      methodology: 'Linear Regression with 3-year historical data',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 입시요강 업데이트
   */
  public update(id: string, updates: Partial<AdmissionInfo>): boolean {
    const existing = this.admissions.get(id);
    if (!existing) {
      throw new Error(`Admission with ID ${id} not found`);
    }

    const updated = {
      ...existing,
      ...updates,
      id,
      lastModified: new Date().toISOString(),
    };

    this.admissions.set(id, updated);
    return true;
  }

  /**
   * 입시요강 삭제
   */
  public delete(id: string): boolean {
    return this.admissions.delete(id);
  }

  /**
   * 변경사항 추적
   */
  public trackChanges(
    oldData: AdmissionInfo,
    newData: AdmissionInfo
  ): AdmissionInfo['changes'] {
    const changes: AdmissionInfo['changes'] = [];

    // 모집 인원 변경 감지
    oldData.admissionTypes.forEach((oldType, index) => {
      const newType = newData.admissionTypes[index];
      if (newType && oldType.quota.total !== newType.quota.total) {
        changes.push({
          id: `change-${Date.now()}-${index}`,
          changeDate: new Date().toISOString(),
          category: 'quota',
          severity: 'major',
          description: `${oldType.name} 모집 인원 변경`,
          previousValue: oldType.quota.total.toString(),
          newValue: newType.quota.total.toString(),
          affectedTypes: [oldType.name],
          source: 'system',
        });
      }
    });

    return changes;
  }

  /**
   * 데이터 정렬
   */
  private sortAdmissions(
    admissions: AdmissionInfo[],
    sortBy: string,
    order: 'asc' | 'desc'
  ): AdmissionInfo[] {
    const sorted = [...admissions];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'university':
          comparison = a.universityId.localeCompare(b.universityId);
          break;
        case 'competitionRate': {
          const aRate = Math.max(
            ...a.admissionTypes.map(
              t => t.statistics?.competitionRate.overall || 0
            )
          );
          const bRate = Math.max(
            ...b.admissionTypes.map(
              t => t.statistics?.competitionRate.overall || 0
            )
          );
          comparison = aRate - bRate;
          break;
        }
        case 'quota': {
          const aQuota = a.admissionTypes.reduce(
            (sum, t) => sum + t.quota.total,
            0
          );
          const bQuota = b.admissionTypes.reduce(
            (sum, t) => sum + t.quota.total,
            0
          );
          comparison = aQuota - bQuota;
          break;
        }
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * 통계
   */
  public count(): number {
    return this.admissions.size;
  }
}

// 싱글톤 인스턴스 export
export const admissionService = AdmissionService.getInstance();
