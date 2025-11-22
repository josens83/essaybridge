/**
 * University Master Data
 * 대학 기본 정보 상수 정의
 *
 * 데이터 출처:
 * - 각 대학 공식 웹사이트
 * - 대학알리미 (academyinfo.go.kr)
 * - 대학입학전형위원회
 */

import type { University, UniversityTier, Region } from '../types';

// SKY 대학 (Tier 1)
export const SKY_UNIVERSITIES: Partial<University>[] = [
  {
    id: 'univ-snu',
    code: 'SNU',
    name: '서울대학교',
    nameEng: 'Seoul National University',
    aliases: ['서울대', '서대', 'SNU'],
    tier: 'SKY',
    type: 'national',
    region: 'seoul',
    established: 1946,
    website: 'https://www.snu.ac.kr',
    admissionWebsite: 'https://admission.snu.ac.kr',
    phone: '02-880-5114',
    address: '서울특별시 관악구 관악로 1',
    description: '대한민국 최고의 국립종합대학교',
    motto: '진리는 나의 빛',
  },
  {
    id: 'univ-yonsei',
    code: 'YU',
    name: '연세대학교',
    nameEng: 'Yonsei University',
    aliases: ['연세대', '연대', 'YU', 'Yonsei'],
    tier: 'SKY',
    type: 'private',
    region: 'seoul',
    established: 1885,
    website: 'https://www.yonsei.ac.kr',
    admissionWebsite: 'https://admission.yonsei.ac.kr',
    phone: '02-2123-2000',
    address: '서울특별시 서대문구 연세로 50',
    description: '대한민국 최초의 근대 대학',
    motto: '진리가 너희를 자유케 하리라',
  },
  {
    id: 'univ-korea',
    code: 'KU',
    name: '고려대학교',
    nameEng: 'Korea University',
    aliases: ['고려대', '고대', 'KU'],
    tier: 'SKY',
    type: 'private',
    region: 'seoul',
    established: 1905,
    website: 'https://www.korea.ac.kr',
    admissionWebsite: 'https://admission.korea.ac.kr',
    phone: '02-3290-1114',
    address: '서울특별시 성북구 안암로 145',
    description: '민족고등교육의 산실',
    motto: '자유, 정의, 진리',
  },
];

