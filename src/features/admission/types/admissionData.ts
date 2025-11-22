/**
 * Admission Data Type Definitions
 * 입시요강 및 전형 관련 타입 정의
 */

import type { University } from './university';

// 학년도
export type AcademicYear = string; // "2025", "2026" 등

// 전형 유형
export type AdmissionType =
  | 'regular'           // 정시
  | 'early'             // 수시
  | 'rolling'           // 수시 수능 최저
  | 'essay'             // 논술
  | 'interview'         // 면접
  | 'portfolio'         // 실기
  | 'special'           // 특별전형
  | 'transfer';         // 편입

// 전형 방법
export type SelectionMethod =
  | 'sat_only'          // 수능 100%
  | 'sat_essay'         // 수능 + 논술
  | 'sat_interview'     // 수능 + 면접
  | 'comprehensive'     // 학생부종합
  | 'transcript'        // 학생부교과
  | 'essay_centered'    // 논술 중심
  | 'portfolio'         // 실기/포트폴리오
  | 'hybrid';           // 복합

// 입시요강 전체 정보
export interface AdmissionInfo {
  id: string;
  universityId: string;
  university?: University; // populate된 경우
  academicYear: AcademicYear;

  // 전형 목록
  admissionTypes: AdmissionTypeDetail[];

  // 주요 일정
  schedule: AdmissionSchedule;

  // 모집 정보
  recruitment: RecruitmentInfo;

  // 전년도 결과
  previousResults?: PreviousYearResults;

  // 변경사항
  changes?: AdmissionChanges[];

  // 메타데이터
  publishedDate: string;
  lastModified: string;
  sourceUrl: string;
  pdfUrl?: string;
  officialAnnouncementUrl?: string;

  dataQuality: DataQualityMetrics;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

// 전형별 상세 정보
export interface AdmissionTypeDetail {
  id: string;
  code: string; // 전형 코드
  name: string;
  type: AdmissionType;
  method: SelectionMethod;

  // 모집 인원
  quota: QuotaInfo;

  // 지원 자격
  eligibility: EligibilityRequirements;

  // 전형 요소
  selectionCriteria: SelectionCriteria;

  // 일정
  schedule: TypeSpecificSchedule;

  // 수능 최저학력기준
  minimumSATRequirement?: MinimumSATRequirement;

  // 제출 서류
  requiredDocuments: RequiredDocument[];

  // 전형료
  applicationFee: number;

  // 특이사항
  specialNotes?: string[];

  // 통계 (전년도)
  statistics?: AdmissionStatistics;
}

// 모집 인원 정보
export interface QuotaInfo {
  total: number;
  byDepartment: DepartmentQuota[];

  // 분할 모집 (가/나/다군)
  byGroup?: {
    group: 'A' | 'B' | 'C';
    quota: number;
  }[];

  // 특별 모집
  special?: {
    category: string; // 농어촌, 기회균형 등
    quota: number;
  }[];
}

// 학과별 모집 인원
export interface DepartmentQuota {
  departmentId: string;
  departmentName: string;
  quota: number;
  note?: string;
}

// 지원 자격
export interface EligibilityRequirements {
  // 기본 자격
  graduationStatus: ('graduated' | 'expected' | 'ged')[];

  // 연령 제한
  ageLimit?: {
    min?: number;
    max?: number;
  };

  // 학력 요건
  minimumGPA?: number;
  minimumSATScore?: number;

  // 기타 자격
  languageProficiency?: LanguageRequirement[];
  militaryService?: 'completed' | 'exempted' | 'deferred' | 'any';

  // 제한 사항
  restrictions?: string[];

  // 특별 자격
  specialEligibility?: string[];
}

// 어학 요건
export interface LanguageRequirement {
  language: 'english' | 'korean' | 'other';
  testType: 'TOEFL' | 'TOEIC' | 'IELTS' | 'TOPIK' | string;
  minimumScore: number;
  validityPeriod?: number; // 개월
}

// 전형 요소 및 반영 비율
export interface SelectionCriteria {
  // 1단계
  firstStage?: {
    components: SelectionComponent[];
    passRate: number; // 통과 비율 (예: 3배수)
  };

  // 2단계 (최종)
  finalStage: {
    components: SelectionComponent[];
  };

