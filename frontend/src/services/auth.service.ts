import api from './api';
import type { AuthResponse } from '../types';

export const registerRequest = (data: { name: string; email: string; password: string }) =>
  api.post<AuthResponse>('/auth/register', data);

export const loginRequest = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data);