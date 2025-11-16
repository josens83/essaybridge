import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiThumbsUp,
  FiMessageSquare,
  FiEye,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
} from 'react-icons/fi';
import { samplePosts } from '../data/sampleData';
import { useAuth } from '../contexts/AuthContext';
import type { PostComment } from '../types';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const post = samplePosts.find((p) => p.id === id);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([
    {
      id: '1',
      postId: id || '',
      authorId: 'user1',
      authorName: '합격생A',
      content: '저도 같은 고민을 했었는데, 논술은 빨리 시작할수록 좋아요!',
      isAnonymous: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      postId: id || '',
      authorId: 'user2',
      authorName: '익명',
      content: '고2 겨울방학부터 시작하는 게 적당한 것 같습니다.',
      isAnonymous: true,
      createdAt: new Date(Date.now() - 43200000).toISOString(),
    },
  ]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">게시글을 찾을 수 없습니다</h2>
          <button onClick={() => navigate('/community')} className="btn-primary mt-4">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      postId: post.id,
      authorId: user?.id || '',
      authorName: isAnonymous ? '익명' : user?.name || '',
      content: commentText,
      isAnonymous,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  const categoryLabels = {
    free: '자유게시판',
    qna: 'Q&A',
    success_story: '합격 수기',
    university_specific: '대학별',
    study_tips: '학습 팁',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/community')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          목록으로
        </button>

        {/* Post */}
        <div className="bg-white rounded-lg shadow">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded mr-2">
                    {categoryLabels[post.category]}
                  </span>
                  {post.university && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                      {post.university}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h1>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="font-medium">{post.authorName}</span>
                  <span>·</span>
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                  <span>·</span>
                  <div className="flex items-center">
                    <FiEye className="w-4 h-4 mr-1" />
                    <span>{post.viewCount}</span>
                  </div>
                </div>
              </div>

              {user?.id === post.authorId && (
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiMoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6 border-b border-gray-200">
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>
          </div>

          {/* Post Actions */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  liked
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likeCount}</span>
              </button>

              <div className="flex items-center space-x-2 text-gray-600">
                <FiMessageSquare className="w-5 h-5" />
                <span className="font-medium">{comments.length}</span>
              </div>
            </div>

            {user?.id === post.authorId && (
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiEdit className="w-5 h-5 mr-2" />
                  수정
                </button>
                <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 className="w-5 h-5 mr-2" />
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              댓글 {comments.length}개
            </h2>
          </div>

          {/* Comment Form */}
          {isAuthenticated ? (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="댓글을 작성해주세요..."
                  rows={3}
                  className="input-field mb-3"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mr-2 rounded text-primary-600 focus:ring-primary-500"
                    />
                    익명으로 작성
                  </label>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    댓글 작성
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6 border-b border-gray-200 bg-gray-50 text-center">
              <p className="text-gray-600 mb-3">댓글을 작성하려면 로그인이 필요합니다.</p>
              <button onClick={() => navigate('/login')} className="btn-primary text-sm">
                로그인
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="divide-y divide-gray-200">
            {comments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FiMessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>첫 댓글을 작성해보세요!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold text-gray-600">
                          {comment.authorName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{comment.authorName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {user?.id === comment.authorId && (
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed ml-13">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">관련 게시글</h2>
          <div className="space-y-3">
            {samplePosts
              .filter((p) => p.id !== post.id && p.category === post.category)
              .slice(0, 3)
              .map((relatedPost) => (
                <button
                  key={relatedPost.id}
                  onClick={() => navigate(`/community/${relatedPost.id}`)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <p className="font-medium text-gray-900 mb-1">{relatedPost.title}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-3">
                    <span>{relatedPost.authorName}</span>
                    <span>·</span>
                    <div className="flex items-center">
                      <FiThumbsUp className="w-3 h-3 mr-1" />
                      {relatedPost.likeCount}
                    </div>
                    <div className="flex items-center">
                      <FiMessageSquare className="w-3 h-3 mr-1" />
                      {relatedPost.commentCount}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
