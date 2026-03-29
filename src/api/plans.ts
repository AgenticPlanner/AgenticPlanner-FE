import apiClient from './client';
import type { APIPlan, APIPlanDay, APIPlanItem } from '../types/api';

// Plans
export const getPlans = (): Promise<APIPlan[]> =>
  apiClient.get<APIPlan[]>('/api/v1/plans/').then(r => r.data);

export const createPlan = (data: Pick<APIPlan, 'title'> & { description?: string }): Promise<APIPlan> =>
  apiClient.post<APIPlan>('/api/v1/plans/', data).then(r => r.data);

// GET /api/v1/plans/{id}/ — days[].items[] 포함 전체 응답
export const getPlan = (id: string): Promise<APIPlan> =>
  apiClient.get<APIPlan>(`/api/v1/plans/${id}/`).then(r => r.data);

export const updatePlan = (id: string, data: Partial<APIPlan>): Promise<APIPlan> =>
  apiClient.put<APIPlan>(`/api/v1/plans/${id}/`, data).then(r => r.data);

export const joinPlan = (invite_code: string): Promise<APIPlan> =>
  apiClient.post<APIPlan>('/api/v1/plans/join/', { invite_code }).then(r => r.data);

// POST /api/v1/plans/{id}/invite/ — 초대 코드 생성 (응답 필드: code)
export const invitePlan = (id: string): Promise<{ code: string }> =>
  apiClient.post<{ code: string }>(`/api/v1/plans/${id}/invite/`).then(r => r.data);

// Days (nested)
export const getPlanDays = (planPk: string): Promise<APIPlanDay[]> =>
  apiClient.get<APIPlanDay[]>(`/api/v1/plans/${planPk}/days/`).then(r => r.data);

// Items (nested)
export const getDayItems = (planPk: string, dayPk: string): Promise<APIPlanItem[]> =>
  apiClient.get<APIPlanItem[]>(`/api/v1/plans/${planPk}/days/${dayPk}/items/`).then(r => r.data);
