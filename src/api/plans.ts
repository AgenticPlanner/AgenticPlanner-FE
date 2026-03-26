import apiClient from './client';
import type { APIPlan, APIPlanDay, APIPlanItem } from '../types/api';

// Plans
export const getPlans = () =>
  apiClient.get<APIPlan[]>('/api/v1/plans/plans/').then(r => r.data);

export const createPlan = (data: Pick<APIPlan, 'title' | 'description'>) =>
  apiClient.post<APIPlan>('/api/v1/plans/plans/', data).then(r => r.data);

export const getPlan = (id: number) =>
  apiClient.get<APIPlan>(`/api/v1/plans/plans/${id}/`).then(r => r.data);

export const updatePlan = (id: number, data: Partial<APIPlan>) =>
  apiClient.put<APIPlan>(`/api/v1/plans/plans/${id}/`, data).then(r => r.data);

export const joinPlan = (invite_code: string) =>
  apiClient.post('/api/v1/plans/plans/join/', { invite_code }).then(r => r.data);

export const invitePlan = (id: number) =>
  apiClient.post<{ invite_code: string }>(`/api/v1/plans/plans/${id}/invite/`).then(r => r.data);

// Days
export const getDays = (planPk: number) =>
  apiClient.get<APIPlanDay[]>(`/api/v1/plans/plans/${planPk}/days/`).then(r => r.data);

export const createDay = (planPk: number, data: Partial<APIPlanDay>) =>
  apiClient.post<APIPlanDay>(`/api/v1/plans/plans/${planPk}/days/`, data).then(r => r.data);

export const updateDay = (planPk: number, id: number, data: Partial<APIPlanDay>) =>
  apiClient.put<APIPlanDay>(`/api/v1/plans/plans/${planPk}/days/${id}/`, data).then(r => r.data);

// Items
export const getItems = (planPk: number, dayPk: number) =>
  apiClient.get<APIPlanItem[]>(`/api/v1/plans/plans/${planPk}/days/${dayPk}/items/`).then(r => r.data);

export const createItem = (planPk: number, dayPk: number, data: Partial<APIPlanItem>) =>
  apiClient.post<APIPlanItem>(`/api/v1/plans/plans/${planPk}/days/${dayPk}/items/`, data).then(r => r.data);

export const updateItem = (planPk: number, dayPk: number, id: number, data: Partial<APIPlanItem>) =>
  apiClient.put<APIPlanItem>(`/api/v1/plans/plans/${planPk}/days/${dayPk}/items/${id}/`, data).then(r => r.data);
