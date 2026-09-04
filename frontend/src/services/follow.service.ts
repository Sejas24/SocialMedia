import api from './api';
import type { User } from '../types';

export const followUserRequest = (userId: number) =>
  api.post<{ message: string }>(`/follow/${userId}`);

export const unfollowUserRequest = (userId: number) =>
  api.delete<{ message: string }>(`/follow/${userId}`);

export const getFollowersRequest = (userId: number) =>
  api.get<{ followers: { follower: User }[] }>(
    `/follow/${userId}/followers`
  );

export const getFollowingRequest = (userId: number) =>
  api.get<{ following: { followed: User }[] }>(
    `/follow/${userId}/following`
  );