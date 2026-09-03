import api from './api';
import type { AuthResponse } from '../types';

export const registerRequest = (data: { name: string; email: string; password: string }) =>
  api.post<AuthResponse>('/auth/register', data);

export const loginRequest = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data);

export const forgotPasswordRequest = (data: { email: string }) =>
  api.post<{ message: string; resetToken?: string; expiresInMinutes?: number }>(
    '/auth/forgot-password',
    data
  );

export const resetPasswordRequest = (data: { token: string; newPassword: string }) =>
  api.post<{ message: string }>('/auth/reset-password', data);