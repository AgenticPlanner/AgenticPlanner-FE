import apiClient from './client';
import type { AgentSession, AgentChatRequest, SSEDonePayload } from '../types/api';

export const createSession = (plan_id?: number) =>
  apiClient.post<AgentSession>('/api/v1/agent/session/', { plan_id }).then(r => r.data);

export const getSession = (id: string) =>
  apiClient.get<AgentSession>(`/api/v1/agent/session/${id}/`).then(r => r.data);

export const selectConcept = (sessionId: string, concept: unknown) =>
  apiClient.post(`/api/v1/agent/session/${sessionId}/select-concept/`, { concept }).then(r => r.data);

// SSE 스트리밍 — fetch 사용 (axios는 SSE 미지원)
export const streamChat = async (
  body: AgentChatRequest,
  onChunk: (text: string) => void,
  onDone: (planId?: string) => void,
  signal?: AbortSignal
) => {
  const token = localStorage.getItem('accessToken');
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const response = await fetch(`${baseURL}/api/v1/agent/chat/stream/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) throw new Error(`SSE 요청 실패: ${response.status}`);
  if (!response.body) throw new Error('스트림 없음');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) { onDone(undefined); break; }

    const lines = decoder.decode(value).split('\n');
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]') continue;

      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;

        if (parsed.type === 'delta' && parsed.delta) {
          onChunk(parsed.delta as string);
        }
        if (parsed.type === 'done') {
          const donePayload = parsed as unknown as SSEDonePayload;
          const planId = donePayload.plan_id ?? donePayload.session?.plan?.id ?? undefined;
          onDone(planId ?? undefined);
          return;
        }
        if (parsed.type === 'error') {
          throw new Error((parsed.error as string | undefined) ?? 'SSE 에러');
        }
      } catch (e) {
        if (e instanceof SyntaxError) continue; // JSON이 아닌 쓰레기 데이터 무시
        throw e;
      }
    }
  }
};
