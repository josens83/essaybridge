import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiUsers, FiClock, FiFilter } from 'react-icons/fi';
import { sampleCourses } from '../data/sampleData';
import type { CourseLevel, CourseCategory } from '../types';

const Courses = () => {
  const [filter, setFilter] = useState<{
    level?: CourseLevel;
    category?: CourseCategory;
  }>({});

  const filteredCourses = sampleCourses.filter((course) => {
    if (filter.level && course.level !== filter.level) return false;
    if (filter.category && course.category !== filter.category) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">온라인 강의</h1>
          <p className="text-xl text-gray-600">대학별 논술 전략과 실전 기술을 배워보세요</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiFilter className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">필터</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
              <select
                value={filter.level || ''}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    level: e.target.value as CourseLevel || undefined,
                  }))
                }
                className="input-field"
              >
                <option value="">전체</option>
                <option value="beginner">초급</option>
                <option value="intermediate">중급</option>
                <option value="advanced">고급</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select
                value={filter.category || ''}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    category: e.target.value as CourseCategory || undefined,
                  }))
                }
                className="input-field"
              >
                <option value="">전체</option>
                <option value="general">일반 논술</option>
                <option value="university_specific">대학별 논술</option>
                <option value="writing_basics">글쓰기 기초</option>
                <option value="analysis">분석 기법</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
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
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <span className="font-medium text-gray-900">{course.instructor}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium text-gray-900">{course.rating}</span>
                    <span className="ml-1">({course.reviewCount})</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="w-4 h-4 mr-1" />
                    <span>{course.enrolledCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 mr-1" />
                    <span>{Math.floor(course.duration / 60)}시간</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-primary-600">
                    {course.price.toLocaleString()}원
                  </span>
                  <button className="btn-primary text-sm px-4 py-2">수강신청</button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">검색 조건에 맞는 강의가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
