/**
 * Question Service
 * 논술 기출문제 관리 서비스
 */

import type {
  EssayQuestion,
  QuestionFilter,
  SimilarQuestionQuery,
  QuestionAnalysisResult,
  DifficultyLevel,
  BloomLevel,
  PaginationResult,
  RecommendationRequest,
  RecommendationResult,
} from '../types';

/**
 * 논술 문제 서비스 클래스
 */
export class QuestionService {
  private static instance: QuestionService;
  private questions: Map<string, EssayQuestion>;

  private constructor() {
    this.questions = new Map();
  }

  /**
   * 싱글톤 인스턴스
   */
  public static getInstance(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService();
    }
    return QuestionService.instance;
  }

  /**
   * 문제 추가
   */
  public add(question: EssayQuestion): boolean {
    if (this.questions.has(question.id)) {
      throw new Error(`Question with ID ${question.id} already exists`);
    }

    this.questions.set(question.id, question);
    return true;
  }

  /**
   * ID로 문제 조회
   */
  public getById(id: string): EssayQuestion | undefined {
    return this.questions.get(id);
  }

  /**
   * 대학별 문제 조회
   */
  public getByUniversity(universityId: string): EssayQuestion[] {
    return Array.from(this.questions.values()).filter(
      q => q.universityId === universityId
    );
  }

  /**
   * 학년도별 문제 조회
   */
  public getByYear(academicYear: string): EssayQuestion[] {
    return Array.from(this.questions.values()).filter(
      q => q.academicYear === academicYear
    );
  }

  /**
   * 필터로 문제 검색
   */
  public filter(filter: QuestionFilter): EssayQuestion[] {
    let results = Array.from(this.questions.values());

    // 대학 ID 필터
    if (filter.universityId && filter.universityId.length > 0) {
      results = results.filter(q =>
        filter.universityId!.includes(q.universityId)
      );
    }

    // 학과 ID 필터
    if (filter.departmentId && filter.departmentId.length > 0) {
      results = results.filter(
        q => q.departmentId && filter.departmentId!.includes(q.departmentId)
      );
    }

    // 카테고리 필터
    if (filter.category && filter.category.length > 0) {
      results = results.filter(q => filter.category!.includes(q.category));
    }

    // 학년도 필터
    if (filter.academicYear && filter.academicYear.length > 0) {
      results = results.filter(q =>
        filter.academicYear!.includes(q.academicYear)
      );
    }

    // 난이도 필터
    if (filter.difficulty && filter.difficulty.length > 0) {
      results = results.filter(q =>
        filter.difficulty!.includes(q.difficulty as DifficultyLevel)
      );
    }

    if (filter.minDifficulty !== undefined || filter.maxDifficulty !== undefined) {
      const difficultyMap: Record<DifficultyLevel, number> = {
        very_easy: 1,
        easy: 2,
        medium: 3,
        hard: 4,
        very_hard: 5,
      };

      results = results.filter(q => {
        const level = difficultyMap[q.difficulty];
        if (filter.minDifficulty !== undefined && level < filter.minDifficulty)
          return false;
        if (filter.maxDifficulty !== undefined && level > filter.maxDifficulty)
          return false;
        return true;
      });
    }

    // 문제 유형 필터
    if (filter.questionTypes && filter.questionTypes.length > 0) {
      results = results.filter(q =>
        q.analysis.types.some(t =>
          filter.questionTypes!.includes(t.type)
        )
      );
    }

    // 과제 유형 필터
    if (filter.tasks && filter.tasks.length > 0) {
      results = results.filter(q =>
        q.content.subQuestions.some(sq =>
          filter.tasks!.includes(sq.task)
        )
      );
    }

    // 주제 필터
    if (filter.topics && filter.topics.length > 0) {
      results = results.filter(q =>
        q.analysis.topics.some(t =>
          filter.topics!.some(ft =>
            t.topic.toLowerCase().includes(ft.toLowerCase())
          )
        )
      );
    }

    // 키워드 필터
    if (filter.keywords && filter.keywords.length > 0) {
      results = results.filter(q =>
        filter.keywords!.some(keyword =>
          q.keywords.some(k =>
            k.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      );
    }

    // Bloom 수준 필터
    if (filter.bloomLevels && filter.bloomLevels.length > 0) {
      results = results.filter(q =>
        q.analysis.bloomLevel.some(b =>
          filter.bloomLevels!.includes(b as BloomLevel)
        )
      );
    }

    // 시간 제한 필터
    if (filter.maxTimeLimit !== undefined) {
      results = results.filter(
        q => q.content.constraints.timeLimit <= filter.maxTimeLimit!
      );
    }

    // 융합 문제 필터
    if (filter.interdisciplinary !== undefined) {
      results = results.filter(
        q => q.analysis.interdisciplinary === filter.interdisciplinary
      );
    }

    // 시사 관련 필터
    if (filter.currentEventsRelated !== undefined) {
      results = results.filter(
        q => q.analysis.currentEventsRelated === filter.currentEventsRelated
      );
    }

    // 품질 점수 필터
    if (filter.minQualityScore !== undefined) {
      results = results.filter(q => q.qualityScore >= filter.minQualityScore!);
    }

    // 검증된 문제만
    if (filter.verifiedOnly) {
      results = results.filter(q => q.verificationStatus === 'verified');
    }

    // 텍스트 검색
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      results = results.filter(
        q =>
          q.content.prompt.toLowerCase().includes(query) ||
          q.content.title?.toLowerCase().includes(query) ||
          q.keywords.some(k => k.toLowerCase().includes(query))
      );
    }

    // 정렬
    if (filter.sortBy) {
      results = this.sortQuestions(
        results,
        filter.sortBy,
        filter.sortOrder || 'desc'
      );
    }

    return results;
  }

  /**
   * 페이지네이션과 함께 검색
   */
  public search(filter: QuestionFilter): PaginationResult<EssayQuestion> {
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
   * 유사 문제 찾기
   */
  public findSimilar(query: SimilarQuestionQuery): EssayQuestion[] {
    const target = this.getById(query.questionId);
    if (!target) return [];

    const defaultWeights = {
      content: 0.4,
      structure: 0.2,
      difficulty: 0.2,
      topic: 0.2,
    };

    const weights = query.similarityFactors || defaultWeights;

    let candidates = Array.from(this.questions.values()).filter(
      q => q.id !== query.questionId
    );

    // 필터 적용
    if (query.sameUniversity) {
      candidates = candidates.filter(q => q.universityId === target.universityId);
    }

    if (query.sameCategory) {
      candidates = candidates.filter(q => q.category === target.category);
    }

    if (query.yearRange) {
      const [minYear, maxYear] = query.yearRange;
      candidates = candidates.filter(q => {
        const year = parseInt(q.academicYear);
        return year >= minYear && year <= maxYear;
      });
    }

    // 유사도 계산
    const scored = candidates.map(q => ({
      question: q,
      similarity: this.calculateSimilarity(target, q, weights),
    }));

    // 최소 유사도 필터
    const minSimilarity = query.minSimilarity || 0.5;
    const filtered = scored.filter(item => item.similarity >= minSimilarity);

    // 정렬
    filtered.sort((a, b) => b.similarity - a.similarity);

    // 제한
    const limit = query.limit || 10;
    return filtered.slice(0, limit).map(item => item.question);
  }

  /**
   * 문제 분석
   */
  public analyze(questionId: string): QuestionAnalysisResult {
    const question = this.getById(questionId);
    if (!question) {
      throw new Error(`Question with ID ${questionId} not found`);
    }

    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    // 강점 분석
    if (question.qualityScore >= 90) {
      strengths.push({
        aspect: '전체 품질',
        score: question.qualityScore,
        description: '매우 우수한 품질의 문제입니다.',
      });
    }

    if (question.solution?.overallExplanation) {
      strengths.push({
        aspect: '해설 완성도',
        score: 95,
        description: '상세한 해설이 제공됩니다.',
      });
    }

    if (question.statistics && question.statistics.attemptCount > 100) {
      strengths.push({
        aspect: '데이터 풍부도',
        score: 90,
        description: '충분한 통계 데이터가 있습니다.',
      });
    }

    // 약점 분석
    if (!question.solution) {
      weaknesses.push({
        aspect: '모범답안',
        severity: 'major' as const,
        description: '모범답안이 없습니다.',
        improvement: '모범답안과 채점기준을 추가하세요.',
      });
    }

    if (question.relatedQuestions?.length === 0) {
      weaknesses.push({
        aspect: '유사 문제 연결',
        severity: 'minor' as const,
        description: '유사 문제가 연결되지 않았습니다.',
        improvement: '유사 문제를 찾아 연결하세요.',
      });
    }

    // 추천사항
    recommendations.push({
      type: 'practice' as const,
      priority: 'high' as const,
      action: '이 문제를 풀어보세요',
      reason: '현재 학습 수준에 적합합니다.',
    });

    if (question.relatedQuestions && question.relatedQuestions.length > 0) {
      recommendations.push({
        type: 'practice' as const,
        priority: 'medium' as const,
        action: '유사 문제 풀이',
        reason: '패턴 학습에 도움이 됩니다.',
      });
    }

    return {
      question,
      strengths,
      weaknesses,
      recommendations,
    };
  }

  /**
   * 개인화 추천
   */
  public recommend(request: RecommendationRequest): RecommendationResult {
    let candidates = Array.from(this.questions.values());

    // 목표 대학 필터
    if (request.targetUniversities && request.targetUniversities.length > 0) {
      candidates = candidates.filter(q =>
        request.targetUniversities!.includes(q.universityId)
      );
    }

    // 선호도 필터
    if (request.preferences) {
      if (request.preferences.difficulty && request.preferences.difficulty.length > 0) {
        candidates = candidates.filter(q =>
          request.preferences!.difficulty!.includes(q.difficulty)
        );
      }

      if (request.preferences.topics && request.preferences.topics.length > 0) {
        candidates = candidates.filter(q =>
          q.analysis.topics.some(t =>
            request.preferences!.topics!.some(pt =>
              t.topic.toLowerCase().includes(pt.toLowerCase())
            )
          )
        );
      }
    }

    // 이미 푼 문제 제외
    if (request.completedQuestions && request.completedQuestions.length > 0) {
      candidates = candidates.filter(
        q => !request.completedQuestions!.includes(q.id)
      );
    }

    // 추천 점수 계산
    const scored = candidates.map(q => ({
      questionId: q.id,
      score: this.calculateRecommendationScore(q, request),
      reason: this.generateRecommendationReason(q, request),
      expectedDifficulty: q.difficulty,
      expectedTime: q.estimatedTime,
    }));

    // 정렬 및 제한
    scored.sort((a, b) => b.score - a.score);
    const topRecommendations = scored.slice(0, 10);

    return {
      questions: topRecommendations,
      insights: {
        strengthAreas: [],
        improvementAreas: request.weaknessAreas || [],
        recommendations: [
          '꾸준히 연습하세요',
          '다양한 유형의 문제를 풀어보세요',
        ],
      },
    };
  }

  /**
   * 문제 업데이트
   */
  public update(id: string, updates: Partial<EssayQuestion>): boolean {
    const existing = this.questions.get(id);
    if (!existing) {
      throw new Error(`Question with ID ${id} not found`);
    }

    const updated = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    this.questions.set(id, updated);
    return true;
  }

  /**
   * 문제 삭제
   */
  public delete(id: string): boolean {
    return this.questions.delete(id);
  }

  /**
   * 유사도 계산
   */
  private calculateSimilarity(
    a: EssayQuestion,
    b: EssayQuestion,
    weights: { content: number; structure: number; difficulty: number; topic: number }
  ): number {
    let score = 0;

    // 내용 유사도 (키워드 기반)
    const commonKeywords = a.keywords.filter(k => b.keywords.includes(k));
    const contentSimilarity =
      commonKeywords.length / Math.max(a.keywords.length, b.keywords.length, 1);
    score += contentSimilarity * weights.content;

    // 구조 유사도
    const structureSimilarity =
      a.subQuestionCount === b.subQuestionCount ? 1 : 0.5;
    score += structureSimilarity * weights.structure;

    // 난이도 유사도
    const difficultyMap: Record<DifficultyLevel, number> = {
      very_easy: 1,
      easy: 2,
      medium: 3,
      hard: 4,
      very_hard: 5,
    };
    const aDiff = difficultyMap[a.difficulty];
    const bDiff = difficultyMap[b.difficulty];
    const difficultySimilarity = 1 - Math.abs(aDiff - bDiff) / 4;
    score += difficultySimilarity * weights.difficulty;

    // 주제 유사도
    const commonTopics = a.analysis.topics.filter(at =>
      b.analysis.topics.some(bt => bt.topic === at.topic)
    );
    const topicSimilarity =
      commonTopics.length /
      Math.max(a.analysis.topics.length, b.analysis.topics.length, 1);
    score += topicSimilarity * weights.topic;

    return score;
  }

  /**
   * 추천 점수 계산
   */
  private calculateRecommendationScore(
    question: EssayQuestion,
    request: RecommendationRequest
  ): number {
    let score = 50; // 기본 점수

    // 목표 대학 보너스
    if (
      request.targetUniversities &&
      request.targetUniversities.includes(question.universityId)
    ) {
      score += 30;
    }

    // 난이도 적합성
    if (request.currentLevel?.essaySkill) {
      const difficultyMap: Record<DifficultyLevel, number> = {
        very_easy: 20,
        easy: 40,
        medium: 60,
        hard: 80,
        very_hard: 100,
      };
      const questionLevel = difficultyMap[question.difficulty];
      const diff = Math.abs(questionLevel - request.currentLevel.essaySkill);
      score += Math.max(0, 20 - diff / 5);
    }

    // 품질 점수
    score += question.qualityScore * 0.2;

    return Math.min(score, 100);
  }

  /**
   * 추천 이유 생성
   */
  private generateRecommendationReason(
    question: EssayQuestion,
    request: RecommendationRequest
  ): string {
    const reasons = [];

    if (
      request.targetUniversities &&
      request.targetUniversities.includes(question.universityId)
    ) {
      reasons.push('목표 대학 문제');
    }

    if (question.qualityScore >= 90) {
      reasons.push('고품질 문제');
    }

    if (question.statistics && question.statistics.attemptCount > 100) {
      reasons.push('많이 풀린 문제');
    }

    return reasons.join(', ') || '추천 문제';
  }

  /**
   * 정렬
   */
  private sortQuestions(
    questions: EssayQuestion[],
    sortBy: string,
    order: 'asc' | 'desc'
  ): EssayQuestion[] {
    const sorted = [...questions];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.examDate).getTime() - new Date(b.examDate).getTime();
          break;
        case 'difficulty': {
          const diffMap: Record<DifficultyLevel, number> = {
            very_easy: 1,
            easy: 2,
            medium: 3,
            hard: 4,
            very_hard: 5,
          };
          comparison = diffMap[a.difficulty] - diffMap[b.difficulty];
          break;
        }
        case 'popularity':
          comparison =
            (a.statistics?.attemptCount || 0) - (b.statistics?.attemptCount || 0);
          break;
        case 'quality':
          comparison = a.qualityScore - b.qualityScore;
          break;
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
    return this.questions.size;
  }
}

// 싱글톤 인스턴스 export
export const questionService = QuestionService.getInstance();