  // 가산점
  bonusPoints?: BonusPoint[];
}

// 전형 요소
export interface SelectionComponent {
  name: string;
  type: 'sat' | 'essay' | 'interview' | 'gpa' | 'portfolio' | 'test' | 'other';
  weight: number; // 반영 비율 (%)

  // 상세 반영 방법
  details?: {
    // 수능 영역별 반영
    satSubjects?: {
      subject: 'korean' | 'math' | 'english' | 'science' | 'social' | 'second_language';
      weight: number;
      requiredLevel?: string;
    }[];

    // 논술 상세
    essayDetails?: EssayExamDetails;

    // 면접 상세
    interviewDetails?: InterviewDetails;

    // 학생부 상세
    transcriptDetails?: TranscriptDetails;
  };

  // 점수 환산 방법
  scoringMethod?: string;
  maxScore?: number;
}

// 논술 고사 상세
export interface EssayExamDetails {
  duration: number; // 분
  questionCount: number;
  questionTypes: EssayQuestionType[];

  // 평가 기준
  evaluationCriteria: {
    criterion: string;
    weight: number;
  }[];

  // 제시문 정보
  materialInfo?: {
    length: string; // 예: "3000-4000자"
    sources: string[]; // 예: ["인문", "사회", "자연과학"]
  };

  // 답안 요구사항
  answerRequirements: {
    wordLimit: string; // 예: "1000-1200자"
    format: string;
  };

  // 고사장 정보
  examVenue?: string;
  examDate?: string;
}

// 논술 문제 유형
export type EssayQuestionType =
  | 'argument'          // 논증형
  | 'analysis'          // 분석형
  | 'comparison'        // 비교형
  | 'problem_solving'   // 문제해결형
  | 'creative'          // 창의형
  | 'data_analysis'     // 자료분석형
  | 'math'              // 수리논술
  | 'science';          // 과학논술

// 면접 상세
export interface InterviewDetails {
  type: 'structured' | 'unstructured' | 'group' | 'presentation';
  duration: number; // 분
  panelSize: number; // 면접관 수

  // 면접 내용
  topics?: string[];
  preparationTime?: number; // 분

  // 평가 항목
  evaluationAreas: {
    area: string;
    weight: number;
  }[];
}

// 학생부 반영 상세
export interface TranscriptDetails {
  // 반영 교과
  subjects: {
    category: 'korean' | 'math' | 'english' | 'science' | 'social' | 'all';
    weight: number;
  }[];

  // 반영 학기
  semesters: number[]; // 예: [1, 2, 3, 4, 5, 6]

  // 등급 간 점수 차
  scoreConversion: {
    grade: number;
    score: number;
  }[];
}

// 가산점
export interface BonusPoint {
  category: string; // 예: "다자녀", "농어촌"
  points: number;
  maxPoints?: number;
  conditions?: string;
}

// 전형별 일정
export interface TypeSpecificSchedule {
  applicationPeriod: Period;
  documentSubmission: Period;
  examDate?: string; // 논술/면접 등
  firstPassAnnouncement?: string;
  finalAnnouncement: string;
  registrationPeriod: Period;
  additionalRecruitment?: Period;
}

// 기간
export interface Period {
  start: string; // ISO date
  end: string;
}

// 수능 최저학력기준
export interface MinimumSATRequirement {
  required: boolean;

  // 조건
  conditions?: {
    description: string;

    // 예: "국, 수, 영, 탐(1과목) 중 2개 영역 2등급"
    subjects: ('korean' | 'math' | 'english' | 'science' | 'social')[];
    requiredSubjectCount: number;
    requiredGrade: number;

    // 한국사
    koreanHistory?: {
      requiredGrade: number;
    };

    // 탐구 영역
    inquiry?: {
      subjectCount: number; // 반영 과목 수
      averageGrade?: number;
      topSubjectGrade?: number;
    };
  }[];

  // 예외 사항
  exceptions?: string[];
}

// 제출 서류
export interface RequiredDocument {
  name: string;
  type: 'transcript' | 'certificate' | 'essay' | 'recommendation' | 'portfolio' | 'other';
  required: boolean;
  format?: 'online' | 'paper' | 'both';
  deadline?: string;
  notes?: string[];
}

// 입시 일정 (전체)
export interface AdmissionSchedule {
  // 주요 공통 일정
  guidelinePublication: string; // 입시요강 발표일

