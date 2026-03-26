import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/types';
import { createSession, streamChat } from '@/api/agent';
import { initialChatMessages } from '@/data/tripData';

export const useAgentChat = (planId?: number) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const initSession = async () => {
    try {
      const session = await createSession(planId);
      setSessionId(session.id);
    } catch {
      // 세션 초기화 실패 시 조용히 무시 — 채팅은 세션 없이도 동작 가능
    }
  };

  useEffect(() => {
    initSession();
    return () => {
      abortRef.current?.abort();
    };
  // planId가 바뀌면 새 세션 생성
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming) return;

    // 1. user 메시지 즉시 추가
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    // 2. AI 메시지 빈 껍데기 추가
    const aiMsgId = `streaming-${Date.now()}`;
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'ai',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsStreaming(true);

    // 세션이 없으면 먼저 생성
    let sid = sessionId;
    if (!sid) {
      try {
        const session = await createSession(planId);
        sid = session.id;
        setSessionId(sid);
      } catch {
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? { ...m, content: '세션을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.' }
              : m
          )
        );
        return;
      }
    }

    abortRef.current = new AbortController();

    try {
      // 3. SSE 스트리밍 수신
      await streamChat(
        { session_id: sid, message: content, plan_id: planId },
        (chunk) => {
          // 4. 청크마다 AI 메시지에 append
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: m.content + chunk } : m
            )
          );
        },
        () => {
          // 5. 완료
          setIsStreaming(false);
        },
        abortRef.current.signal
      );
    } catch (err) {
      if ((err as { name?: string }).name === 'AbortError') return;
      setIsStreaming(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? { ...m, content: m.content || '응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.' }
            : m
        )
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, isStreaming, planId]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, sendMessage, stopStreaming, initSession };
};
