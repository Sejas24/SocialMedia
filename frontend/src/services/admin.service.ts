import api from './api';
import type { User, Post, Comment } from '../types';

export const getAllUsersRequest = () =>
  api.get<User[]>('/users');

export const getAllPostsRequest = (page = 1, limit = 100) =>
  api.get<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    posts: Post[];
  }>(`/posts?page=${page}&limit=${limit}`);

export const deletePostAdminRequest = (postId: number) =>
  api.delete<{ message: string }>(`/posts/${postId}`);

export const getCommentsAdminRequest = (postId: number) =>
  api.get<{ comments: Comment[] }>(`/comments/${postId}`);

export const deleteCommentAdminRequest = (commentId: number) =>
  api.delete<{ message: string }>(`/comments/${commentId}`);