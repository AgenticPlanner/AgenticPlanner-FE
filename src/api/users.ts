import apiClient from './client';
import type { UserMe } from '../types/api';

export const getMe = () =>
  apiClient.get<UserMe>('/api/v1/users/me/').then(r => r.data);
