/**
 * University Service
 * 대학 정보 관리 서비스
 */

import type {
  University,
  UniversityFilter,
  UniversityStatistics,
  UniversityTier,
  Region,
  PaginationResult,
  SearchResult,
} from '../types';
import {
  ALL_UNIVERSITIES,
  getUniversityById,
  getUniversityByCode,
  getUniversitiesByTier,
  getUniversitiesByRegion,
  normalizeUniversityName,
  hasEssayExam,
} from '../constants/universities';

/**
 * 대학 서비스 클래스
 */
export class UniversityService {
  private static instance: UniversityService;
  private universities: Map<string, Partial<University>>;

  private constructor() {
    this.universities = new Map();
    this.initializeUniversities();
  }

  /**
   * 싱글톤 인스턴스 가져오기
   */
  public static getInstance(): UniversityService {
    if (!UniversityService.instance) {
      UniversityService.instance = new UniversityService();
    }
    return UniversityService.instance;
  }

  /**
   * 대학 데이터 초기화
   */
  private initializeUniversities(): void {
    ALL_UNIVERSITIES.forEach(university => {
      if (university.id) {
        this.universities.set(university.id, university);
      }
    });
  }

  /**
   * 모든 대학 목록 가져오기
   */
  public getAllUniversities(): Partial<University>[] {
    return Array.from(this.universities.values());
  }

  /**
   * ID로 대학 조회
   */
  public getById(id: string): Partial<University> | undefined {
    return getUniversityById(id);
  }

  /**
   * 코드로 대학 조회
   */
  public getByCode(code: string): Partial<University> | undefined {
    return getUniversityByCode(code);
  }

  /**
   * 이름으로 대학 조회 (정규화 지원)
   */
  public getByName(name: string): Partial<University> | undefined {
    const normalizedId = normalizeUniversityName(name);
    if (normalizedId) {
      return this.getById(normalizedId);
    }

    // 정확한 이름으로 검색
    return this.getAllUniversities().find(
      u => u.name === name || u.nameEng === name
    );
  }

  /**
   * 필터로 대학 검색
   */
  public filter(filter: UniversityFilter): Partial<University>[] {
    let results = this.getAllUniversities();

    // Tier 필터
    if (filter.tier && filter.tier.length > 0) {
      results = results.filter(u => u.tier && filter.tier!.includes(u.tier));
    }

    // Type 필터
    if (filter.type && filter.type.length > 0) {
      results = results.filter(u => u.type && filter.type!.includes(u.type));
    }

    // Region 필터
    if (filter.region && filter.region.length > 0) {
      results = results.filter(u => u.region && filter.region!.includes(u.region));
    }

    // 논술 전형 여부
    if (filter.hasEssayExam !== undefined) {
      results = results.filter(u => {
        if (!u.id) return false;
        return hasEssayExam(u.id) === filter.hasEssayExam;
      });
    }

    // 키워드 검색
    if (filter.keywords && filter.keywords.length > 0) {
      results = results.filter(u => {
        const searchText = `${u.name} ${u.nameEng} ${u.aliases?.join(' ')}`.toLowerCase();
        return filter.keywords!.some(keyword =>
          searchText.includes(keyword.toLowerCase())
        );
      });
    }

    // 정렬
    if (filter.sortBy) {
      results = this.sortUniversities(results, filter.sortBy, filter.sortOrder || 'asc');
    }

    return results;
  }

