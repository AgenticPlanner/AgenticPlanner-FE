import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChatMessage } from '@/types';
import type { TravelInfo } from '@/types/api';
import { createAgentSession, getAgentSession, streamChat } from '@/api/agent';
import { initialChatMessages } from '@/data/tripData';

const SESSION_KEY = 'agentSessionId';
const MESSAGES_KEY = 'agentMessages';

const EMPTY_TRAVEL_INFO: TravelInfo = {
  destination: '',
  start_date: '',
  end_date: '',
  group_size: 2,
  budget: 0,
  travel_style: '',
};

interface ChatContextValue {
  sessionId: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  stopStreaming: () => void;
  initSession: (travelInfo?: TravelInfo) => Promise<void>;
  startSession: (travelInfo: TravelInfo) => Promise<void>;
  clearSession: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(() =>
    sessionStorage.getItem(SESSION_KEY)
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = sessionStorage.getItem(MESSAGES_KEY);
    if (stored) {
      try { return JSON.parse(stored) as ChatMessage[]; }
      catch { /* fall through */ }
    }
    return initialChatMessages;
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  // 앱 시작 시 sessionStorage의 sessionId 유효성 확인
  useEffect(() => {
    const storedId = sessionStorage.getItem(SESSION_KEY);
    if (!storedId) return;
    getAgentSession(storedId).catch(() => {
      sessionStorage.removeItem(SESSION_KEY);
      setSessionId(null);
    });
  }, []);

  // messages 변경마다 sessionStorage에 유지
  useEffect(() => {
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  const initSession = useCallback(async (travelInfo?: TravelInfo) => {
    if (sessionId) return; // 중복 생성 방지
    try {
      const session = await createAgentSession(travelInfo ?? EMPTY_TRAVEL_INFO);
      sessionStorage.setItem(SESSION_KEY, session.id);
      setSessionId(session.id);
    } catch {
      // silent
    }
  }, [sessionId]);

  // 기존 세션을 버리고 travel_info를 포함한 새 세션으로 교체
  const startSession = useCallback(async (travelInfo: TravelInfo) => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(MESSAGES_KEY);
    setSessionId(null);
    setMessages(initialChatMessages);
    try {
      const session = await createAgentSession(travelInfo);
      sessionStorage.setItem(SESSION_KEY, session.id);
      setSessionId(session.id);
    } catch {
      // silent — sendMessage가 재시도할 때 fallback 처리
    }
  }, []);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(MESSAGES_KEY);
    setSessionId(null);
    setMessages(initialChatMessages);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    const aiMsgId = `streaming-${Date.now()}`;
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'ai',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsStreaming(true);

    // 세션 없으면 생성
    let sid = sessionId;
    if (!sid) {
      try {
        const session = await createAgentSession(EMPTY_TRAVEL_INFO);
        sid = session.id;
        sessionStorage.setItem(SESSION_KEY, sid);
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
      await streamChat(
        sid,
        content,
        (event) => {
          if (event.type === 'delta' && event.delta) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMsgId ? { ...m, content: m.content + event.delta } : m
              )
            );
          }
          if (event.type === 'done') {
            setIsStreaming(false);
            const planId = event.plan_id ?? event.session?.plan?.id ?? undefined;
            if (planId) navigate(`/itinerary?planId=${planId}`);
          }
          if (event.type === 'error') {
            throw new Error(event.error ?? 'SSE 에러');
          }
        },
        abortRef.current.signal
      );
      setIsStreaming(false);
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
  }, [sessionId, isStreaming, navigate]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return (
    <ChatContext.Provider value={{ sessionId, messages, isStreaming, sendMessage, stopStreaming, initSession, startSession, clearSession }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used inside ChatProvider');
  return ctx;
}
