import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFileText, FiBook, FiMessageSquare } from 'react-icons/fi';
import { sampleCourses, samplePosts } from '../data/sampleData';
import type { Course, Post, Essay } from '../types';

type SearchCategory = 'all' | 'essays' | 'courses' | 'community';

interface SearchResult {
  id: string;
  type: 'essay' | 'course' | 'post';
  title: string;
  description: string;
  link: string;
  date: string;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState<SearchCategory>(
    (searchParams.get('category') as SearchCategory) || 'all'
  );
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock essays for search
  const mockEssays: Essay[] = [
    {
      id: 'essay1',
      studentId: 'student1',
      title: '경영학과 지원 동기 및 학업 계획',
      content: '저는 어릴 적부터 기업가 정신에 관심이 많았습니다...',
      university: '서울대학교',
      department: '경영학과',
      essayType: 'university_specific',
      status: 'completed',
      wordCount: 1200,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      submittedAt: '2024-01-15T11:00:00Z',
    },
    {
      id: 'essay2',
      studentId: 'student1',
      title: '인공지능과 미래 사회',
      content: 'AI 기술의 발전은 우리 사회를 빠르게 변화시키고 있습니다...',
      university: '연세대학교',
      department: '컴퓨터공학과',
      essayType: 'general',
      status: 'in_review',
      wordCount: 980,
      createdAt: '2024-01-20T14:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    {
      id: 'essay3',
      studentId: 'student1',
      title: '환경 보호의 중요성과 실천 방안',
      content: '지구 온난화와 환경 오염은 현대 사회가 직면한 가장 큰 문제입니다...',
      university: '고려대학교',
      department: '환경공학과',
      essayType: 'university_specific',
      status: 'submitted',
      wordCount: 1100,
      createdAt: '2024-01-25T09:00:00Z',
      updatedAt: '2024-01-25T09:30:00Z',
      submittedAt: '2024-01-25T10:00:00Z',
    },
  ];

  const performSearch = useCallback(() => {
    setIsSearching(true);
    const searchQuery = query.toLowerCase();
    const foundResults: SearchResult[] = [];

    // Search in essays
    if (category === 'all' || category === 'essays') {
      mockEssays.forEach((essay) => {
        if (
          essay.title.toLowerCase().includes(searchQuery) ||
          essay.content.toLowerCase().includes(searchQuery) ||
          essay.university.toLowerCase().includes(searchQuery) ||
          essay.department.toLowerCase().includes(searchQuery)
        ) {
          foundResults.push({
            id: essay.id,
            type: 'essay',
            title: essay.title,
            description: `${essay.university} ${essay.department} - ${essay.content.substring(0, 100)}...`,
            link: `/essays/${essay.id}`,
            date: essay.createdAt,
          });
        }
      });
    }

    // Search in courses
    if (category === 'all' || category === 'courses') {
      sampleCourses.forEach((course: Course) => {
        if (
          course.title.toLowerCase().includes(searchQuery) ||
          course.description.toLowerCase().includes(searchQuery) ||
          course.instructor.toLowerCase().includes(searchQuery)
        ) {
          foundResults.push({
            id: course.id,
            type: 'course',
            title: course.title,
            description: `${course.instructor} - ${course.description}`,
            link: `/courses/${course.id}`,
            date: course.createdAt,
          });
        }
      });
    }

    // Search in community posts
    if (category === 'all' || category === 'community') {
      samplePosts.forEach((post: Post) => {
        if (
          post.title.toLowerCase().includes(searchQuery) ||
          post.content.toLowerCase().includes(searchQuery) ||
          post.authorName.toLowerCase().includes(searchQuery)
        ) {
          foundResults.push({
            id: post.id,
            type: 'post',
            title: post.title,
            description: `${post.authorName} - ${post.content.substring(0, 100)}...`,
            link: `/community/${post.id}`,
            date: post.createdAt,
          });
        }
      });
    }

    // Sort by date (most recent first)
    foundResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setResults(foundResults);
    setIsSearching(false);
  }, [query, category, mockEssays]);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) setQuery(q);
    if (cat) setCategory(cat as SearchCategory);
  }, [searchParams]);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query, category, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query, category });
      performSearch();
    }
  };

  const handleCategoryChange = (newCategory: SearchCategory) => {
    setCategory(newCategory);
    if (query.trim()) {
      setSearchParams({ q: query, category: newCategory });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'essay':
        return <FiFileText className="w-5 h-5 text-blue-600" />;
      case 'course':
        return <FiBook className="w-5 h-5 text-green-600" />;
      case 'post':
        return <FiMessageSquare className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'essay':
        return '논술';
      case 'course':
        return '강의';
      case 'post':
        return '커뮤니티';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">검색</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="검색어를 입력하세요..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button type="submit" className="btn-primary px-8">
                검색
              </button>
            </div>
          </form>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'essays', 'courses', 'community'] as SearchCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' && '전체'}
                {cat === 'essays' && '논술'}
                {cat === 'courses' && '강의'}
                {cat === 'community' && '커뮤니티'}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {query.trim() && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                검색 결과 <span className="text-primary-600">({results.length})</span>
              </h2>
            </div>

            {isSearching ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                <p className="mt-4 text-gray-600">검색 중...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    to={result.link}
                    className="block p-6 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{getIcon(result.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {getTypeLabel(result.type)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(result.date).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{result.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">
                  다른 검색어를 입력하거나 카테고리를 변경해보세요.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!query.trim() && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FiSearch className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">무엇을 찾고 계신가요?</h2>
            <p className="text-gray-600 mb-8">논술, 강의, 커뮤니티 게시글을 검색할 수 있습니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-6 bg-blue-50 rounded-lg">
                <FiFileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">논술 검색</h3>
                <p className="text-sm text-gray-600">제목, 내용, 대학, 학과로 검색</p>
              </div>
              <div className="p-6 bg-green-50 rounded-lg">
                <FiBook className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">강의 검색</h3>
                <p className="text-sm text-gray-600">강의명, 강사, 설명으로 검색</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <FiMessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">커뮤니티 검색</h3>
                <p className="text-sm text-gray-600">게시글 제목, 내용, 작성자로 검색</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
