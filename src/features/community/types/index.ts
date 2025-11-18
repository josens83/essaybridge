/**
 * Community Feature Types
 * Community posts and discussions related types
 */

export type PostCategory = 'free' | 'qna' | 'success_story' | 'university_specific' | 'study_tips';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: PostCategory;
  university?: string;
  isAnonymous: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
}
