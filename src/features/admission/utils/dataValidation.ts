/**
 * Data Validation Utilities
 * 데이터 검증 유틸리티
 */

import type {
  University,
  AdmissionInfo,
  EssayQuestion,
  ValidationError,
  DataQualityMetrics,
  QualityReport,
  QualityDimension,
} from '../types';

/**
 * 대학 데이터 검증
 */
export function validateUniversity(university: Partial<University>): ValidationError[] {
  const errors: ValidationError[] = [];

  // 필수 필드 검증
  if (!university.id) {
    errors.push({
      field: 'id',
      error: 'ID is required',
      severity: 'error',
    });
  }

  if (!university.code) {
    errors.push({
      field: 'code',
      error: 'Code is required',
      severity: 'error',
    });
  }

  if (!university.name) {
    errors.push({
      field: 'name',
      error: 'Name is required',
      severity: 'error',
    });
  }

  if (!university.tier) {
    errors.push({
      field: 'tier',
      error: 'Tier is required',
      severity: 'error',
    });
  }

  if (!university.type) {
    errors.push({
      field: 'type',
      error: 'Type is required',
      severity: 'error',
    });
  }

  if (!university.region) {
    errors.push({
      field: 'region',
      error: 'Region is required',
      severity: 'error',
    });
  }

  // 포맷 검증
  if (university.website && !isValidUrl(university.website)) {
    errors.push({
      field: 'website',
      error: 'Invalid URL format',
      severity: 'warning',
      suggestion: 'URL should start with http:// or https://',
    });
  }

  if (university.phone && !isValidPhone(university.phone)) {
    errors.push({
      field: 'phone',
      error: 'Invalid phone number format',
      severity: 'warning',
      suggestion: 'Phone should be in format: 02-1234-5678',
    });
  }

  // 논리적 검증
  if (university.established && university.established > new Date().getFullYear()) {
    errors.push({
      field: 'established',
      error: 'Established year cannot be in the future',
      severity: 'error',
    });
  }

  return errors;
}

/**
 * 입시요강 데이터 검증
 */
export function validateAdmission(admission: Partial<AdmissionInfo>): ValidationError[] {
  const errors: ValidationError[] = [];

  // 필수 필드
  if (!admission.id) {
    errors.push({
      field: 'id',
      error: 'ID is required',
      severity: 'error',
    });
  }

  if (!admission.universityId) {
    errors.push({
      field: 'universityId',
      error: 'University ID is required',
      severity: 'error',
    });
  }

  if (!admission.academicYear) {
    errors.push({
      field: 'academicYear',
      error: 'Academic year is required',
      severity: 'error',
    });
  }

  if (!admission.admissionTypes || admission.admissionTypes.length === 0) {
    errors.push({
      field: 'admissionTypes',
      error: 'At least one admission type is required',
      severity: 'error',
    });
  }

  // 전형별 검증
  admission.admissionTypes?.forEach((type, index) => {
    if (!type.name) {
      errors.push({
        field: `admissionTypes[${index}].name`,
        error: 'Admission type name is required',
        severity: 'error',
      });
    }

    if (type.quota.total < 0) {
      errors.push({
        field: `admissionTypes[${index}].quota.total`,
        error: 'Quota cannot be negative',
        severity: 'error',
      });
    }

    if (type.applicationFee < 0) {
      errors.push({
        field: `admissionTypes[${index}].applicationFee`,
        error: 'Application fee cannot be negative',
        severity: 'error',
      });
    }
  });

  // 날짜 검증
  if (admission.publishedDate && !isValidDate(admission.publishedDate)) {
    errors.push({
      field: 'publishedDate',
      error: 'Invalid date format',
      severity: 'error',
      suggestion: 'Use ISO 8601 format (YYYY-MM-DD)',
    });
  }

  return errors;
}

/**
 * 논술 문제 데이터 검증
 */
export function validateQuestion(question: Partial<EssayQuestion>): ValidationError[] {
  const errors: ValidationError[] = [];

  // 필수 필드
  if (!question.id) {
    errors.push({
      field: 'id',
      error: 'ID is required',
      severity: 'error',
    });
  }

  if (!question.universityId) {
    errors.push({
      field: 'universityId',
      error: 'University ID is required',
      severity: 'error',
    });
  }

  if (!question.academicYear) {
    errors.push({
      field: 'academicYear',
      error: 'Academic year is required',
      severity: 'error',
    });
  }

  if (!question.examDate) {
    errors.push({
      field: 'examDate',
      error: 'Exam date is required',
      severity: 'error',
    });
  }

  if (!question.category) {
    errors.push({
      field: 'category',
      error: 'Category is required',
      severity: 'error',
    });
  }

  // 문제 내용 검증
  if (!question.content) {
    errors.push({
      field: 'content',
      error: 'Question content is required',
      severity: 'error',
    });
  } else {
    if (!question.content.prompt) {
      errors.push({
        field: 'content.prompt',
        error: 'Question prompt is required',
        severity: 'error',
      });
    }

    if (!question.content.materials || question.content.materials.length === 0) {
      errors.push({
        field: 'content.materials',
        error: 'At least one material is recommended',
        severity: 'warning',
      });
    }

    if (!question.content.subQuestions || question.content.subQuestions.length === 0) {
      errors.push({
        field: 'content.subQuestions',
        error: 'At least one sub-question is required',
        severity: 'error',
      });
    }

    if (!question.content.constraints?.timeLimit) {
      errors.push({
        field: 'content.constraints.timeLimit',
        error: 'Time limit is required',
        severity: 'error',
      });
    }
  }

  // 난이도 검증
  if (question.difficulty) {
    const validDifficulties = ['very_easy', 'easy', 'medium', 'hard', 'very_hard'];
    if (!validDifficulties.includes(question.difficulty)) {
      errors.push({
        field: 'difficulty',
        error: 'Invalid difficulty level',
        severity: 'error',
        suggestion: `Must be one of: ${validDifficulties.join(', ')}`,
      });
    }
  }

  // 품질 점수 검증
  if (question.qualityScore !== undefined) {
    if (question.qualityScore < 0 || question.qualityScore > 100) {
      errors.push({
        field: 'qualityScore',
        error: 'Quality score must be between 0 and 100',
        severity: 'error',
      });
    }
  }

  return errors;
}

