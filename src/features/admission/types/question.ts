/**
 * Essay Question Type Definitions
 * 논술 기출문제 관련 타입 정의
 */

import type { University, Department, DepartmentCategory } from './university';
import type { AcademicYear } from './admissionData';

// 문제 ID 생성 형식: {대학코드}-{연도}-{회차}-{문제번호}
// 예: SNU-2024-01-001

// 논술 문제 전체 정보
export interface EssayQuestion {
  id: string;
  universityId: string;
  university?: University; // populated

  departmentId?: string;
  department?: Department; // populated

  // 기본 정보
  academicYear: AcademicYear;
  examDate: string;
  examRound?: number; // 몇 회차 (1, 2, 3...)

  // 문제 구분
  category: DepartmentCategory;
  questionNumber: number; // 문제 번호
  subQuestionCount: number; // 소문제 개수

  // 문제 내용
  content: QuestionContent;

  // 분석 데이터
  analysis: QuestionAnalysis;

  // 모범답안 및 채점기준
  solution?: QuestionSolution;

  // 통계 데이터
  statistics?: QuestionStatistics;

  // 메타데이터
  difficulty: DifficultyLevel;
  estimatedTime: number; // 분
  tags: string[];
  keywords: string[];

  // 관계
  relatedQuestions?: string[]; // 유사 문제 ID 목록
  prerequisiteKnowledge?: string[];

  // 데이터 출처
  sourceUrl?: string;
  sourceType: 'official' | 'third_party' | 'reconstructed';

  // 저작권
  copyright: CopyrightInfo;

  // 시스템
  createdAt: string;
  updatedAt: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  qualityScore: number; // 0-100
}

// 문제 내용
export interface QuestionContent {
  // 문제 제목/주제
  title?: string;
  theme?: string;

  // 문제 지시문 (프롬프트)
  prompt: string;
  promptHtml?: string; // HTML 포맷된 버전

  // 제시문/자료
  materials: QuestionMaterial[];

  // 소문제들
  subQuestions: SubQuestion[];

  // 제약사항
  constraints: QuestionConstraints;

  // 추가 정보
  notes?: string[];
  specialInstructions?: string[];
}

// 제시문/자료
export interface QuestionMaterial {
  id: string;
  order: number; // 순서
  label: string; // 예: "가", "나", "다" 또는 "제시문 1", "자료 1"

  type: MaterialType;
  content: string | MaterialData;

  // 출처 정보
  source?: MaterialSource;

  // 분석 데이터
  analysis?: MaterialAnalysis;
}

// 자료 유형
export type MaterialType =
  | 'text'          // 텍스트 지문
  | 'poem'          // 시
  | 'article'       // 기사
  | 'chart'         // 차트/그래프
  | 'table'         // 표
  | 'image'         // 이미지
  | 'diagram'       // 다이어그램
  | 'equation'      // 수식
  | 'code'          // 코드
  | 'data';         // 데이터셋

// 비텍스트 자료 데이터
export interface MaterialData {
  // 이미지/차트/다이어그램
  imageUrl?: string;
  imageDescription?: string;

  // 표 데이터
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
    caption?: string;
  };

  // 수식
  latexEquation?: string;

  // 원본 데이터
  rawData?: any;
}

// 자료 출처
export interface MaterialSource {
  author?: string;
  title?: string;
  publication?: string;
  publicationDate?: string;
  publisher?: string;
  page?: string;
  url?: string;

  // 저작권
  copyrightNotice?: string;
  usageRight?: 'fair_use' | 'licensed' | 'public_domain' | 'permission_required';
}

// 자료 분석
export interface MaterialAnalysis {
  // 텍스트 분석
  wordCount?: number;
  sentenceCount?: number;
  readingLevel?: ReadingLevel;
  readingTime?: number; // 초

  // 어휘 분석
  vocabularyLevel?: VocabularyLevel;
  difficultWords?: DiffWord[];

  // 구조 분석
  structure?: TextStructure;

