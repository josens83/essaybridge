import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiClock, FiCheckCircle } from 'react-icons/fi';
import { sampleEssays } from '../../../data/sampleData';

const Essays = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">논술 첨삭</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">전문가의 상세한 첨삭으로 실력을 향상시키세요</p>
          </div>
          <Link to="/essays/new" className="btn-primary flex items-center">
            <FiPlus className="w-5 h-5 mr-2" />
            새 논술 작성
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">전체 논술</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 mb-1">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">첨삭 대기 중</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">2</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">첨삭 진행 중</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">첨삭 완료</div>
          </div>
        </div>

        {/* Essay List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">내 논술 목록</h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sampleEssays.map((essay) => (
              <Link
                key={essay.id}
                to={`/essays/${essay.id}`}
                className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">{essay.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          essay.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : essay.status === 'in_review'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : essay.status === 'submitted'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {essay.status === 'completed'
                          ? '첨삭 완료'
                          : essay.status === 'in_review'
                          ? '첨삭 중'
                          : essay.status === 'submitted'
                          ? '대기 중'
                          : '작성 중'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {essay.university} · {essay.department}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        <span>{new Date(essay.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FiEdit className="w-4 h-4 mr-1" />
                        <span>{essay.wordCount}자</span>
                      </div>
                      {essay.expertId && (
                        <div className="flex items-center">
                          <FiCheckCircle className="w-4 h-4 mr-1" />
                          <span>전문가 배정 완료</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {essay.status === 'in_review' && (
                    <div className="ml-4 bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-lg transition-colors">
                      <div className="text-xs text-blue-600 dark:text-blue-300 font-medium mb-1">예상 완료</div>
                      <div className="text-sm font-bold text-blue-700 dark:text-blue-200">24시간 이내</div>
                    </div>
                  )}
                </div>

                {essay.status === 'draft' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="btn-primary text-sm px-4 py-2">이어서 작성하기</button>
                  </div>
                )}

                {essay.status === 'completed' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="btn-secondary text-sm px-4 py-2">첨삭 결과 보기</button>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {sampleEssays.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center transition-colors">
            <FiEdit className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">아직 작성한 논술이 없습니다</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">첫 논술을 작성하고 전문가의 첨삭을 받아보세요!</p>
            <Link to="/essays/new" className="btn-primary inline-flex items-center">
              <FiPlus className="w-5 h-5 mr-2" />
              첫 논술 작성하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Essays;
