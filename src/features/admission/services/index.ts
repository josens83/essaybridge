/**
 * Services Index
 * 모든 서비스 통합 export
 */

import { universityService as univService } from './UniversityService';
import { admissionService as admService } from './AdmissionService';
import { questionService as qService } from './QuestionService';

export { UniversityService, universityService } from './UniversityService';
export { AdmissionService, admissionService } from './AdmissionService';
export { QuestionService, questionService } from './QuestionService';

// 모든 서비스를 하나의 객체로 export
export const admissionServices = {
  university: univService,
  admission: admService,
  question: qService,
};