// 상위 15개 대학 (Tier 2)
export const TOP15_UNIVERSITIES: Partial<University>[] = [
  {
    id: 'univ-skku',
    code: 'SKKU',
    name: '성균관대학교',
    nameEng: 'Sungkyunkwan University',
    aliases: ['성균관대', '성대', 'SKKU'],
    tier: 'top15',
    type: 'private',
    region: 'seoul',
    established: 1398,
    website: 'https://www.skku.edu',
    admissionWebsite: 'https://admission.skku.edu',
    phone: '02-760-1114',
    address: '서울특별시 종로구 성균관로 25-2',
    description: '600년 역사의 명문대학',
  },
  {
    id: 'univ-sogang',
    code: 'SG',
    name: '서강대학교',
    nameEng: 'Sogang University',
    aliases: ['서강대', '서강', 'SG'],
    tier: 'top15',
    type: 'private',
    region: 'seoul',
    established: 1960,
    website: 'https://www.sogang.ac.kr',
    admissionWebsite: 'https://admission.sogang.ac.kr',
    phone: '02-705-8114',
    address: '서울특별시 마포구 백범로 35',
  },
  {
    id: 'univ-hanyang',
    code: 'HY',
    name: '한양대학교',
    nameEng: 'Hanyang University',
    aliases: ['한양대', '한대', 'HY'],
    tier: 'top15',
    type: 'private',
    region: 'seoul',
    established: 1939,
    website: 'https://www.hanyang.ac.kr',
    admissionWebsite: 'https://admission.hanyang.ac.kr',
    phone: '02-2220-0114',
    address: '서울특별시 성동구 왕십리로 222',
    description: '사랑의 실천을 통한 인재 양성',
  },
  {
    id: 'univ-cau',
    code: 'CAU',
    name: '중앙대학교',
    nameEng: 'Chung-Ang University',
    aliases: ['중앙대', '중대', 'CAU'],
    tier: 'top15',
    type: 'private',
    region: 'seoul',
    established: 1918,
    website: 'https://www.cau.ac.kr',
    admissionWebsite: 'https://admission.cau.ac.kr',
    phone: '02-820-5114',
    address: '서울특별시 동작구 흑석로 84',
  },
  {
    id: 'univ-khu',
    code: 'KHU',
    name: '경희대학교',
    nameEng: 'Kyung Hee University',
    aliases: ['경희대', 'KHU'],
    tier: 'top15',
    type: 'private',
    region: 'seoul',
    established: 1949,
    website: 'https://www.khu.ac.kr',
    admissionWebsite: 'https://admission.khu.ac.kr',
    phone: '02-961-0114',
    address: '서울특별시 동대문구 경희대로 26',
    description: '문화세계의 창조',
  },
  {
    id: 'univ-hufs',
    code: 'HUFS',
    name: '한국외국어대학교',
    nameEng: 'Hankuk University of Foreign Studies',
    aliases: ['한국외대', '외대', 'HUFS'],
    tier: 'top15',
    type: 'private',
    region: 'seoul',
    established: 1954,
    website: 'https://www.hufs.ac.kr',
    admissionWebsite: 'https://admission.hufs.ac.kr',
    phone: '02-2173-2114',
    address: '서울특별시 동대문구 이문로 107',
  },
  {
    id: 'univ-uos',
    code: 'UOS',
    name: '서울시립대학교',
    nameEng: 'University of Seoul',
    aliases: ['서울시립대', '시립대', 'UOS'],
    tier: 'top15',
    type: 'public',
    region: 'seoul',
    established: 1918,
    website: 'https://www.uos.ac.kr',
    admissionWebsite: 'https://admission.uos.ac.kr',
    phone: '02-6490-6114',
    address: '서울특별시 동대문구 서울시립대로 163',
    description: '진리·창조·봉사',
  },
  {
    id: 'univ-konkuk',
    code: 'KKU',
    name: '건국대학교',
    nameEng: 'Konkuk University',
    aliases: ['건국대', '건대', 'KKU'],
    tier: 'top15',
    type: 'private',
    region: 'seoul',
    established: 1946,
    website: 'https://www.konkuk.ac.kr',
    admissionWebsite: 'https://admission.konkuk.ac.kr',
    phone: '02-450-3114',
    address: '서울특별시 광진구 능동로 120',
  },
  {
    id: 'univ-dongguk',
    code: 'DGU',
    name: '동국대학교',
    nameEng: 'Dongguk University',
    aliases: ['동국대', 'DGU'],
    tier: 'top15',
    type: 'private',
    region: 'seoul',
    established: 1906,
    website: 'https://www.dongguk.edu',
    admissionWebsite: 'https://admission.dongguk.edu',
    phone: '02-2260-3114',
    address: '서울특별시 중구 필동로 1길 30',
  },
  {
    id: 'univ-hongik',
    code: 'HIU',
    name: '홍익대학교',
    nameEng: 'Hongik University',
    aliases: ['홍익대', '홍대', 'HIU'],
    tier: 'top15',
    type: 'private',
    region: 'seoul',
    established: 1946,
    website: 'https://www.hongik.ac.kr',
    admissionWebsite: 'https://admission.hongik.ac.kr',
    phone: '02-320-1114',
    address: '서울특별시 마포구 와우산로 94',
    description: '홍익인간의 이념',
  },
];

// 인서울 주요 대학 (Tier 3)
export const IN_SEOUL_UNIVERSITIES: Partial<University>[] = [
  {
    id: 'univ-sookmyung',
    code: 'SMU',
    name: '숙명여자대학교',
    nameEng: 'Sookmyung Women\'s University',
    aliases: ['숙명여대', '숙대', 'SMU'],
    tier: 'in_seoul',
    type: 'private',
    region: 'seoul',
    established: 1906,
    website: 'https://www.sookmyung.ac.kr',
    admissionWebsite: 'https://admission.sookmyung.ac.kr',
    phone: '02-2077-7000',
    address: '서울특별시 용산구 청파로47길 100',
  },
  {
    id: 'univ-sejong',
    code: 'SJU',
    name: '세종대학교',
    nameEng: 'Sejong University',
    aliases: ['세종대', 'SJU'],
    tier: 'in_seoul',
    type: 'private',
    region: 'seoul',
    established: 1940,
    website: 'https://www.sejong.ac.kr',
    admissionWebsite: 'https://admission.sejong.ac.kr',
    phone: '02-3408-3114',
    address: '서울특별시 광진구 능동로 209',
  },
  {
    id: 'univ-dankook',
    code: 'DKU',
    name: '단국대학교',
    nameEng: 'Dankook University',
    aliases: ['단국대', 'DKU'],
    tier: 'in_seoul',
    type: 'private',
    region: 'gyeonggi',
    established: 1947,
    website: 'https://www.dankook.ac.kr',
    admissionWebsite: 'https://admission.dankook.ac.kr',
    phone: '031-8005-2114',
    address: '경기도 용인시 수지구 죽전로 152',
  },
];

