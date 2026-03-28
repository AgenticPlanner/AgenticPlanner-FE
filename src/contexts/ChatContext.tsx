import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/types';
import { createSession, getSession, streamChat } from '@/api/agent';
import { initialChatMessages } from '@/data/tripData';

const SESSION_KEY = 'agentSessionId';
const MESSAGES_KEY = 'agentMessages';

interface ChatContextValue {
  sessionId: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  stopStreaming: () => void;
  initSession: (planId?: number) => Promise<void>;
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

  // 앱 시작 시 sessionStorage의 sessionId 유효성 확인
  useEffect(() => {
    const storedId = sessionStorage.getItem(SESSION_KEY);
    if (!storedId) return;
    getSession(storedId).catch(() => {
      sessionStorage.removeItem(SESSION_KEY);
      setSessionId(null);
    });
  }, []);

  // messages 변경마다 sessionStorage에 유지
  useEffect(() => {
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  const initSession = useCallback(async (planId?: number) => {
    if (sessionId) return; // 중복 생성 방지
    try {
      const session = await createSession(planId);
      sessionStorage.setItem(SESSION_KEY, session.id);
      setSessionId(session.id);
    } catch {
      // silent
    }
  }, [sessionId]);

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
        const session = await createSession();
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
        { session_id: sid, message: content },
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: m.content + chunk } : m
            )
          );
        },
        () => {
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
  }, [sessionId, isStreaming]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return (
    <ChatContext.Provider value={{ sessionId, messages, isStreaming, sendMessage, stopStreaming, initSession, clearSession }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used inside ChatProvider');
  return ctx;
}
