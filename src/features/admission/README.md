# EssayBridge 입시 데이터베이스 시스템

대한민국 최고 수준의 대학 입시 정보 및 논술 기출문제 데이터베이스 시스템입니다.

## 📊 시스템 개요

이 시스템은 EssayBridge가 AI 기반 논술 첨삭 서비스를 제공하기 위해 필요한 모든 입시 관련 데이터를 구조화하고 관리합니다.

### 핵심 기능

1. **대학 정보 관리**
   - 전국 200개 대학 기본 정보
   - 대학별 순위, 평판, 통계
   - 학과/전공 정보

2. **입시요강 데이터**
   - 전형별 상세 정보
   - 모집 인원 및 경쟁률
   - 전형 일정 및 요소
   - 수능 최저학력기준
   - 전년도 입시 결과

3. **논술 기출문제 데이터베이스**
   - 15년치 기출문제 (목표: 50,000문제)
   - 문제 유형 분류 및 분석
   - 난이도 분석
   - 모범답안 및 채점기준
   - 유사 문제 연결

4. **데이터 품질 관리**
   - 자동 검증 시스템
   - 데이터 정규화
   - 중복 제거
   - 버전 관리

## 🏗️ 시스템 구조

```
src/features/admission/
├── types/              # TypeScript 타입 정의
│   ├── university.ts   # 대학 관련 타입
│   ├── admissionData.ts # 입시요강 타입
│   ├── question.ts     # 논술 문제 타입
│   └── index.ts        # 통합 export
├── constants/          # 기준 데이터
│   └── universities.ts # 대학 마스터 데이터
├── services/           # 비즈니스 로직
│   ├── universityService.ts
│   ├── admissionService.ts
│   ├── questionService.ts
│   └── analyticsService.ts
├── models/             # 데이터 모델
├── api/                # API 엔드포인트
├── utils/              # 유틸리티
│   ├── dataValidation.ts
│   ├── normalization.ts
│   └── qualityControl.ts
└── components/         # React 컴포넌트
```

## 📚 타입 시스템

### 1. University Types

```typescript
import type { University, UniversityTier, Region } from './types';

// 대학 정보
const university: University = {
  id: 'univ-snu',
  code: 'SNU',
  name: '서울대학교',
  tier: 'SKY',
  type: 'national',
  region: 'seoul',
  // ... more fields
};
```

### 2. Admission Types

```typescript
import type { AdmissionInfo, AdmissionType } from './types';

// 입시요강
const admissionInfo: AdmissionInfo = {
  universityId: 'univ-snu',
  academicYear: '2025',
  admissionTypes: [
    {
      name: '일반전형',
      type: 'essay',
      method: 'essay_centered',
      // ... more details
    }
  ],
  // ... more fields
};
```

### 3. Question Types

```typescript
import type { EssayQuestion, QuestionContent } from './types';

// 논술 문제
const question: EssayQuestion = {
  id: 'SNU-2024-01-001',
  universityId: 'univ-snu',
  academicYear: '2024',
  content: {
    prompt: '다음 제시문을 읽고 물음에 답하시오.',
    materials: [...],
    subQuestions: [...],
    constraints: {
      timeLimit: 100,
      totalWordLimit: { min: 1000, max: 1200 }
    }
  },
  analysis: {
    types: ['논증형', '비교분석형'],
    requiredSkills: [...],
    difficulty: 'hard'
  },
  // ... more fields
};
```

## 🎯 주요 데이터

### 커버리지 (Current)

- **대학 수**: 30개 (SKY + 상위권 + 거점국립대)
- **입시요강**: 준비 중
- **기출문제**: 준비 중

### 커버리지 (Target)

- **대학 수**: 200개
- **입시요강**: 전국 주요 대학 100% 커버
- **기출문제**: 50,000문제 (15년치)
- **데이터 정확도**: 99.9%
- **업데이트 주기**: 실시간 (<1시간)

## 🔍 사용 예시

### 대학 정보 조회

```typescript
import {
  getUniversityById,
  getUniversitiesByTier,
  hasEssayExam
} from './constants/universities';

// ID로 조회
const snu = getUniversityById('univ-snu');

// 티어별 조회
const skyUniversities = getUniversitiesByTier('SKY');

// 논술 전형 여부 확인
const hasEssay = hasEssayExam('univ-snu'); // true
```

### 데이터 검색

```typescript
import type { UniversityFilter, QuestionFilter } from './types';

// 대학 필터링
const filter: UniversityFilter = {
  tier: ['SKY', 'top15'],
  region: ['seoul'],
  hasEssayExam: true,
  sortBy: 'rank',
  sortOrder: 'asc'
};

// 문제 필터링
const questionFilter: QuestionFilter = {
  universityId: ['univ-snu', 'univ-yonsei'],
  academicYear: ['2024', '2023'],
  difficulty: ['hard', 'very_hard'],
  questionTypes: ['논증형', '비교분석형'],
  sortBy: 'difficulty',
  limit: 20
};
```

