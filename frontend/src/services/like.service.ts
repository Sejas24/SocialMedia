import api from './api';

export const likePostRequest = (postId: number) =>
  api.post<{
    message: string;
    likesCount: number;
  }>(`/likes/${postId}`);

export const unlikePostRequest = (postId: number) =>
  api.delete<{
    message: string;
    likesCount: number;
  }>(`/likes/${postId}`);

export const getLikesCountRequest = (postId: number) =>
  api.get<{
    postId: number;
    likesCount: number;
  }>(`/likes/${postId}`);