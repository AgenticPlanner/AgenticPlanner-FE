import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { APIPlanItem } from '../types/api';
import { AppLayout } from '../components/layout';
import { EmptyState } from '../components/common';
import { TaskSection } from '../components/features/tasks';
import { usePlanContext } from '../contexts/PlanContext';
import { toggleItemDone, getPlanBudgetSummary, type BudgetSummary } from '../api/plans';

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

  // ─── 섹션 데이터 계산 ────────────────────────────────────────────────────────

  const allTasks = useMemo(
    () => localItems.filter(i => i.is_task === true).sort((a, b) => {
      const order: Record<string, number> = { BOOKING: 0, REVIEW: 1, TIPS: 2 };
      return (order[a.task_section ?? ''] ?? 3) - (order[b.task_section ?? ''] ?? 3);
    }),
    [localItems],
  );

  const explicitBooking = useMemo(() => allTasks.filter(i => i.task_section === 'BOOKING'), [allTasks]);

  const bookingFallback = useMemo(
    () => localItems.filter(i =>
      !i.is_task &&
      (i.category === 'TRANSPORT' || i.category === 'ACCOMMODATION' || i.category === 'ACTIVITY'),
    ),
    [localItems],
  );

  const bookingItems = useMemo(
    () => explicitBooking.length > 0 ? explicitBooking : bookingFallback,
    [explicitBooking, bookingFallback],
  );

  const reviewItems = useMemo(() => allTasks.filter(i => i.task_section === 'REVIEW'), [allTasks]);
  const tipsItems   = useMemo(() => allTasks.filter(i => i.task_section === 'TIPS'),   [allTasks]);

  // ─── 완료도 ──────────────────────────────────────────────────────────────────

  const checkableBooking = bookingItems.filter(i => i.is_task);
  const bookingDone      = checkableBooking.filter(i => i.is_done).length;
  const bookingTotal     = checkableBooking.length;
  const completionRate   = bookingTotal > 0 ? Math.round(bookingDone / bookingTotal * 100) : 0;

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

  // ─── 렌더 ────────────────────────────────────────────────────────────────────

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
            <div className="bg-red-50 text-red-600 text-sm font-medium rounded-xl px-5 py-4">{error}</div>
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
              const items = section === 'BOOKING' ? bookingItems : section === 'REVIEW' ? reviewItems : tipsItems;
              if (items.length === 0) return null;
              return (
                <TaskSection
                  key={section}
                  section={section}
                  items={items}
                  onToggle={handleToggleDone}
                />
              );
            })}
          </>
        )}
      </div>
    </AppLayout>
  );
}
