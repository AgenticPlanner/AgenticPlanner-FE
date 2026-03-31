import apiClient from './client';
import type { AgentSession, SessionSummary, TravelInfo, SSEEvent } from '../types/api';

export const listAgentSessions = async (): Promise<AgentSession[]> => {
  const res = await apiClient.get<AgentSession[]>('/api/v1/agent/sessions/');
  return res.data;
};

export const getSessionList = async (): Promise<SessionSummary[]> => {
  const res = await apiClient.get<SessionSummary[]>('/api/v1/agent/sessions/');
  return res.data;
};

export const createAgentSession = async (travelInfo: TravelInfo): Promise<AgentSession> => {
  const res = await apiClient.post<AgentSession>('/api/v1/agent/sessions/', {
    travel_info: travelInfo,
  });
  return res.data;
};

export const getAgentSession = async (sessionId: string): Promise<AgentSession> => {
  const res = await apiClient.get<AgentSession>(`/api/v1/agent/sessions/${sessionId}/`);
  return res.data;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/agent/sessions/${sessionId}/`);
};

export const selectConcept = async (
  sessionId: string,
  conceptId: string
): Promise<AgentSession> => {
  const res = await apiClient.post<AgentSession>(
    `/api/v1/agent/sessions/${sessionId}/select-concept/`,
    { concept_id: conceptId }
  );
  return res.data;
};

// SSE 스트리밍 — fetch 사용 (axios는 SSE 미지원)
export const streamChat = async (
  sessionId: string,
  message: string,
  onEvent: (event: SSEEvent) => void,
  signal?: AbortSignal
): Promise<void> => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${baseURL}/api/v1/agent/chat/stream/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ session_id: sessionId, message }),
    signal,
  });

  if (!response.ok) throw new Error(`SSE 요청 실패: ${response.status}`);
  if (!response.body) throw new Error('스트림 없음');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split('\n');
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        const event = JSON.parse(raw) as SSEEvent;
        onEvent(event);
      } catch {
        // 파싱 실패 무시
      }
    }
  }
};