  // 주제 분석
  mainIdeas?: string[];
  themes?: string[];
  arguments?: ArgumentStructure[];

  // 감성 분석
  sentiment?: {
    polarity: number; // -1 (부정) to 1 (긍정)
    subjectivity: number; // 0 (객관적) to 1 (주관적)
  };

  // 개념 추출
  concepts?: ExtractedConcept[];
}

// 독해 수준
export interface ReadingLevel {
  grade: number; // 학년 수준
  level: 'elementary' | 'middle' | 'high' | 'college' | 'advanced';
  fleschKincaid: number;
  fleschReadingEase: number;
}

// 어휘 수준
export interface VocabularyLevel {
  averageWordLength: number;
  uniqueWordRatio: number;
  academicWordRatio: number;
  advancedVocabRatio: number;
}

// 어려운 단어
export interface DiffWord {
  word: string;
  meaning: string;
  context?: string;
  frequency?: 'rare' | 'uncommon' | 'common';
}

// 텍스트 구조
export interface TextStructure {
  type: 'narrative' | 'expository' | 'argumentative' | 'descriptive' | 'mixed';
  paragraphs: number;
  organizationPattern?: string; // 예: "문제-해결", "원인-결과", "비교-대조"
}

// 논증 구조
export interface ArgumentStructure {
  claim: string;
  evidence: string[];
  reasoning: string;
  counterargument?: string;
  rebuttal?: string;
}

// 추출된 개념
export interface ExtractedConcept {
  concept: string;
  category: string; // 예: "철학", "경제학", "생물학"
  definition?: string;
  importance: number; // 0-1
  relatedConcepts?: string[];
}

// 소문제
export interface SubQuestion {
  id: string;
  number: string; // 예: "1", "2-1", "가"
  question: string;

  // 요구사항
  task: QuestionTask;
  wordLimit?: {
    min: number;
    max: number;
  };

  // 배점
  points?: number;

  // 관련 제시문
  relatedMaterials?: string[]; // Material ID 목록

  // 평가 기준
  evaluationCriteria?: EvaluationCriterion[];

  // 모범답안
  modelAnswer?: string;

  // 해설
  explanation?: string;
  keyPoints?: string[];
  commonMistakes?: string[];
}

// 문제 과제 유형
export type QuestionTask =
  | 'summarize'         // 요약하기
  | 'explain'           // 설명하기
  | 'compare'           // 비교하기
  | 'analyze'           // 분석하기
  | 'evaluate'          // 평가하기
  | 'argue'             // 논증하기
  | 'critique'          // 비판하기
  | 'synthesize'        // 종합하기
  | 'apply'             // 적용하기
  | 'create'            // 창작하기
  | 'solve'             // 문제 해결하기
  | 'interpret';        // 해석하기

// 평가 기준
export interface EvaluationCriterion {
  criterion: string;
  weight: number; // %
  description?: string;

  // 수준별 기준
  levels?: {
    level: '상' | '중' | '하';
    description: string;
    scoreRange?: [number, number];
  }[];
}

// 제약사항
export interface QuestionConstraints {
  totalWordLimit?: {
    min: number;
    max: number;
  };

  timeLimit: number; // 분

  format?: string; // 예: "연속된 문장으로", "개조식으로"

  restrictions?: string[]; // 예: "제시문의 표현을 그대로 쓰지 말 것"

  requiredElements?: string[]; // 예: "제시문 가, 나, 다를 모두 활용할 것"
}

// 문제 분석
export interface QuestionAnalysis {
  // 문제 유형 분류
  types: QuestionType[];

  // 출제 의도
  intent?: string;

  // 요구 능력
  requiredSkills: RequiredSkill[];

  // Bloom's Taxonomy 수준
  bloomLevel: BloomLevel[];

  // 난이도 요인
  difficultyFactors: DifficultyFactor[];

  // 주제 및 소재
  topics: Topic[];
  themes: string[];

  // 학문 분야
  disciplines: string[];
  interdisciplinary: boolean;

  // 시사 연관성
  currentEventsRelated: boolean;
  currentEventsTopics?: string[];

