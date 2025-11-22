/**
 * University Type Definitions
 * 대학 관련 모든 타입 정의
 */

// 대학 티어 (서열)
export type UniversityTier = 'SKY' | 'top15' | 'in_seoul' | 'regional_flagship' | 'regional' | 'specialized';

// 대학 유형
export type UniversityType = 'national' | 'public' | 'private' | 'specialized';

// 지역
export type Region =
  | 'seoul'
  | 'gyeonggi'
  | 'incheon'
  | 'busan'
  | 'daegu'
  | 'daejeon'
  | 'gwangju'
  | 'ulsan'
  | 'sejong'
  | 'gangwon'
  | 'chungbuk'
  | 'chungnam'
  | 'jeonbuk'
  | 'jeonnam'
  | 'gyeongbuk'
  | 'gyeongnam'
  | 'jeju';

// 대학 기본 정보
export interface University {
  id: string;
  code: string; // 대학 코드 (예: SNU, YU, KU)
  name: string;
  nameEng: string;
  aliases: string[]; // 약칭들 (예: "서울대", "서대")

  // 분류
  tier: UniversityTier;
  type: UniversityType;
  region: Region;

  // 기본 정보
  established: number; // 설립연도
  website: string;
  admissionWebsite: string;
  phone: string;
  address: string;

  // 통계
  totalStudents?: number;
  facultyCount?: number;
  campusArea?: number; // m²

  // 평가 지표
  rankings?: UniversityRankings;
  reputation?: UniversityReputation;

  // 메타데이터
  logoUrl?: string;
  campusImages?: string[];
  description?: string;
  motto?: string;

  // 시스템 정보
  createdAt: string;
  updatedAt: string;
  dataSource: DataSource[];
  verificationStatus: VerificationStatus;
}

// 대학 순위 정보
export interface UniversityRankings {
  domestic: {
    [rankingName: string]: {
      rank: number;
      year: number;
      total: number; // 전체 평가 대학 수
    };
  };
  international: {
    qs?: RankingInfo;
    times?: RankingInfo;
    arwu?: RankingInfo;
  };
}

export interface RankingInfo {
  rank: number;
  year: number;
  score?: number;
}

// 대학 평판 정보
export interface UniversityReputation {
  academicReputation: number; // 0-100
  employerReputation: number; // 0-100
  researchOutput: number; // 0-100
  studentSatisfaction: number; // 0-100
  internationalOutlook: number; // 0-100

  strengths: string[]; // 강점 분야
  specializations: string[]; // 특화 전공
}

// 데이터 출처
export interface DataSource {
  name: string;
  url?: string;
  type: 'official' | 'government' | 'third_party' | 'user_generated';
  reliability: number; // 0-1
  lastAccessed: string;
}

// 검증 상태
export type VerificationStatus =
  | 'verified'      // 검증 완료
  | 'pending'       // 검증 대기
  | 'partial'       // 부분 검증
  | 'unverified'    // 미검증
  | 'deprecated';   // 폐기됨 (업데이트 필요)

// 학과/전공 정보
export interface Department {
  id: string;
  universityId: string;
  code: string;
  name: string;
  nameEng: string;
  college: string; // 단과대학

  // 분류
  category: DepartmentCategory;
  subcategory?: string;

  // 세부 정보
  description?: string;
  curriculum?: string[];
  degreeType: 'bachelor' | 'master' | 'doctorate' | 'associate';

  // 통계
  studentCount?: number;
  facultyCount?: number;

  // 취업 정보
  employmentRate?: number;
  averageSalary?: number;
  majorEmployers?: string[];

  // 메타데이터
  website?: string;
  establishedYear?: number;
  accreditation?: string[];

  createdAt: string;
  updatedAt: string;
}

// 학과 카테고리
export type DepartmentCategory =
  | 'humanities'           // 인문
  | 'social_science'       // 사회
  | 'natural_science'      // 자연
  | 'engineering'          // 공학
  | 'medicine'             // 의학
  | 'arts'                 // 예체능
  | 'education'            // 교육
  | 'business'             // 경영/경제
  | 'law'                  // 법학
  | 'interdisciplinary';   // 융합

// 대학 검색 필터
export interface UniversityFilter {
  tier?: UniversityTier[];
  type?: UniversityType[];
  region?: Region[];
  hasEssayExam?: boolean;
  minStudents?: number;
  maxStudents?: number;
  keywords?: string[];

  // 정렬
  sortBy?: 'name' | 'rank' | 'students' | 'reputation';
  sortOrder?: 'asc' | 'desc';

  // 페이지네이션
  page?: number;
  limit?: number;
}

// 대학 통계 집계
export interface UniversityStatistics {
  totalUniversities: number;
  byTier: Record<UniversityTier, number>;
  byType: Record<UniversityType, number>;
  byRegion: Record<Region, number>;
  withEssayExam: number;

  // 평균 지표
  averageStudents: number;
  averageReputation: number;

  // 시간대별 통계
  updatedToday: number;
  updatedThisWeek: number;
  updatedThisMonth: number;
  needsUpdate: number;
}
