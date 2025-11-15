import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiThumbsUp, FiEye, FiSearch } from 'react-icons/fi';
import { samplePosts } from '../data/sampleData';
import type { PostCategory } from '../types';

const Community = () => {
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: 'all' as const, label: '전체' },
    { value: 'free' as const, label: '자유게시판' },
    { value: 'qna' as const, label: 'Q&A' },
    { value: 'success_story' as const, label: '합격 수기' },
    { value: 'university_specific' as const, label: '대학별' },
    { value: 'study_tips' as const, label: '학습 팁' },
  ];

  const filteredPosts = samplePosts.filter((post) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">커뮤니티</h1>
          <p className="text-xl text-gray-600">수험생들과 정보를 공유하고 소통하세요</p>
        </div>

        {/* Search and Categories */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="게시글 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Link to="/community/new" className="btn-primary whitespace-nowrap">
              글쓰기
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Best Posts */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">베스트 게시글</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {samplePosts
              .filter((post) => post.likeCount > 100)
              .slice(0, 3)
              .map((post) => (
                <Link
                  key={post.id}
                  to={`/community/${post.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded mr-2">
                          BEST
                        </span>
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                          {post.category === 'success_story'
                            ? '합격 수기'
                            : post.category === 'qna'
                            ? 'Q&A'
                            : '자유게시판'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>{post.authorName}</span>
                        <span>·</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <div className="flex items-center">
                          <FiEye className="w-4 h-4 mr-1" />
                          <span>{post.viewCount}</span>
                        </div>
                        <div className="flex items-center">
                          <FiThumbsUp className="w-4 h-4 mr-1" />
                          <span>{post.likeCount}</span>
                        </div>
                        <div className="flex items-center">
                          <FiMessageSquare className="w-4 h-4 mr-1" />
                          <span>{post.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">게시글 목록</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/community/${post.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {post.category === 'success_story'
                          ? '합격 수기'
                          : post.category === 'qna'
                          ? 'Q&A'
                          : post.category === 'university_specific'
                          ? '대학별'
                          : '자유게시판'}
                      </span>
                      {post.university && (
                        <span className="ml-2 px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                          {post.university}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span>{post.authorName}</span>
                      <span>·</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <div className="flex items-center">
                        <FiEye className="w-4 h-4 mr-1" />
                        <span>{post.viewCount}</span>
                      </div>
                      <div className="flex items-center">
                        <FiThumbsUp className="w-4 h-4 mr-1" />
                        <span>{post.likeCount}</span>
                      </div>
                      <div className="flex items-center">
                        <FiMessageSquare className="w-4 h-4 mr-1" />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