## 📈 데이터 품질 지표

### 목표 KPI

```typescript
const qualityKPIs = {
  coverage: {
    universities: 200,
    questions: 50000,
    yearsOfData: 15,
    updateFrequency: 'daily'
  },
  accuracy: {
    factualAccuracy: 0.999,
    updateTimeliness: '<1hour',
    errorRate: '<0.001%'
  },
  completeness: {
    missingData: '<5%',
    metadataQuality: 0.95,
    crossReferences: 0.90
  },
  usability: {
    searchSpeed: '<100ms',
    apiResponseTime: '<200ms',
    userSatisfaction: '>4.8/5'
  }
};
```

## 🚀 로드맵

### Phase 1: 기초 인프라 (완료)
- ✅ TypeScript 타입 시스템 설계
- ✅ 대학 마스터 데이터 정의
- ⏳ 데이터 모델 구현
- ⏳ 품질 관리 시스템

### Phase 2: 데이터 수집 (진행 중)
- ⏳ 대학 공식 데이터 수집
- ⏳ 입시요강 크롤링 시스템
- ⏳ 기출문제 데이터베이스 구축
- ⏳ 실시간 업데이트 시스템

### Phase 3: AI 분석 (계획)
- ⏳ 문제 유형 자동 분류
- ⏳ 난이도 자동 분석
- ⏳ 출제 경향 예측
- ⏳ 개인화 추천 시스템

### Phase 4: API & 통합 (계획)
- ⏳ RESTful API 구현
- ⏳ GraphQL API
- ⏳ 실시간 구독 시스템
- ⏳ 데이터 export/import

## ⚖️ 법적 고려사항

### 저작권
- 대학 기출문제는 각 대학의 저작물입니다
- 공정 이용(Fair Use) 원칙 준수
- 교육 목적 사용
- 출처 명확히 표기

### 데이터 수집
- robots.txt 준수
- Rate limiting 적용
- 서버 부하 최소화
- 이용약관 준수

### 개인정보
- 학생 데이터 익명화
- GDPR/PIPA 준수
- 동의 기반 데이터 수집

## 🔒 데이터 보안

- 저작권 워터마킹
- 접근 제어 (RBAC)
- 암호화 (AES-256)
- 감사 로깅
- DMCA 대응 시스템

## 📝 데이터 출처

### 공식 출처
- 각 대학 입학처 웹사이트
- 대학알리미 (academyinfo.go.kr)
- 대학입학전형위원회
- 한국교육과정평가원

### 검증 프로세스
1. 다중 출처 교차 검증
2. 자동 일관성 검사
3. 전문가 검토 (필요시)
4. 주기적 업데이트 확인

## 🛠️ 개발 가이드

### 새 대학 추가

```typescript
// constants/universities.ts에 추가
export const NEW_UNIVERSITY: Partial<University> = {
  id: 'univ-newuniv',
  code: 'NU',
  name: '새대학교',
  tier: 'in_seoul',
  type: 'private',
  region: 'seoul',
  // ... more fields
};
```

### 새 입시요강 추가

```typescript
const admissionInfo: AdmissionInfo = {
  universityId: 'univ-newuniv',
  academicYear: '2025',
  admissionTypes: [...],
  schedule: {...},
  // ... more fields
};
```

### 새 문제 추가

```typescript
const question: EssayQuestion = {
  id: 'NU-2024-01-001',
  universityId: 'univ-newuniv',
  academicYear: '2024',
  content: {...},
  analysis: {...},
  // ... more fields
};
```

## 📊 모니터링 & 알림

### 실시간 모니터링
- 데이터 변경 감지
- 입시요강 업데이트 알림
- 경쟁률 실시간 추적
- 오류 자동 감지

### 알림 우선순위
- **Critical**: 입시요강 변경
- **High**: 경쟁률 업데이트, 일정 변경
- **Medium**: 새 기출문제
- **Low**: 일반 업데이트

## 🤝 기여 가이드

### 데이터 기여
1. 정확한 출처 제공
2. 검증 가능한 정보
3. 타입 시스템 준수
4. 품질 기준 충족

### 코드 기여
1. TypeScript 사용
2. ESLint 규칙 준수
3. 단위 테스트 작성
4. 문서화 업데이트

## 📞 문의

- 기술 문의: [GitHub Issues](https://github.com/josens83/essaybridge/issues)
- 데이터 제공/수정: admission-data@essaybridge.com
- 법적 문의: legal@essaybridge.com

## 📄 라이선스

이 프로젝트의 코드는 MIT 라이선스를 따르지만, 데이터는 각 원저작권자의 권리를 존중합니다.

---

**Made with ❤️ by EssayBridge Team**

*"대한민국 모든 학생들이 공정하고 정확한 입시 정보에 접근할 수 있도록"*