/**
 * 데이터 품질 메트릭 계산
 */
export function calculateDataQuality(data: any, requiredFields: string[]): DataQualityMetrics {
  const errors: ValidationError[] = [];
  const missingFields: string[] = [];

  // 완전성 검사
  let presentFields = 0;
  requiredFields.forEach(field => {
    if (getNestedValue(data, field) !== undefined) {
      presentFields++;
    } else {
      missingFields.push(field);
      errors.push({
        field,
        error: 'Field is missing',
        severity: 'warning',
      });
    }
  });

  const completeness = presentFields / requiredFields.length;

  // 정확성 (검증 오류 기반)
  const criticalErrors = errors.filter(e => e.severity === 'error').length;
  const accuracy = Math.max(0, 1 - criticalErrors / 10);

  // 시의성 (업데이트 날짜 기반)
  const lastUpdate = data.updatedAt || data.createdAt;
  const daysSinceUpdate = lastUpdate
    ? (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
    : 999;
  const timeliness = Math.max(0, 1 - daysSinceUpdate / 365);

  // 일관성 (항상 1로 가정, 실제로는 더 복잡한 검증 필요)
  const consistency = 1;

  return {
    completeness,
    accuracy,
    timeliness,
    consistency,
    missingFields,
    lastValidation: new Date().toISOString(),
    validationErrors: errors,
  };
}

/**
 * 품질 리포트 생성
 */
export function generateQualityReport(
  data: any[],
  type: 'university' | 'admission' | 'question'
): QualityReport {
  const allMetrics = data.map(item => {
    let requiredFields: string[] = [];

    switch (type) {
      case 'university':
        requiredFields = ['id', 'code', 'name', 'tier', 'type', 'region', 'website'];
        break;
      case 'admission':
        requiredFields = ['id', 'universityId', 'academicYear', 'admissionTypes'];
        break;
      case 'question':
        requiredFields = [
          'id',
          'universityId',
          'academicYear',
          'content',
          'difficulty',
        ];
        break;
    }

    return calculateDataQuality(item, requiredFields);
  });

  // 평균 계산
  const avgCompleteness =
    allMetrics.reduce((sum, m) => sum + m.completeness, 0) / allMetrics.length;
  const avgAccuracy =
    allMetrics.reduce((sum, m) => sum + m.accuracy, 0) / allMetrics.length;
  const avgTimeliness =
    allMetrics.reduce((sum, m) => sum + m.timeliness, 0) / allMetrics.length;
  const avgConsistency =
    allMetrics.reduce((sum, m) => sum + m.consistency, 0) / allMetrics.length;

  const overallScore =
    (avgCompleteness * 0.3 +
      avgAccuracy * 0.4 +
      avgTimeliness * 0.2 +
      avgConsistency * 0.1) *
    100;

  // 문제 수집
  const issues: QualityReport['issues'] = [];
  allMetrics.forEach((metrics) => {
    metrics.validationErrors.forEach(error => {
      issues.push({
        severity: error.severity === 'error' ? 'critical' : 'minor',
        category: type,
        description: `${error.field}: ${error.error}`,
        affectedRecords: 1,
        suggestedFix: error.suggestion,
      });
    });
  });

  // 차원별 점수
  const dimensions = {
    completeness: createQualityDimension(avgCompleteness * 100, 'Completeness'),
    accuracy: createQualityDimension(avgAccuracy * 100, 'Accuracy'),
    consistency: createQualityDimension(avgConsistency * 100, 'Consistency'),
    timeliness: createQualityDimension(avgTimeliness * 100, 'Timeliness'),
    validity: createQualityDimension(90, 'Validity'), // 고정값, 실제로는 계산 필요
  };

  return {
    overallScore,
    dimensions,
    issues: aggregateIssues(issues),
    timestamp: new Date().toISOString(),
  };
}

/**
 * 품질 차원 생성
 */
function createQualityDimension(score: number, name: string): QualityDimension {
  let status: QualityDimension['status'];
  if (score >= 90) status = 'excellent';
  else if (score >= 75) status = 'good';
  else if (score >= 60) status = 'fair';
  else status = 'poor';

  return {
    score,
    status,
    details: `${name} score is ${score.toFixed(1)}%`,
    improvements:
      score < 90
        ? [`Improve ${name.toLowerCase()} to reach excellent status`]
        : undefined,
  };
}

/**
 * 이슈 집계
 */
function aggregateIssues(
  issues: QualityReport['issues']
): QualityReport['issues'] {
  const grouped = new Map<string, QualityReport['issues'][0]>();

  issues.forEach(issue => {
    const key = `${issue.category}-${issue.description}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.affectedRecords++;
    } else {
      grouped.set(key, { ...issue });
    }
  });

  return Array.from(grouped.values());
}

/**
 * 헬퍼 함수
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidPhone(phone: string): boolean {
  // 한국 전화번호 형식: 02-1234-5678, 031-123-4567 등
  return /^\d{2,3}-\d{3,4}-\d{4}$/.test(phone);
}

function isValidDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
