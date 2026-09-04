import api from './api';
import type { Comment } from '../types';

export const getCommentsRequest = (
  postId: number
) =>
  api.get<{ comments: Comment[] }>(
    `/comments/${postId}`
  );

export const createCommentRequest = (
  postId: number,
  content: string
) =>
  api.post<{
    message: string;
    comment: Comment;
  }>(
    `/comments/${postId}`,
    { content }
  );

export const deleteCommentRequest = (
  commentId: number
) =>
  api.delete<{
    message: string;
  }>(
    `/comments/${commentId}`
  );