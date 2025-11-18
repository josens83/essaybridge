import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiStar,
  FiUsers,
  FiClock,
  FiPlay,
  FiCheck,
  FiLock,
} from 'react-icons/fi';
import { sampleCourses } from '../../../data/sampleData';
import { useAuth } from '../../auth';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const course = sampleCourses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">강의를 찾을 수 없습니다</h2>
          <button onClick={() => navigate('/courses')} className="btn-primary mt-4">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEnrolling(false);
    alert('수강 신청이 완료되었습니다!');
  };

  const isEnrolled = true; // Mock enrolled status
  const progress = 30; // Mock progress

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 dark:from-primary-800 dark:to-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center text-primary-100 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            강의 목록
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.level === 'beginner'
                      ? 'bg-green-500 text-white'
                      : course.level === 'intermediate'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {course.level === 'beginner'
                    ? '초급'
                    : course.level === 'intermediate'
                    ? '중급'
                    : '고급'}
                </span>
                {course.universities.map((univ) => (
                  <span
                    key={univ}
                    className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-medium"
                  >
                    {univ}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-primary-100 mb-6">{course.description}</p>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <FiStar className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-primary-200 ml-1">({course.reviewCount}개 평가)</span>
                </div>
                <div className="flex items-center text-primary-100">
                  <FiUsers className="w-5 h-5 mr-1" />
                  <span>{course.enrolledCount.toLocaleString()}명 수강</span>
                </div>
                <div className="flex items-center text-primary-100">
                  <FiClock className="w-5 h-5 mr-1" />
                  <span>{Math.floor(course.duration / 60)}시간</span>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">{course.instructor[0]}</span>
                </div>
                <div>
                  <p className="text-sm text-primary-200">강사</p>
                  <p className="font-semibold">{course.instructor}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-gray-900 dark:text-gray-100 transition-colors">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {course.price.toLocaleString()}원
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">또는 구독 플랜으로 무제한 수강</p>
                </div>

                {isEnrolled ? (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">진도율</span>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <button className="w-full btn-primary mb-3">학습 계속하기</button>
                    <button className="w-full btn-outline text-sm">수료증 받기</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full btn-primary mb-3 disabled:opacity-50"
                    >
                      {enrolling ? '신청 중...' : '수강 신청'}
                    </button>
                    <button className="w-full btn-outline text-sm">샘플 강의 보기</button>
                  </>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">이 강의에 포함된 내용</p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <FiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <span>총 {course.lessons.length}개 강의</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <span>무제한 반복 수강</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <span>강의 자료 다운로드</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <span>수료증 발급</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">학습 내용</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  '논술의 기본 구조와 전개 방법',
                  '제시문 분석 및 해석 능력',
                  '논리적 사고와 비판적 글쓰기',
                  '실전 기출 문제 풀이',
                  '시간 관리 및 답안 작성 전략',
                  '첨삭을 통한 실력 향상',
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <FiCheck className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">강의 소개</h2>
              <div className="prose max-w-none text-gray-700 dark:text-gray-300">
                <p className="mb-4">
                  본 강의는 {course.universities.join(', ')} 논술 전형을 준비하는 수험생을 위한
                  실전 대비 강의입니다. 최근 3개년 기출문제를 철저히 분석하여 출제 경향을
                  파악하고, 고득점을 위한 실전 전략을 제시합니다.
                </p>
                <p className="mb-4">
                  논술의 기초부터 시작하여 고급 작성 기법까지 단계별로 학습할 수 있으며, 실제
                  기출문제를 통한 실전 연습으로 실력을 향상시킬 수 있습니다.
                </p>
                <p>
                  10년 이상의 논술 지도 경험을 가진 전문 강사가 직접 강의하며, 수강생 개개인의
                  수준에 맞춘 맞춤형 피드백을 제공합니다.
                </p>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">강사 소개</h2>
              <div className="flex items-start">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-3xl text-primary-600 dark:text-primary-400 font-semibold">
                    {course.instructor[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {course.instructor}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">논술 전문 강사 · 입시 컨설턴트</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    서울대 인문계열 출신으로 10년 이상 논술 지도 경력을 보유하고 있습니다. 매년
                    100명 이상의 학생을 SKY 대학에 합격시킨 검증된 강의력으로, 체계적이고
                    실전적인 논술 학습을 제공합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                수강생 리뷰 ({course.reviewCount})
              </h2>

              <div className="flex items-center mb-6">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mr-4">{course.rating}</div>
                <div>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(course.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">평균 평점</p>
                </div>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-gray-200 dark:border-gray-700 pt-6 first:border-0 first:pt-0">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">수강생{i}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, j) => (
                            <FiStar
                              key={j}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      강의 내용이 체계적이고 이해하기 쉬워요. 실전 문제 풀이가 특히
                      도움이 되었습니다!
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Curriculum Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow sticky top-24 transition-colors">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">커리큘럼</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {course.lessons.length}개 강의 · {Math.floor(course.duration / 60)}시간
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {course.lessons.map((lesson, index) => {
                  const isLocked = !isEnrolled && index > 0;
                  const isCompleted = isEnrolled && index < 1;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => !isLocked && setSelectedLesson(lesson.id)}
                      disabled={isLocked}
                      className={`w-full p-4 text-left border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                        selectedLesson === lesson.id ? 'bg-primary-50 dark:bg-primary-900/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            {isCompleted ? (
                              <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                            ) : isLocked ? (
                              <FiLock className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
                            ) : (
                              <FiPlay className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                            )}
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {index + 1}. {lesson.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 ml-7 mb-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-7">
                            <FiClock className="w-3 h-3 mr-1" />
                            <span>{lesson.duration}분</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
