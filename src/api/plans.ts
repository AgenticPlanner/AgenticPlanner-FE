import apiClient from './client';
import type { APIPlan, APIPlanDay, APIPlanItem } from '../types/api';

export interface BudgetSummary {
  plan_id: string;
  total_estimated: number;
  total_actual: number;
  done_count: number;
  total_count: number;
  completion_rate: number;
  breakdown: Record<string, {
    estimated: number;
    actual: number;
    count: number;
    done_count: number;
  }>;
}

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

// POST /api/v1/plans/{id}/enrich/ — external_link 없는 아이템에 예약 URL 재생성
export const enrichPlanLinks = (planId: string): Promise<{ enriched_count: number }> =>
  apiClient.post<{ enriched_count: number }>(`/api/v1/plans/${planId}/enrich/`).then(r => r.data);

// 예산 요약 조회
export const getPlanBudgetSummary = async (planId: string): Promise<BudgetSummary> => {
  const res = await apiClient.get(`/api/v1/plans/${planId}/budget-summary/`);
  return res.data;
};

// 완료 토글
export const toggleItemDone = async (
  itemId: string,
  actualAmount?: number,
): Promise<APIPlanItem> => {
  const res = await apiClient.patch(
    `/api/v1/plans/items/${itemId}/toggle-done/`,
    actualAmount != null ? { actual_amount: actualAmount } : {},
  );
  return res.data;
};

// 티켓 업로드
export const uploadTicket = async (itemId: string, file: File): Promise<APIPlanItem> => {
  const form = new FormData();
  form.append('ticket', file);
  const res = await apiClient.post(
    `/api/v1/plans/items/${itemId}/upload-ticket/`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return res.data;
};

// 티켓 삭제
export const deleteTicket = async (itemId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/plans/items/${itemId}/upload-ticket/`);
};

export interface DirectionsResult {
  url: string;
  needs_origin: boolean;
  message: string;
  source?: string;
  is_precise?: boolean;
}

export const getDirections = async (
  destination: string,
  origin: string,
  mode: string = 'transit',
): Promise<DirectionsResult> => {
  const res = await apiClient.post<DirectionsResult>('/api/v1/plans/directions/', {
    destination,
    origin,
    mode,
  });
  return res.data;
};
