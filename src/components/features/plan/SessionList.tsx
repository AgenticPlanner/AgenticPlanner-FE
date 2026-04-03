import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AgentSession } from '@/types/api';
import { listAgentSessions } from '@/api/agent';

interface PhaseInfo {
  text: string;
  className: string;
}

const PHASE_INFO: Record<string, PhaseInfo> = {
  initial:        { text: '대화 시작',  className: 'bg-surface-container text-on-surface-variant' },
  detail_collect: { text: '정보 수집',  className: 'bg-surface-container text-on-surface-variant' },
  guideline:      { text: '컨셉 선택',  className: 'bg-surface-container-low text-primary' },
  planning:       { text: '생성 중',    className: 'bg-surface-container-low text-primary' },
  result:         { text: '완성',       className: 'bg-primary text-on-primary' },
  editing:        { text: '수정 중',    className: 'bg-surface-container text-on-surface-variant' },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function SessionList() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = useCallback(() => {
    setIsLoading(true);
    listAgentSessions()
      .then((data) => setSessions(data))
      .catch(() => setSessions([]))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-surface-container-lowest">
      {/* 헤더 */}
      <div className="px-6 py-5 flex items-center justify-between shrink-0">
        <div>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">여행 기록</p>
          <h3 className="font-headline font-bold text-on-surface text-lg">지난 여행들</h3>
        </div>
        <button
          type="button"
          onClick={fetchSessions}
          aria-label="새로고침"
          className="text-outline-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-xl">refresh</span>
        </button>
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3 no-scrollbar">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-container-low rounded-2xl p-4 animate-pulse space-y-2">
              <div className="h-4 bg-surface-container rounded w-3/4" />
              <div className="h-3 bg-surface-container rounded w-1/2" />
              <div className="h-3 bg-surface-container rounded w-1/3" />
            </div>
          ))
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-3">
              luggage
            </span>
            <p className="font-body font-semibold text-on-surface-variant text-sm">
              아직 생성된 여행이 없어요
            </p>
            <p className="font-body text-xs text-outline-variant mt-1">
              왼쪽 폼을 채우고 시작해보세요
            </p>
          </div>
        ) : (
          sessions.map((session) => {
            const phaseInfo = PHASE_INFO[session.phase] ?? {
              text: session.phase,
              className: 'bg-surface-container text-on-surface-variant',
            };
            const destination = session.travel_info?.destination || '목적지 미정';
            const startDate = session.travel_info?.start_date;
            const endDate = session.travel_info?.end_date;
            const dateRange = startDate && endDate ? `${startDate} ~ ${endDate}` : '';

            return (
              <button
                key={session.id}
                type="button"
                onClick={() => navigate(`/chat?sessionId=${session.id}`)}
                className="w-full text-left bg-surface-container-lowest rounded-2xl p-4 shadow-ambient hover:ring-1 hover:ring-primary/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-headline font-bold text-on-surface text-base leading-tight">
                    {destination}
                  </p>
                  <span className={`shrink-0 text-xs font-semibold font-body px-2.5 py-0.5 rounded-full ${phaseInfo.className}`}>
                    {phaseInfo.text}
                  </span>
                </div>
                {dateRange && (
                  <p className="font-body text-xs text-on-surface-variant mb-2">{dateRange}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="font-body text-xs text-outline-variant">
                    {formatDate(session.created_at)} 생성
                  </p>
                  <span className="material-symbols-outlined text-base text-outline-variant group-hover:text-primary transition-colors">
                    arrow_forward
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
