/**
 * Admission Types Index
 * 입시 데이터베이스 모든 타입 통합 export
 */

// University Types
export type {
  University,
  UniversityTier,
  UniversityType,
  Region,
  UniversityRankings,
  RankingInfo,
  UniversityReputation,
  DataSource,
  VerificationStatus,
  Department,
  DepartmentCategory,
  UniversityFilter,
  UniversityStatistics,
} from './university';

// Admission Data Types
export type {
  AcademicYear,
  AdmissionType,
  SelectionMethod,
  AdmissionInfo,
  AdmissionTypeDetail,
  QuotaInfo,
  DepartmentQuota,
  EligibilityRequirements,
  LanguageRequirement,
  SelectionCriteria,
  SelectionComponent,
  EssayExamDetails,
  EssayQuestionType,
  InterviewDetails,
  TranscriptDetails,
  BonusPoint,
  TypeSpecificSchedule,
  Period,
  MinimumSATRequirement,
  RequiredDocument,
  AdmissionSchedule,
  RecruitmentInfo,
  RecruitmentUnit,
  SpecialAdmission,
  PreviousYearResults,
  AdmissionChanges,
  AdmissionStatistics,
  DataQualityMetrics,
  ValidationError,
  AdmissionFilter,
} from './admissionData';

// Question Types
export type {
  EssayQuestion,
  QuestionContent,
  QuestionMaterial,
  MaterialType,
  MaterialData,
  MaterialSource,
  MaterialAnalysis,
  ReadingLevel,
  VocabularyLevel,
  DiffWord,
  TextStructure,
  ArgumentStructure,
  ExtractedConcept,
  SubQuestion,
  QuestionTask,
  EvaluationCriterion,
  QuestionConstraints,
  QuestionAnalysis,
  QuestionType,
  RequiredSkill,
  BloomLevel,
  DifficultyFactor,
  Topic,
  CurriculumAlignment,
  QuestionPattern,
  QuestionSolution,
  ScoringRubric,
  DeductionFactor,
  SolvingStrategy,
  ExampleAnswer,
  AnswerHighlight,
  CommonMistake,
  QuestionStatistics,
  DifficultyLevel,
  CopyrightInfo,
  QuestionFilter,
  SimilarQuestionQuery,
  QuestionAnalysisResult,
} from './question';

// Additional Utility Types
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    version?: string;
  };
}

export interface SearchResult<T> {
  item: T;
  score: number; // 관련성 점수 0-1
  highlights?: {
    field: string;
    snippet: string;
  }[];
}

// Analytics Types
export interface TrendAnalysis {
  period: {
    start: string;
    end: string;
  };

  metrics: {
    metric: string;
    value: number;
    change: number; // % change
    trend: 'increasing' | 'decreasing' | 'stable';
  }[];

  insights: {
    type: 'opportunity' | 'warning' | 'info';
    title: string;
    description: string;
    confidence: number; // 0-1
  }[];
}

export interface PredictionResult {
  target: string;
  predictedValue: number;
  confidence: number; // 0-1
  confidenceInterval?: {
    low: number;
    high: number;
  };

  factors: {
    factor: string;
    importance: number; // 0-1
    impact: 'positive' | 'negative' | 'neutral';
  }[];

  methodology: string;
  timestamp: string;
}

// Data Quality Types
export interface QualityReport {
  overallScore: number; // 0-100

  dimensions: {
    completeness: QualityDimension;
    accuracy: QualityDimension;
    consistency: QualityDimension;
    timeliness: QualityDimension;
    validity: QualityDimension;
  };

  issues: {
    severity: 'critical' | 'major' | 'minor';
    category: string;
    description: string;
    affectedRecords: number;
    suggestedFix?: string;
  }[];

  timestamp: string;
}

export interface QualityDimension {
  score: number; // 0-100
  status: 'excellent' | 'good' | 'fair' | 'poor';
  details: string;
  improvements?: string[];
}

// Sync & Update Types
export interface DataSyncStatus {
  source: string;
  lastSync: string;
  nextSync: string;
  status: 'synced' | 'syncing' | 'failed' | 'pending';
  recordsProcessed?: number;
  recordsUpdated?: number;
  recordsAdded?: number;
  errors?: string[];
}

export interface UpdateNotification {
  id: string;
  type: 'admission_change' | 'new_question' | 'schedule_update' | 'competition_rate';
  severity: 'critical' | 'high' | 'medium' | 'low';

  title: string;
  message: string;

  affectedUniversities?: string[];
  affectedDepartments?: string[];

  actionRequired?: boolean;
  actionUrl?: string;

  timestamp: string;
  expiresAt?: string;
}

// Recommendation Types
export interface RecommendationRequest {
  userId?: string;

  // User profile
  targetUniversities?: string[];
  targetDepartments?: string[];
  currentLevel?: {
    sat?: number;
    gpa?: number;
    essaySkill?: number;
  };

  // Preferences
  preferences?: {
    difficulty?: string[]; // DifficultyLevel[]
    topics?: string[];
    questionTypes?: string[];
  };

  // Learning history
  completedQuestions?: string[];
  weaknessAreas?: string[];

  // Goal
  goal?: 'practice' | 'review' | 'challenge' | 'exam_prep';
  timeAvailable?: number; // 분
}

export interface RecommendationResult {
  questions: {
    questionId: string; // EssayQuestion ID
    score: number; // 추천 점수 0-100
    reason: string;
    expectedDifficulty?: string; // DifficultyLevel
    expectedTime?: number;
  }[];

  studyPlan?: {
    week: number;
    focus: string;
    questions: string[];
    goals: string[];
  }[];

  insights: {
    strengthAreas: string[];
    improvementAreas: string[];
    recommendations: string[];
  };
}

// Batch Operations
export interface BatchOperation {
  operationType: 'create' | 'update' | 'delete' | 'validate';
  resourceType: 'university' | 'admission' | 'question';

  items: any[];

  options?: {
    continueOnError?: boolean;
    validateFirst?: boolean;
    dryRun?: boolean;
  };
}

export interface BatchOperationResult {
  success: boolean;

  summary: {
    total: number;
    succeeded: number;
    failed: number;
    skipped: number;
  };

  results: {
    index: number;
    success: boolean;
    id?: string;
    error?: string;
  }[];

  duration: number; // ms
}

// Export/Import Types
export interface ExportRequest {
  resourceType: 'university' | 'admission' | 'question';
  format: 'json' | 'csv' | 'excel' | 'pdf';

  filter?: any;
  fields?: string[];

  options?: {
    includeMetadata?: boolean;
    includeRelations?: boolean;
    compress?: boolean;
  };
}

export interface ExportResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  recordCount: number;
  expiresAt: string;
  checksum: string;
}