  // 수시
  early?: {
    applicationPeriod: Period;
    finalAnnouncement: string;
  };

  // 정시
  regular?: {
    applicationPeriod: Period;
    finalAnnouncement: string;
  };

  // 등록
  registrationPeriods: Period[];

  // 추가 모집
  additionalRecruitment?: Period;
}

// 모집 정보
export interface RecruitmentInfo {
  totalQuota: number;
  earlyQuota?: number;
  regularQuota?: number;

  // 모집 단위
  recruitmentUnits: RecruitmentUnit[];

  // 특별 전형
  specialAdmissions?: SpecialAdmission[];
}

// 모집 단위
export interface RecruitmentUnit {
  id: string;
  name: string;
  departments: string[];
  quota: number;
  note?: string;
}

// 특별 전형
export interface SpecialAdmission {
  type: string; // 농어촌, 기회균형, 특성화고 등
  quota: number;
  requirements: string[];
}

// 전년도 결과
export interface PreviousYearResults {
  year: AcademicYear;

  // 전형별 결과
  byAdmissionType: {
    typeId: string;
    typeName: string;

    // 경쟁률
    competitionRate: {
      overall: number;
      byDepartment?: {
        departmentId: string;
        departmentName: string;
        rate: number;
        applicants: number;
        admitted: number;
      }[];
    };

    // 합격선
    cutoffScores?: {
      department: string;
      min: number;
      avg: number;
      max: number;
      top10Percent?: number;
      top25Percent?: number;
    }[];

    // 수능 등급
    satGrades?: {
      department: string;
      subject: string;
      avgGrade: number;
      minGrade: number;
      maxGrade: number;
    }[];
  }[];

  // 충원 정보
  additionalSelection?: {
    department: string;
    initialAdmitted: number;
    additionalRounds: number;
    totalAdmitted: number;
    competitionRate: number;
  }[];
}

// 입시 변경사항
export interface AdmissionChanges {
  id: string;
  changeDate: string;
  category: 'quota' | 'schedule' | 'criteria' | 'requirement' | 'other';
  severity: 'critical' | 'major' | 'minor';

  description: string;
  previousValue?: string;
  newValue?: string;

  affectedTypes?: string[]; // 영향받는 전형
  affectedDepartments?: string[]; // 영향받는 학과

  source: string;
  officialAnnouncement?: string;
}

// 입시 통계
export interface AdmissionStatistics {
  academicYear: AcademicYear;

  // 지원 현황
  applications: {
    total: number;
    byGender: {
      male: number;
      female: number;
    };
    byRegion?: Record<string, number>;
  };

  // 경쟁률
  competitionRate: {
    overall: number;
    highest: {
      department: string;
      rate: number;
    };
    lowest: {
      department: string;
      rate: number;
    };
  };

  // 합격자 통계
  admitted: {
    total: number;
    avgSATScore?: number;
    avgGPA?: number;
    avgEssayScore?: number;

    scoreDistribution?: {
      range: string; // "400-410"
      count: number;
      percentage: number;
    }[];
  };

  // 등록 현황
  registration: {
    initialRegistration: number;
    registrationRate: number;
    vacancies: number;
    additionalRounds: number;
  };
}

// 데이터 품질 메트릭
export interface DataQualityMetrics {
  completeness: number; // 0-1
  accuracy: number; // 0-1
  timeliness: number; // 0-1
  consistency: number; // 0-1

  missingFields: string[];
  lastValidation: string;
  validationErrors: ValidationError[];
}

// 검증 오류
export interface ValidationError {
  field: string;
  error: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

// 검색/필터
export interface AdmissionFilter {
  academicYear?: AcademicYear[];
  universityId?: string[];
  universityTier?: string[];
  region?: string[];

  admissionType?: AdmissionType[];
  method?: SelectionMethod[];

  hasEssayExam?: boolean;
  hasInterview?: boolean;
  requiresSAT?: boolean;

  minCompetitionRate?: number;
  maxCompetitionRate?: number;

  // 정렬
  sortBy?: 'university' | 'competitionRate' | 'quota' | 'deadline';
  sortOrder?: 'asc' | 'desc';

  // 페이지네이션
  page?: number;
  limit?: number;
}
