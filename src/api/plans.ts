import apiClient from './client';
import type { APIPlan, APIPlanDay, APIPlanItem } from '../types/api';

// Plans
export const getPlans = () =>
  apiClient.get<APIPlan[]>('/api/v1/plans/').then(r => r.data);

export const createPlan = (data: Pick<APIPlan, 'title' | 'description'>) =>
  apiClient.post<APIPlan>('/api/v1/plans/', data).then(r => r.data);

export const getPlan = (id: string) =>
  apiClient.get<APIPlan>(`/api/v1/plans/${id}/`).then(r => r.data);

export const updatePlan = (id: string, data: Partial<APIPlan>) =>
  apiClient.put<APIPlan>(`/api/v1/plans/${id}/`, data).then(r => r.data);

export const joinPlan = (invite_code: string) =>
  apiClient.post('/api/v1/plans/join/', { invite_code }).then(r => r.data);

export const invitePlan = (id: string) =>
  apiClient.post<{ invite_code: string }>(`/api/v1/plans/${id}/invite/`).then(r => r.data);

// Days
export const getDays = (planPk: string) =>
  apiClient.get<APIPlanDay[]>(`/api/v1/plans/${planPk}/days/`).then(r => r.data);

export const createDay = (planPk: string, data: Partial<APIPlanDay>) =>
  apiClient.post<APIPlanDay>(`/api/v1/plans/${planPk}/days/`, data).then(r => r.data);

export const updateDay = (planPk: string, id: string, data: Partial<APIPlanDay>) =>
  apiClient.put<APIPlanDay>(`/api/v1/plans/${planPk}/days/${id}/`, data).then(r => r.data);

// Items
export const getItems = (planPk: string, dayPk: string) =>
  apiClient.get<APIPlanItem[]>(`/api/v1/plans/${planPk}/days/${dayPk}/items/`).then(r => r.data);

export const createItem = (planPk: string, dayPk: string, data: Partial<APIPlanItem>) =>
  apiClient.post<APIPlanItem>(`/api/v1/plans/${planPk}/days/${dayPk}/items/`, data).then(r => r.data);

export const updateItem = (planPk: string, dayPk: string, id: string, data: Partial<APIPlanItem>) =>
  apiClient.put<APIPlanItem>(`/api/v1/plans/${planPk}/days/${dayPk}/items/${id}/`, data).then(r => r.data);
