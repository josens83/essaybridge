import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiDownload, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { sampleEssays, sampleReviews } from '../../../data/sampleData';

const EssayReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAllComments, setShowAllComments] = useState(true);

  // In real app, fetch essay and review data
  const essay = sampleEssays.find((e) => e.id === id);
  const review = sampleReviews.find((r) => r.essayId === id);

  if (!essay) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">논술을 찾을 수 없습니다</h2>
          <button onClick={() => navigate('/essays')} className="btn-primary mt-4">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const commentTypes = {
    grammar: { label: '문법', color: 'bg-red-100 text-red-700 border-red-300' },
    logic: { label: '논리', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    expression: { label: '표현', color: 'bg-green-100 text-green-700 border-green-300' },
    structure: { label: '구조', color: 'bg-purple-100 text-purple-700 border-purple-300' },
    content: { label: '내용', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  };

  const highlightText = (text: string) => {
    if (!review || !showAllComments) return text;

    let highlightedText = text;
    const sortedComments = [...review.comments].sort((a, b) => b.position - a.position);

    sortedComments.forEach((comment) => {
      const before = highlightedText.slice(0, comment.position);
      const highlighted = highlightedText.slice(comment.position, comment.position + comment.length);
      const after = highlightedText.slice(comment.position + comment.length);

      const colorClass = commentTypes[comment.type].color.split(' ')[0];
      highlightedText = `${before}<mark class="${colorClass} px-1 rounded cursor-pointer" data-comment-id="${comment.id}">${highlighted}</mark>${after}`;
    });

    return highlightedText;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/essays')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            목록으로
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{essay.title}</h1>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                <span>{essay.university}</span>
                <span>·</span>
                <span>{essay.department}</span>
                <span>·</span>
                <span>{new Date(essay.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {essay.status === 'completed' && (
              <button className="btn-outline flex items-center">
                <FiDownload className="w-5 h-5 mr-2" />
                PDF 다운로드
              </button>
            )}
          </div>
        </div>

        {essay.status === 'completed' && review ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Essay Content with Highlights */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overall Score */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">종합 평가</h2>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400 mr-2">{review.score}</span>
                    <span className="text-gray-600 dark:text-gray-400">/ 100</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {review.overallFeedback}
                  </p>
                </div>
              </div>

              {/* Essay Text with Highlights */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">첨삭된 논술</h2>
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    {showAllComments ? '하이라이트 숨기기' : '하이라이트 보기'}
                  </button>
                </div>

                <div
                  className="prose max-w-none leading-relaxed text-gray-800 dark:text-gray-200"
                  dangerouslySetInnerHTML={{ __html: highlightText(essay.content) }}
                />
              </div>
            </div>

            {/* Comments Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24 transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  첨삭 코멘트 ({review.comments.length})
                </h2>

                {/* Comment Type Legend */}
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">코멘트 유형</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(commentTypes).map(([key, value]) => (
                      <span
                        key={key}
                        className={`px-2 py-1 rounded text-xs font-medium border ${value.color}`}
                      >
                        {value.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {review.comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        commentTypes[comment.type].color.split(' ').slice(-1)[0]
                      } bg-gray-50`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${commentTypes[comment.type].color}`}
                        >
                          {commentTypes[comment.type].label}
                        </span>
                        <span className="text-xs text-gray-500">#{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>

                {/* Expert Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">첨삭 전문가</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {review.expertName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{review.expertName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">논술 전문가</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 transition-colors">
            <div className="text-center">
              {essay.status === 'in_review' ? (
                <>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">첨삭 진행 중</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    전문가가 논술을 첨삭하고 있습니다. 곧 결과를 확인하실 수 있습니다.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800 dark:text-blue-200">예상 완료 시간: 24시간 이내</p>
                  </div>
                </>
              ) : essay.status === 'submitted' ? (
                <>
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiAlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">첨삭 대기 중</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    곧 전문가가 배정되어 첨삭을 시작합니다.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">작성 중인 논술</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    아직 제출하지 않은 논술입니다. 작성을 완료하고 첨삭을 신청해주세요.
                  </p>
                  <button
                    onClick={() => navigate(`/essays/edit/${essay.id}`)}
                    className="btn-primary"
                  >
                    이어서 작성하기
                  </button>
                </>
              )}
            </div>

            {/* Essay Preview */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">논술 내용 미리보기</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line line-clamp-10">
                  {essay.content}
                </p>
                {essay.content.length > 500 && (
                  <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm mt-2">
                    더 보기
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayReview;
