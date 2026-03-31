import { useEffect, useState } from 'react';
import type { SessionSummary } from '@/types/api';
import { getSessionList } from '@/api/agent';

interface ChatSidebarProps {
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

const IN_PROGRESS_PHASES = new Set(['initial', 'guideline', 'detail_collect', 'planning']);

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}`;
}

export default function ChatSidebar({ currentSessionId, onSelectSession, onNewChat }: ChatSidebarProps) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);

  useEffect(() => {
    getSessionList()
      .then(setSessions)
      .catch(() => setSessions([]));
  }, []);

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      height: '100%',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      background: '#f9fafb',
      padding: '16px 0',
      overflowY: 'auto',
    }}>
      {/* 새 여행 계획 버튼 */}
      <div style={{ padding: '0 12px 12px' }}>
        <button
          type="button"
          onClick={onNewChat}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          새 여행 계획
        </button>
      </div>

      {/* 세션 목록 */}
      <div style={{ flex: 1 }}>
        {sessions.length === 0 && (
          <p style={{ padding: '12px 16px', fontSize: '13px', color: '#9ca3af' }}>
            여행 기록이 없습니다.
          </p>
        )}
        {sessions.map((s) => {
          const isActive = s.id === currentSessionId;
          const inProgress = IN_PROGRESS_PHASES.has(s.phase);
          const dateStr = formatDate(s.start_date);

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSession(s.id)}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: isActive ? '#e0e7ff' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.destination || '목적지 미정'}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  background: inProgress ? '#fef9c3' : '#dcfce7',
                  color: inProgress ? '#854d0e' : '#166534',
                  marginLeft: '6px',
                  flexShrink: 0,
                }}>
                  {inProgress ? '진행중' : '완성'}
                </span>
              </div>
              {dateStr && (
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{dateStr}</span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
