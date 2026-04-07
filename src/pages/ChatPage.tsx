import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { AgentSession, AgentMessage, SSEEvent, Concept, TravelInfo } from '@/types/api';
import { getAgentSession, getSessionList, streamChat, selectConcept } from '@/api/agent';
import { AppLayout } from '@/components/layout';
import ChatSidebar from '@/components/features/chat/ChatSidebar';
import CrawlingStatus from '@/components/CrawlingStatus';
import QuickReplyButtons from '@/components/features/chat/QuickReplyButtons';

// ─── 로컬 타입 ────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface ThinkingStep {
  text: string;
  timestamp: number;
}

interface CrawlingStatus {
  accommodation_count: number;
  activity_count: number;
  flight_count: number;
  has_exchange_rate: boolean;
}

// ─── 헬퍼 ─────────────────────────────────────────────────────────────────────

function buildTravelInfoMessage(info: TravelInfo): string {
  const lines: string[] = ['안녕하세요! 아래 정보로 여행 계획을 만들어주세요.', ''];
  if (info.destination) lines.push(`📍 목적지: ${info.destination}`);
  if (info.start_date)  lines.push(`📅 출발일: ${info.start_date}`);
  if (info.end_date)    lines.push(`🏠 귀국일: ${info.end_date}`);
  if (info.budget > 0) {
    const man = Math.round(info.budget / 10000);
    lines.push(`💰 예산: ${man.toLocaleString()}만원 (1인당)`);
  }
  if (info.travel_style) lines.push(`🎯 여행 스타일: ${info.travel_style}`);
  if (info.special_requests) lines.push(`📝 추가 요청: ${info.special_requests}`);
  return lines.join('\n');
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('sessionId');
  const autoStart = searchParams.get('autoStart') === 'true';

  const [session, setSession] = useState<AgentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [crawlingStatus, setCrawlingStatus] = useState<CrawlingStatus | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [crawlingDone, setCrawlingDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoStartFired = useRef(false);

  // ── sessionId 없을 때만 redirect ────────────────────────────────────────────
  useEffect(() => {
    if (sessionId) return;
    getSessionList()
      .then((sessions) => {
        if (sessions.length > 0) {
          navigate(`/chat?sessionId=${sessions[0].id}`, { replace: true });
        } else {
          navigate('/plan', { replace: true });
        }
      })
      .catch(() => navigate('/plan', { replace: true }));
  }, [sessionId, navigate]);

  // ── 세션 로드 — 실패해도 redirect 안 함 ────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    setMessages([]);
    setThinkingSteps([]);
    setCrawlingStatus(null);
    setPlanId(null);
    setError(null);
    autoStartFired.current = false;
    setLoading(true);
    setLoadError(null);

    getAgentSession(sessionId)
      .then((s) => {
        setSession(s);
        if (s.messages && s.messages.length > 0) {
          setMessages(s.messages.map((m: AgentMessage) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            isStreaming: false,
          })));
        }
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404) {
          setLoadError('세션을 찾을 수 없습니다.');
        } else {
          setLoadError('세션을 불러오지 못했습니다. 다시 시도해주세요.');
        }
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  // ── autoStart: travel_info를 첫 메시지로 자동 전송 ──────────────────────
  // session이 로드되고, autoStart=true이며, destination이 있을 때 1회만 실행
  useEffect(() => {
    if (!session || !autoStart || autoStartFired.current || isStreaming) return;
    if (!session.travel_info?.destination) return;
    autoStartFired.current = true;
    handleSend(buildTravelInfoMessage(session.travel_info));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, autoStart]);

  // ── 스크롤 ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── 언마운트 시 스트림 정리 ──────────────────────────────────────────────
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  // ── 메시지 전송 ─────────────────────────────────────────────────────────────
  const handleSend = useCallback(async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || !sessionId || isStreaming) return;

    setInput('');
    setIsStreaming(true);
    setThinkingSteps([]);
    setCrawlingStatus(null);
    setError(null);

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', isStreaming: true },
    ]);

    abortRef.current = new AbortController();

    try {
      await streamChat(
        sessionId,
        text,
        (event: SSEEvent) => {
          switch (event.type) {
            case 'delta':
              if (!event.delta) break;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + event.delta } : m
                )
              );
              break;

            case 'thinking_step':
              if (event.step) {
                setThinkingSteps((prev) => [
                  ...prev,
                  { text: event.step!, timestamp: Date.now() },
                ]);
              }
              break;

            case 'tool_result':
              if (event.result) {
                setCrawlingStatus(event.result);
                const r = event.result;
                if (r.accommodation_count > 0 || r.activity_count > 0 ||
                    r.flight_count > 0 || r.has_exchange_rate) {
                  setCrawlingDone(true);
                }
              }
              break;

            case 'phase_change':
              // event.session이 있으면 전체 세션 교체 (concepts 포함)
              // 없으면 phase + concepts만 병합
              setSession((prev) => {
                if (!prev) return prev;
                if (event.session) return event.session;
                return {
                  ...prev,
                  phase: event.phase ?? prev.phase,
                  concepts: event.concepts ?? prev.concepts,
                };
              });
              break;

            case 'done':
              // event.session이 있으면 전체 세션 교체 (phase, concepts 모두 최신화)
              // 없으면 plan 정보만 병합
              if (event.session) {
                setSession(event.session);
              } else {
                setSession((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    concepts: event.concepts ?? prev.concepts,
                  };
                });
              }
              if (event.plan_id) setPlanId(event.plan_id);
              setCrawlingDone(false);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, isStreaming: false } : m
                )
              );
              break;

            case 'error':
              setError(event.error ?? '오류가 발생했습니다.');
              break;
          }
        },
        abortRef.current.signal
      );
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') {
        setError('연결이 끊겼습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsStreaming(false);
      setMessages((prev) =>
        prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
      );
    }
  }, [input, sessionId, isStreaming]);

  // ── 컨셉 선택 ───────────────────────────────────────────────────────────────
  const handleSelectConcept = useCallback(async (conceptId: string) => {
    if (!sessionId || isStreaming) return;
    try {
      const updated = await selectConcept(sessionId, conceptId);
      setSession(updated);
      handleSend('이 컨셉으로 확정할게요!');
    } catch {
      setError('컨셉 선택에 실패했습니다.');
    }
  }, [sessionId, isStreaming, handleSend]);

  // ── 로딩 화면 ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        flexDirection: 'column', gap: '12px',
      }}>
        <div style={{
          width: '32px', height: '32px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>대화를 불러오는 중...</p>
        <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
      </div>
    );
  }

  // ── 에러 화면 ────────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background flex-col gap-4">
        <p className="font-body text-on-surface-variant">{loadError}</p>
        <button
          type="button"
          onClick={() => navigate('/plan')}
          className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm font-semibold font-body"
        >
          돌아가기
        </button>
      </div>
    );
  }

  if (!session) return null;

  const destination = session.travel_info?.destination || '채팅';

  // ── 렌더 ─────────────────────────────────────────────────────────────────────
  return (
    <AppLayout topBarTitle={destination ? `${destination} 계획 세우기` : '채팅'}>
      <div className="flex h-[calc(100vh-5rem)]">
        <ChatSidebar
          currentSessionId={sessionId}
          onSelectSession={(id) => navigate(`/chat?sessionId=${id}`)}
          onNewChat={() => navigate('/plan')}
        />
        <main className="flex-1 flex flex-col min-w-0">
      <div className="flex flex-col h-full max-w-3xl mx-auto px-4 pb-4 w-full">

        {/* 상단 바 */}
        <div className="flex items-center justify-between py-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/plan')}
              className="text-outline-variant hover:text-primary transition-colors"
              aria-label="여행 목록으로"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            {session.phase && (
              <span className="text-primary text-xs font-bold uppercase tracking-widest">
                {session.phase}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/plan')}
              className="bg-surface-container text-on-surface-variant px-4 py-1.5 rounded-full text-sm font-semibold font-body hover:bg-surface-container-high transition-colors"
            >
              새 여행 만들기
            </button>
            {planId && (
              <button
                type="button"
                onClick={() => navigate(`/itinerary?planId=${planId}`, { state: { forceRefresh: true } })}
                className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-sm font-semibold font-body"
              >
                플랜 보기
              </button>
            )}
          </div>
        </div>

        {/* 크롤링 + 계획 생성 진행 상태 */}
        <CrawlingStatus
          phase={session.phase}
          isStreaming={isStreaming}
          crawlingStatus={crawlingStatus}
          thinkingSteps={thinkingSteps.map((s) => s.text)}
          isDone={!!planId && !isStreaming}
        />

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 no-scrollbar pb-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap font-body ${
                  msg.role === 'user'
                    ? 'bg-primary text-on-primary rounded-[18px_18px_4px_18px]'
                    : 'bg-surface-container-low text-on-surface rounded-[18px_18px_18px_4px]'
                }`}
              >
                {msg.content || (msg.isStreaming ? '···' : '')}
              </div>
            </div>
          ))}

          {/* 컨셉 카드 — guideline phase */}
          {session.phase === 'guideline' && session.concepts && session.concepts.length > 0 && (
            <div className="flex flex-col gap-3 py-2">
              <p className="text-primary text-xs font-bold uppercase tracking-widest px-1">
                여행 컨셉을 선택해주세요
              </p>
              {session.concepts.map((concept: Concept, i: number) => (
                <button
                  key={concept.id ?? i}
                  type="button"
                  onClick={() => handleSelectConcept(concept.id ?? concept.title)}
                  disabled={isStreaming}
                  className="bg-surface-container-lowest rounded-2xl p-4 text-left shadow-ambient hover:ring-1 hover:ring-primary/20 transition-all disabled:opacity-50"
                >
                  <p className="font-headline font-bold text-on-surface mb-1">
                    {concept.title}
                  </p>
                  <p className="font-body text-sm text-on-surface-variant mb-3">
                    {concept.description}
                  </p>
                  {concept.tags && concept.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {concept.tags.map((tag: string, ti: number) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 bg-surface-container text-primary text-xs font-semibold rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* result/editing phase — 플랜 완성·수정 알림 */}
          {(session.phase === 'result' || session.phase === 'editing') && planId && (
            <div className="bg-surface-container-low rounded-2xl p-6 text-center">
              <p className="font-headline font-bold text-on-surface text-lg mb-3">
                여행 계획이 완성됐어요!
              </p>
              <button
                type="button"
                onClick={() => navigate(`/itinerary?planId=${planId}`, { state: { forceRefresh: true } })}
                className="signature-gradient text-on-primary px-6 py-2.5 rounded-full font-semibold font-body"
              >
                플랜 상세보기
              </button>
            </div>
          )}

          {/* 에러 */}
          {error && (
            <div className="bg-surface-container-low rounded-xl px-4 py-3 text-sm font-body text-on-surface-variant">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 자동응답 버튼 */}
        <QuickReplyButtons
          phase={session.phase}
          session={session}
          onSend={handleSend}
          isStreaming={isStreaming}
        />

        {/* 크롤링 완료 후 계획 생성 버튼 */}
        {crawlingDone && !isStreaming && session?.phase === 'planning' && (
          <div style={{
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #f0fdf4, #eff6ff)',
            border: '1px solid #86efac',
            borderRadius: '12px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            animation: 'fadeIn 0.4s ease',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#166534' }}>
                🎯 실시간 데이터 수집 완료!
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>
                숙소 {crawlingStatus?.accommodation_count ?? 0}개 ·
                액티비티 {crawlingStatus?.activity_count ?? 0}개 ·
                {crawlingStatus?.has_exchange_rate ? ' 환율 ✓' : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCrawlingDone(false);
                handleSend('계획 세워줘');
              }}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
              }}
            >
              ✨ 계획 생성하기
            </button>
          </div>
        )}

        {/* 입력창 */}
        <div className="flex gap-2 items-center bg-surface-container-lowest rounded-2xl px-4 py-3 shadow-ambient mt-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              isStreaming
                ? 'AI가 응답 중...'
                : (session.phase === 'result' || session.phase === 'editing')
                  ? '추가 수정사항을 입력하세요'
                  : '메시지를 입력하세요'
            }
            disabled={isStreaming}
            className="flex-1 bg-transparent outline-none font-body text-sm text-on-surface placeholder:text-outline-variant disabled:opacity-50"
          />
          {isStreaming && (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="text-outline-variant hover:text-primary transition-colors shrink-0"
              aria-label="중지"
            >
              <span className="material-symbols-outlined text-lg">stop_circle</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isStreaming || !input.trim()}
            className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-sm font-semibold font-body disabled:opacity-40 transition-opacity shrink-0"
          >
            {isStreaming ? '···' : '전송'}
          </button>
        </div>

      </div>
        </main>
      </div>
    </AppLayout>
  );
}