  // 교육과정 연계
  curriculumAlignment?: CurriculumAlignment[];

  // 유사 문제 패턴
  patterns?: QuestionPattern[];
}

// 문제 유형
export interface QuestionType {
  category: 'primary' | 'secondary';
  type: string; // 예: "논증형", "비교분석형", "문제해결형"
  confidence: number; // 0-1
}

// 요구 능력
export interface RequiredSkill {
  skill: string; // 예: "독해력", "논리적 사고", "비판적 사고"
  importance: 'critical' | 'important' | 'helpful';
  level: number; // 1-5
}

// Bloom's Taxonomy
export type BloomLevel =
  | 'remember'      // 기억
  | 'understand'    // 이해
  | 'apply'         // 적용
  | 'analyze'       // 분석
  | 'evaluate'      // 평가
  | 'create';       // 창조

// 난이도 요인
export interface DifficultyFactor {
  factor: string; // 예: "제시문 길이", "개념 복잡도", "시간 압박"
  impact: 'high' | 'medium' | 'low';
  score: number; // 0-10
}

// 주제
export interface Topic {
  topic: string;
  category: string; // 예: "사회", "과학", "철학"
  relevance: number; // 0-1
  recurrence: number; // 이 주제가 나온 횟수
}

// 교육과정 연계
export interface CurriculumAlignment {
  subject: string; // 예: "국어", "사회", "윤리"
  grade: number;
  unit: string;
  learningObjective: string;
  alignment: number; // 0-1
}

// 문제 패턴
export interface QuestionPattern {
  patternType: string;
  description: string;
  frequency: number; // 이 패턴이 나온 횟수
  examples: string[]; // 다른 문제 ID
}

// 모범답안 및 해설
export interface QuestionSolution {
  // 전체 모범답안
  fullModelAnswer?: string;

  // 소문제별 모범답안
  subQuestionSolutions: {
    subQuestionId: string;
    modelAnswer: string;
    alternativeAnswers?: string[];

    // 채점 기준
    scoringRubric?: ScoringRubric;

    // 핵심 키워드
    keyTerms?: string[];

    // 필수 포함 내용
    requiredContent?: string[];

    // 감점 요인
    deductionFactors?: DeductionFactor[];
  }[];

  // 전체 해설
  overallExplanation?: string;

  // 출제자 의도
  examinerIntent?: string;

  // 문제 접근 전략
  solvingStrategy?: SolvingStrategy;

  // 우수 답안 예시
  excellentExamples?: ExampleAnswer[];

  // 흔한 실수
  commonMistakes?: CommonMistake[];

  // 학습 팁
  studyTips?: string[];
}

// 채점 기준
export interface ScoringRubric {
  criteria: {
    criterion: string;
    maxPoints: number;

    // 수준별 배점
    levels: {
      level: string; // 예: "우수", "보통", "미흡"
      points: number;
      description: string;
      examples?: string[];
    }[];
  }[];

  // 총점
  totalPoints: number;

  // 부분 점수
  partialCredit?: {
    condition: string;
    points: number;
  }[];
}

// 감점 요인
export interface DeductionFactor {
  reason: string;
  points: number;
  examples?: string[];
}

// 문제 풀이 전략
export interface SolvingStrategy {
  steps: {
    step: number;
    action: string;
    duration?: number; // 권장 소요 시간 (분)
    tips?: string[];
  }[];

  timeManagement: {
    reading: number; // 분
    planning: number;
    writing: number;
    review: number;
  };

  keyApproaches: string[];
}

// 우수 답안 예시
export interface ExampleAnswer {
  id: string;
  answer: string;
  score: number;

  strengths: string[];
  highlights: AnswerHighlight[];

  // 익명화된 수험생 정보
  studentLevel?: '상위권' | '중위권';
}

// 답안 하이라이트
export interface AnswerHighlight {
  text: string;
  reason: string; // 왜 좋은지
  category: 'structure' | 'logic' | 'expression' | 'creativity' | 'evidence';
}