// 지방 거점 국립대 (Regional Flagship)
export const REGIONAL_FLAGSHIP_UNIVERSITIES: Partial<University>[] = [
  {
    id: 'univ-pusan',
    code: 'PNU',
    name: '부산대학교',
    nameEng: 'Pusan National University',
    aliases: ['부산대', 'PNU'],
    tier: 'regional_flagship',
    type: 'national',
    region: 'busan',
    established: 1946,
    website: 'https://www.pusan.ac.kr',
    admissionWebsite: 'https://admission.pusan.ac.kr',
    phone: '051-510-1000',
    address: '부산광역시 금정구 부산대학로63번길 2',
    description: '지역과 함께하는 글로벌 리더',
  },
  {
    id: 'univ-knu',
    code: 'KNU',
    name: '경북대학교',
    nameEng: 'Kyungpook National University',
    aliases: ['경북대', 'KNU'],
    tier: 'regional_flagship',
    type: 'national',
    region: 'daegu',
    established: 1946,
    website: 'https://www.knu.ac.kr',
    admissionWebsite: 'https://admission.knu.ac.kr',
    phone: '053-950-5114',
    address: '대구광역시 북구 대학로 80',
  },
  {
    id: 'univ-jnu',
    code: 'JNU',
    name: '전남대학교',
    nameEng: 'Chonnam National University',
    aliases: ['전남대', 'JNU'],
    tier: 'regional_flagship',
    type: 'national',
    region: 'gwangju',
    established: 1952,
    website: 'https://www.jnu.ac.kr',
    admissionWebsite: 'https://admission.jnu.ac.kr',
    phone: '062-530-5114',
    address: '광주광역시 북구 용봉로 77',
  },
  {
    id: 'univ-cnu',
    code: 'CNU',
    name: '충남대학교',
    nameEng: 'Chungnam National University',
    aliases: ['충남대', 'CNU'],
    tier: 'regional_flagship',
    type: 'national',
    region: 'daejeon',
    established: 1952,
    website: 'https://www.cnu.ac.kr',
    admissionWebsite: 'https://admission.cnu.ac.kr',
    phone: '042-821-5114',
    address: '대전광역시 유성구 대학로 99',
  },
  {
    id: 'univ-jbnu',
    code: 'JBNU',
    name: '전북대학교',
    nameEng: 'Jeonbuk National University',
    aliases: ['전북대', 'JBNU'],
    tier: 'regional_flagship',
    type: 'national',
    region: 'jeonbuk',
    established: 1947,
    website: 'https://www.jbnu.ac.kr',
    admissionWebsite: 'https://admission.jbnu.ac.kr',
    phone: '063-270-2114',
    address: '전북특별자치도 전주시 덕진구 백제대로 567',
  },
];

// 모든 대학 통합
export const ALL_UNIVERSITIES = [
  ...SKY_UNIVERSITIES,
  ...TOP15_UNIVERSITIES,
  ...IN_SEOUL_UNIVERSITIES,
  ...REGIONAL_FLAGSHIP_UNIVERSITIES,
];

// 대학 코드 to ID 매핑
export const UNIVERSITY_CODE_MAP = ALL_UNIVERSITIES.reduce((map, univ) => {
  if (univ.code) {
    map[univ.code] = univ.id!;
  }
  return map;
}, {} as Record<string, string>);

