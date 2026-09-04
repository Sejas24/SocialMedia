import api from './api';
import type { User } from '../types';

export const getMeRequest = () =>
  api.get<User>('/users/me');

export const getUserByIdRequest = (id: number) =>
  api.get<User>(`/users/${id}`);

export const updateMeRequest = (data: {
  name?: string;
  bio?: string;
  avatar?: string;
}) =>
  api.put<{
    message: string;
    user: User;
  }>('/users/me', data);