  /**
   * 페이지네이션과 함께 대학 검색
   */
  public search(filter: UniversityFilter): PaginationResult<Partial<University>> {
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
   * 티어별 대학 목록
   */
  public getByTier(tier: UniversityTier): Partial<University>[] {
    return getUniversitiesByTier(tier);
  }

  /**
   * 지역별 대학 목록
   */
  public getByRegion(region: Region): Partial<University>[] {
    return getUniversitiesByRegion(region);
  }

  /**
   * 대학 통계 생성
   */
  public getStatistics(): UniversityStatistics {
    const all = this.getAllUniversities();

    const byTier: Record<UniversityTier, number> = {
      SKY: 0,
      top15: 0,
      in_seoul: 0,
      regional_flagship: 0,
      regional: 0,
      specialized: 0,
    };

    const byType: Record<string, number> = {
      national: 0,
      public: 0,
      private: 0,
      specialized: 0,
    };

    const byRegion: Record<Region, number> = {
      seoul: 0,
      gyeonggi: 0,
      incheon: 0,
      busan: 0,
      daegu: 0,
      daejeon: 0,
      gwangju: 0,
      ulsan: 0,
      sejong: 0,
      gangwon: 0,
      chungbuk: 0,
      chungnam: 0,
      jeonbuk: 0,
      jeonnam: 0,
      gyeongbuk: 0,
      gyeongnam: 0,
      jeju: 0,
    };

    let withEssayExam = 0;

    all.forEach(u => {
      if (u.tier) byTier[u.tier]++;
      if (u.type) byType[u.type as string]++;
      if (u.region) byRegion[u.region]++;
      if (u.id && hasEssayExam(u.id)) withEssayExam++;
    });

    return {
      totalUniversities: all.length,
      byTier,
      byType: byType as any,
      byRegion,
      withEssayExam,
      averageStudents: 0, // TODO: 실제 데이터로 계산
      averageReputation: 0, // TODO: 실제 데이터로 계산
      updatedToday: 0,
      updatedThisWeek: 0,
      updatedThisMonth: 0,
      needsUpdate: 0,
    };
  }

  /**
   * 대학 검색 (텍스트 검색)
   */
  public textSearch(query: string, limit = 10): SearchResult<Partial<University>>[] {
    const normalizedQuery = query.toLowerCase();
    const results: SearchResult<Partial<University>>[] = [];

    this.getAllUniversities().forEach(university => {
      const score = this.calculateSearchScore(university, normalizedQuery);
      if (score > 0) {
        results.push({
          item: university,
          score,
          highlights: this.getHighlights(university, query),
        });
      }
    });

    // 점수순 정렬
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  /**
   * 유사 대학 찾기
   */
  public findSimilar(universityId: string, limit = 5): Partial<University>[] {
    const target = this.getById(universityId);
    if (!target) return [];

    const similar = this.getAllUniversities()
      .filter(u => u.id !== universityId)
      .map(u => ({
        university: u,
        score: this.calculateSimilarityScore(target, u),
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.university);

    return similar;
  }

  /**
   * 대학 정렬
   */
  private sortUniversities(
    universities: Partial<University>[],
    sortBy: string,
    order: 'asc' | 'desc'
  ): Partial<University>[] {
    const sorted = [...universities];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'students':
          comparison = (a.totalStudents || 0) - (b.totalStudents || 0);
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * 검색 점수 계산
   */
  private calculateSearchScore(university: Partial<University>, query: string): number {
    let score = 0;

    // 정확한 이름 매칭
    if (university.name?.toLowerCase() === query) score += 100;
    if (university.nameEng?.toLowerCase() === query) score += 100;
    if (university.code?.toLowerCase() === query) score += 100;

    // 부분 매칭
    if (university.name?.toLowerCase().includes(query)) score += 50;
    if (university.nameEng?.toLowerCase().includes(query)) score += 40;
    if (university.aliases?.some(a => a.toLowerCase().includes(query))) score += 60;

    // 시작 매칭
    if (university.name?.toLowerCase().startsWith(query)) score += 30;
    if (university.nameEng?.toLowerCase().startsWith(query)) score += 25;

    return score;
  }

  /**
   * 하이라이트 생성
   */
  private getHighlights(
    university: Partial<University>,
    query: string
  ): { field: string; snippet: string }[] {
    const highlights: { field: string; snippet: string }[] = [];

    if (university.name?.toLowerCase().includes(query.toLowerCase())) {
      highlights.push({ field: 'name', snippet: university.name });
    }

    if (university.nameEng?.toLowerCase().includes(query.toLowerCase())) {
      highlights.push({ field: 'nameEng', snippet: university.nameEng });
    }

    return highlights;
  }

  /**
   * 유사도 점수 계산
   */
  private calculateSimilarityScore(
    a: Partial<University>,
    b: Partial<University>
  ): number {
    let score = 0;

    // 같은 티어
    if (a.tier === b.tier) score += 40;

    // 같은 지역
    if (a.region === b.region) score += 30;

    // 같은 유형
    if (a.type === b.type) score += 20;

    // 비슷한 규모
    if (a.totalStudents && b.totalStudents) {
      const diff = Math.abs(a.totalStudents - b.totalStudents);
      const avgSize = (a.totalStudents + b.totalStudents) / 2;
      const similarity = 1 - diff / avgSize;
      score += similarity * 10;
    }

    return score;
  }

  /**
   * 대학 추가 (관리자 기능)
   */
  public add(university: Partial<University>): boolean {
    if (!university.id) {
      throw new Error('University ID is required');
    }

    if (this.universities.has(university.id)) {
      throw new Error(`University with ID ${university.id} already exists`);
    }

    this.universities.set(university.id, university);
    return true;
  }

  /**
   * 대학 업데이트 (관리자 기능)
   */
  public update(id: string, updates: Partial<University>): boolean {
    const existing = this.universities.get(id);
    if (!existing) {
      throw new Error(`University with ID ${id} not found`);
    }

    const updated = { ...existing, ...updates, id };
    this.universities.set(id, updated);
    return true;
  }

  /**
   * 대학 삭제 (관리자 기능)
   */
  public delete(id: string): boolean {
    return this.universities.delete(id);
  }

  /**
   * 대학 존재 여부 확인
   */
  public exists(id: string): boolean {
    return this.universities.has(id);
  }

  /**
   * 총 대학 수
   */
  public count(): number {
    return this.universities.size;
  }
}

// 싱글톤 인스턴스 export
export const universityService = UniversityService.getInstance();