// 대학 이름 정규화 매핑
export const UNIVERSITY_NAME_NORMALIZATION: Record<string, string> = {
  // 서울대
  '서울대': 'univ-snu',
  '서대': 'univ-snu',
  'SNU': 'univ-snu',
  '서울대학교': 'univ-snu',

  // 연세대
  '연세대': 'univ-yonsei',
  '연대': 'univ-yonsei',
  'YU': 'univ-yonsei',
  '연세대학교': 'univ-yonsei',
  'Yonsei': 'univ-yonsei',

  // 고려대
  '고려대': 'univ-korea',
  '고대': 'univ-korea',
  'KU': 'univ-korea',
  '고려대학교': 'univ-korea',

  // 성균관대
  '성균관대': 'univ-skku',
  '성대': 'univ-skku',
  'SKKU': 'univ-skku',
  '성균관대학교': 'univ-skku',

  // 서강대
  '서강대': 'univ-sogang',
  '서강': 'univ-sogang',
  'SG': 'univ-sogang',
  '서강대학교': 'univ-sogang',

  // 한양대
  '한양대': 'univ-hanyang',
  '한대': 'univ-hanyang',
  'HY': 'univ-hanyang',
  '한양대학교': 'univ-hanyang',

  // 중앙대
  '중앙대': 'univ-cau',
  '중대': 'univ-cau',
  'CAU': 'univ-cau',
  '중앙대학교': 'univ-cau',

  // 경희대
  '경희대': 'univ-khu',
  'KHU': 'univ-khu',
  '경희대학교': 'univ-khu',

  // 한국외대
  '한국외대': 'univ-hufs',
  '외대': 'univ-hufs',
  'HUFS': 'univ-hufs',
  '한국외국어대학교': 'univ-hufs',

  // 서울시립대
  '서울시립대': 'univ-uos',
  '시립대': 'univ-uos',
  'UOS': 'univ-uos',
  '서울시립대학교': 'univ-uos',
};

// 지역별 대학 그룹
export const UNIVERSITIES_BY_REGION: Record<Region, string[]> = {
  seoul: [
    'univ-snu', 'univ-yonsei', 'univ-korea', 'univ-skku', 'univ-sogang',
    'univ-hanyang', 'univ-cau', 'univ-khu', 'univ-hufs', 'univ-uos',
    'univ-konkuk', 'univ-dongguk', 'univ-hongik', 'univ-sookmyung', 'univ-sejong',
  ],
  busan: ['univ-pusan'],
  daegu: ['univ-knu'],
  daejeon: ['univ-cnu'],
  gwangju: ['univ-jnu'],
  jeonbuk: ['univ-jbnu'],
  gyeonggi: ['univ-dankook'],
  // 다른 지역들은 필요시 추가
  incheon: [],
  ulsan: [],
  sejong: [],
  gangwon: [],
  chungbuk: [],
  chungnam: [],
  jeonnam: [],
  gyeongbuk: [],
  gyeongnam: [],
  jeju: [],
};

// 티어별 대학 그룹
export const UNIVERSITIES_BY_TIER: Record<UniversityTier, string[]> = {
  SKY: ['univ-snu', 'univ-yonsei', 'univ-korea'],
  top15: [
    'univ-skku', 'univ-sogang', 'univ-hanyang', 'univ-cau', 'univ-khu',
    'univ-hufs', 'univ-uos', 'univ-konkuk', 'univ-dongguk', 'univ-hongik',
  ],
  in_seoul: ['univ-sookmyung', 'univ-sejong', 'univ-dankook'],
  regional_flagship: ['univ-pusan', 'univ-knu', 'univ-jnu', 'univ-cnu', 'univ-jbnu'],
  regional: [],
  specialized: [],
};

// 논술 전형이 있는 대학 목록 (2024학년도 기준)
export const UNIVERSITIES_WITH_ESSAY_EXAM = [
  'univ-snu',
  'univ-yonsei',
  'univ-korea',
  'univ-skku',
  'univ-sogang',
  'univ-hanyang',
  'univ-cau',
  'univ-khu',
  'univ-hufs',
  'univ-uos',
  'univ-konkuk',
  'univ-dongguk',
  'univ-hongik',
  'univ-sookmyung',
  'univ-sejong',
];

// 헬퍼 함수들
export function getUniversityById(id: string): Partial<University> | undefined {
  return ALL_UNIVERSITIES.find(u => u.id === id);
}

export function getUniversityByCode(code: string): Partial<University> | undefined {
  return ALL_UNIVERSITIES.find(u => u.code === code);
}

export function normalizeUniversityName(name: string): string | undefined {
  return UNIVERSITY_NAME_NORMALIZATION[name];
}

export function getUniversitiesByTier(tier: UniversityTier): Partial<University>[] {
  const ids = UNIVERSITIES_BY_TIER[tier] || [];
  return ids.map(id => getUniversityById(id)).filter(Boolean) as Partial<University>[];
}

export function getUniversitiesByRegion(region: Region): Partial<University>[] {
  const ids = UNIVERSITIES_BY_REGION[region] || [];
  return ids.map(id => getUniversityById(id)).filter(Boolean) as Partial<University>[];
}

export function hasEssayExam(universityId: string): boolean {
  return UNIVERSITIES_WITH_ESSAY_EXAM.includes(universityId);
}
