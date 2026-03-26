import apiClient from './client';
import type { AgentSession, AgentChatRequest } from '../types/api';

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
  onDone: () => void,
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
    if (done) { onDone(); break; }

    const lines = decoder.decode(value).split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(data) as Record<string, unknown>;
          const text =
            (parsed.content as string | undefined) ??
            (parsed.text as string | undefined) ??
            (parsed.delta as string | undefined) ??
            data;
          if (text) onChunk(text);
        } catch {
          if (data) onChunk(data);
        }
      }
    }
  }
};
