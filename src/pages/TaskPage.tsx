import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { APIPlanItem } from '../types/api';
import { AppLayout } from '../components/layout';
import { EmptyState } from '../components/common';
import { usePlanContext } from '../contexts/PlanContext';
import { toggleItemDone, getPlanBudgetSummary, type BudgetSummary } from '../api/plans';

const SECTION_CONFIG = {
  BOOKING: {
    icon: '📋',
    label: '예약 & 구매',
    description: '출발 전 완료해야 할 예약/구매 목록',
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  REVIEW: {
    icon: '🔍',
    label: '리뷰 & 정보 확인',
    description: '방문 전 미리 확인할 여행지/맛집 후기',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
  },
  TIPS: {
    icon: '💡',
    label: '여행자 팁',
    description: '현지 여행자들의 꿀팁 모음',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
} as const;

interface TaskSectionProps {
  section: 'BOOKING' | 'REVIEW' | 'TIPS';
  config: typeof SECTION_CONFIG[keyof typeof SECTION_CONFIG];
  items: APIPlanItem[];
  onToggle: (item: APIPlanItem) => void;
  onRefresh: () => void;
}

function TipsSection({ items }: { items: APIPlanItem[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div style={{ padding: '8px' }}>
      {items.map(item => {
        const isExp = expandedIds.has(item.id);
        const summary = item.tip_summary ?? item.description ?? '';
        const previewLen = 80;
        const needsExpand = summary.length > previewLen;

        return (
          <div key={item.id} style={{
            padding: '12px',
            background: '#fafafa',
            borderRadius: '10px',
            marginBottom: '8px',
            border: '1px solid #f3f4f6',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '13px', color: '#374151' }}>
                  {item.title}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {isExp || !needsExpand ? summary : summary.slice(0, previewLen) + '...'}
                </p>
                {needsExpand && (
                  <button
                    onClick={() => toggle(item.id)}
                    style={{
                      marginTop: '6px', background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: '12px', color: '#8b5cf6',
                      fontWeight: 600, padding: 0,
                    }}
                  >
                    {isExp ? '접기 ▲' : '더 보기 ▼'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskItem({
  item,
  section,
  onToggle,
}: {
  item: APIPlanItem;
  section: 'BOOKING' | 'REVIEW';
  onToggle: (item: APIPlanItem) => void;
}) {
  const actionUrl = section === 'REVIEW'
    ? (item.review_url ?? item.external_link ?? '')
    : (item.external_link ?? '');

  const actionLabel = section === 'REVIEW'
    ? (item.review_url?.includes('youtube') ? '▶ 유튜브 리뷰' : '🔍 네이버 후기')
    : '예약하기 →';

  const actionColor = section === 'REVIEW'
    ? (item.review_url?.includes('youtube') ? '#ef4444' : '#03c75a')
    : '#3b82f6';

  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: item.is_done ? '#fafafa' : '#fff',
      opacity: item.is_done ? 0.75 : 1,
    }}>
      {section === 'BOOKING' && (
        <button
          onClick={() => onToggle(item)}
          style={{
            width: '22px', height: '22px', borderRadius: '50%',
            border: `2px solid ${item.is_done ? '#22c55e' : '#d1d5db'}`,
            background: item.is_done ? '#22c55e' : '#fff',
            cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: '#fff',
          }}
        >
          {item.is_done ? '✓' : null}
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: '14px', fontWeight: 500,
          color: item.is_done ? '#9ca3af' : '#111827',
          textDecoration: item.is_done ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.title}
        </p>
        {item.subtitle && (
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>
            {item.subtitle}
          </p>
        )}
      </div>
      {actionUrl && (
        <a
          href={actionUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 12px', background: actionColor, color: '#fff',
            borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}

function TaskSection({ section, config, items, onToggle, onRefresh: _onRefresh }: TaskSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{
      marginBottom: '16px',
      border: `1px solid ${config.border}`,
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', padding: '14px 16px', background: config.bg,
          border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: '8px', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '18px' }}>{config.icon}</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: '15px', color: config.color }}>
            {config.label}
          </span>
          <span style={{ marginLeft: '8px', fontSize: '12px', color: '#9ca3af' }}>
            {items.length}개
          </span>
        </div>
        <span style={{ fontSize: '12px', color: config.color, fontWeight: 500 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>
      {expanded && (
        <div style={{ background: '#fff' }}>
          {section === 'TIPS'
            ? <TipsSection items={items} />
            : items.map(item => (
                <TaskItem key={item.id} item={item} section={section} onToggle={onToggle} />
              ))
          }
        </div>
      )}
    </div>
  );
}

export default function TaskPage() {
  const navigate = useNavigate();
  const { activePlan, loading, error, refetch } = usePlanContext();

  const [localItems, setLocalItems] = useState<APIPlanItem[]>([]);
  const [, setBudgetSummary] = useState<BudgetSummary | null>(null);

  useEffect(() => {
    if (!activePlan?.days) return;
    const items = [...activePlan.days]
      .sort((a, b) => a.day_number - b.day_number)
      .flatMap(day => [...(day.items ?? [])].sort((a, b) => a.order_index - b.order_index));
    setLocalItems(items);
  }, [activePlan]);

  const planId = activePlan?.id ?? '';

  const refreshBudget = useCallback(() => {
    if (!planId) return;
    getPlanBudgetSummary(planId).then(setBudgetSummary).catch(() => {});
  }, [planId]);

  useEffect(() => { refreshBudget(); }, [refreshBudget]);

  const allTasks = useMemo(
    () => localItems.filter(i => i.is_task === true).sort((a, b) => {
      const order: Record<string, number> = { BOOKING: 0, REVIEW: 1, TIPS: 2 };
      return (order[a.task_section ?? ''] ?? 3) - (order[b.task_section ?? ''] ?? 3);
    }),
    [localItems],
  );
  const bookingItems = useMemo(() => allTasks.filter(i => i.task_section === 'BOOKING'), [allTasks]);
  const reviewItems  = useMemo(() => allTasks.filter(i => i.task_section === 'REVIEW'),  [allTasks]);
  const tipsItems    = useMemo(() => allTasks.filter(i => i.task_section === 'TIPS'),    [allTasks]);

  if (import.meta.env.DEV) {
    console.log('[TaskPage] 전체 아이템:', localItems.length, '/ task 수:', allTasks.length);
    console.log('[TaskPage] BOOKING:', bookingItems.length, 'REVIEW:', reviewItems.length, 'TIPS:', tipsItems.length);
  }

  const bookingDone = bookingItems.filter(i => i.is_done).length;
  const bookingTotal = bookingItems.length;
  const completionRate = bookingTotal > 0
    ? Math.round(bookingDone / bookingTotal * 100) : 0;

  const handleToggleDone = async (item: APIPlanItem) => {
    try {
      const updated = await toggleItemDone(item.id);
      setLocalItems(prev => prev.map(it => it.id === item.id ? updated : it));
      refreshBudget();
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const hasItems = bookingItems.length > 0 || reviewItems.length > 0 || tipsItems.length > 0;

  return (
    <AppLayout topBarTitle="작업">
      <div className="px-4 py-6 md:px-10 md:py-12 max-w-3xl mx-auto w-full">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <span className="text-on-surface-variant">로딩 중...</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="bg-red-50 text-red-600 text-sm font-medium rounded-xl px-5 py-4">
              {error}
            </div>
            <button
              type="button"
              onClick={refetch}
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && !activePlan && (
          <EmptyState
            icon="assignment"
            title="아직 플랜이 없어요"
            description="일정을 생성하면 예약할 항목들이 여기에 표시돼요."
            ctaLabel="플랜 만들러 가기"
            onCta={() => navigate('/plan')}
          />
        )}

        {!loading && !error && activePlan && !hasItems && (
          <EmptyState
            icon="checklist"
            title="할 일이 없어요"
            description="일정을 생성하면 예약할 항목들이 여기에 표시돼요."
          />
        )}

        {!loading && !error && hasItems && (
          <>
            {bookingTotal > 0 && (
              <div style={{
                padding: '16px 20px', background: '#fff', borderRadius: '12px',
                border: '1px solid #e5e7eb', marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>예약 완료도</span>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: completionRate === 100 ? '#22c55e' : '#3b82f6' }}>
                    {bookingDone}/{bookingTotal} ({completionRate}%)
                  </span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${completionRate}%`,
                    background: completionRate === 100
                      ? 'linear-gradient(90deg,#22c55e,#16a34a)'
                      : 'linear-gradient(90deg,#3b82f6,#6366f1)',
                    height: '100%', borderRadius: '999px', transition: 'width 0.5s ease',
                  }} />
                </div>
                {completionRate === 100 && (
                  <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: '13px', color: '#166534', fontWeight: 500 }}>
                    🎉 모든 예약을 완료했어요!
                  </p>
                )}
              </div>
            )}

            {(['BOOKING', 'REVIEW', 'TIPS'] as const).map(section => {
              const cfg = SECTION_CONFIG[section];
              const items = section === 'BOOKING' ? bookingItems
                : section === 'REVIEW' ? reviewItems
                : tipsItems;
              if (items.length === 0) return null;
              return (
                <TaskSection
                  key={section}
                  section={section}
                  config={cfg}
                  items={items}
                  onToggle={handleToggleDone}
                  onRefresh={refreshBudget}
                />
              );
            })}
          </>
        )}
      </div>
    </AppLayout>
  );
}
