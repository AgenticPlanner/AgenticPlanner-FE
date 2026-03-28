import apiClient from './client';
import type { APIPlan } from '../types/api';

// Plans
export const getPlans = () =>
  apiClient.get<APIPlan[]>('/api/v1/plans/').then(r => r.data);

export const createPlan = (data: Pick<APIPlan, 'title'> & { description?: string }) =>
  apiClient.post<APIPlan>('/api/v1/plans/', data).then(r => r.data);

// GET /api/v1/plans/{id}/ — days[].items[] 포함 전체 응답 기대
export const getPlan = (id: string) =>
  apiClient.get<APIPlan>(`/api/v1/plans/${id}/`).then(r => r.data);

export const updatePlan = (id: string, data: Partial<APIPlan>) =>
  apiClient.put<APIPlan>(`/api/v1/plans/${id}/`, data).then(r => r.data);

export const joinPlan = (invite_code: string) =>
  apiClient.post('/api/v1/plans/join/', { invite_code }).then(r => r.data);

export const invitePlan = (id: string) =>
  apiClient.post<{ invite_code: string }>(`/api/v1/plans/${id}/invite/`).then(r => r.data);
