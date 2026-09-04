import api from './api';
import type { Post, FeedResponse } from '../types';

export const getFeedRequest = (page = 1, limit = 10) =>
    api.get<FeedResponse>('/posts', { params: { page, limit } });

export const createPostRequest = (data: { content: string; image?: string }) =>
    api.post<{ message: string; post: Post }>('/posts', data);

export const deletePostRequest = (id: number) =>
    api.delete<{ message: string }>(`/posts/${id}`);