// 흔한 실수
export interface CommonMistake {
  mistake: string;
  frequency: 'very_common' | 'common' | 'occasional';
  impact: 'critical' | 'major' | 'minor';

  explanation: string;
  correction: string;

  examples?: string[];
}

// 문제 통계
export interface QuestionStatistics {
  // 응시 통계
  attemptCount: number;

  // 점수 분포
  scoreDistribution: {
    range: string; // 예: "90-100"
    count: number;
    percentage: number;
  }[];

  // 평균 점수
  averageScore: number;
  medianScore: number;
  standardDeviation: number;

  // 난이도 지표
  difficultyIndex: number; // 0-1 (1에 가까울수록 쉬움)
  discriminationIndex: number; // 0-1 (1에 가까울수록 변별력 높음)

  // 소요 시간
  averageTime: number; // 분
  medianTime: number;

  // 정답률 (각 평가 요소별)
  accuracyByCriterion?: {
    criterion: string;
    accuracy: number; // 0-1
  }[];

  // 사용자 피드백
  userRatings?: {
    difficulty: number; // 1-5
    quality: number; // 1-5
    relevance: number; // 1-5
    ratingCount: number;
  };
}

// 난이도 수준
export type DifficultyLevel =
  | 'very_easy'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'very_hard';

// 저작권 정보
export interface CopyrightInfo {
  owner: string;
  year: number;
  license: 'proprietary' | 'fair_use' | 'cc_by' | 'cc_by_nc' | 'public_domain';

  usageRights: {
    educational: boolean;
    commercial: boolean;
    modification: boolean;
    distribution: boolean;
  };

  attribution: string;
  disclaimer?: string;
}

// 검색/필터
export interface QuestionFilter {
  // 기본 필터
  universityId?: string[];
  departmentId?: string[];
  category?: DepartmentCategory[];
  academicYear?: AcademicYear[];

  // 난이도
  difficulty?: DifficultyLevel[];
  minDifficulty?: number;
  maxDifficulty?: number;

  // 문제 유형
  questionTypes?: string[];
  tasks?: QuestionTask[];

  // 주제
  topics?: string[];
  keywords?: string[];

  // Bloom 수준
  bloomLevels?: BloomLevel[];

  // 시간
  maxTimeLimit?: number;

  // 융합 문제
  interdisciplinary?: boolean;

  // 시사 관련
  currentEventsRelated?: boolean;

  // 품질
  minQualityScore?: number;
  verifiedOnly?: boolean;

  // 검색어
  searchQuery?: string;

  // 정렬
  sortBy?: 'date' | 'difficulty' | 'popularity' | 'relevance' | 'quality';
  sortOrder?: 'asc' | 'desc';

  // 페이지네이션
  page?: number;
  limit?: number;
}

// 유사 문제 검색
export interface SimilarQuestionQuery {
  questionId: string;

  // 유사도 기준
  similarityFactors?: {
    content: number;       // 내용 유사도 가중치
    structure: number;     // 구조 유사도
    difficulty: number;    // 난이도 유사도
    topic: number;         // 주제 유사도
  };

  // 필터
  sameUniversity?: boolean;
  sameCategory?: boolean;
  yearRange?: [number, number];

  // 결과 수
  limit?: number;
  minSimilarity?: number; // 0-1
}

// 문제 분석 결과
export interface QuestionAnalysisResult {
  question: EssayQuestion;

  // 강점
  strengths: {
    aspect: string;
    score: number; // 0-100
    description: string;
  }[];

  // 약점
  weaknesses: {
    aspect: string;
    severity: 'critical' | 'major' | 'minor';
    description: string;
    improvement: string;
  }[];

  // 추천 사항
  recommendations: {
    type: 'study' | 'practice' | 'review';
    priority: 'high' | 'medium' | 'low';
    action: string;
    reason: string;
  }[];

  // 관련 학습 자료
  suggestedResources?: {
    type: 'concept' | 'skill' | 'practice';
    title: string;
    url?: string;
  }[];
}
