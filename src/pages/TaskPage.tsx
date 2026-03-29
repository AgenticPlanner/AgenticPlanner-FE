import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/index';
import type { APIPlanItem } from '../types/api';
import { AppLayout } from '../components/layout';
import { TaskCard, TaskSkeleton } from '../components/features/tasks';
import { SectionHeader } from '../components/ui';
import { ProgressBar, EmptySlot, EmptyState } from '../components/common';
import { usePlanContext } from '../contexts/PlanContext';

const categoryToIcon = (category: APIPlanItem['category']): string => {
  switch (category) {
    case 'RESTAURANT':    return 'restaurant';
    case 'TRANSPORT':     return 'directions_car';
    case 'ACTIVITY':      return 'explore';
    case 'ACCOMMODATION': return 'hotel';
    default:              return 'travel_explore';
  }
};

const statusToTaskStatus = (status: APIPlanItem['status']): Task['status'] => {
  if (status === 'CONFIRMED') return 'done';
  if (status === 'CANCELLED') return 'done';
  return 'todo';
};

const itemToTask = (item: APIPlanItem): Task => ({
  id: item.id,
  title: item.title,
  description: item.description || item.subtitle || item.location || '',
  status: statusToTaskStatus(item.status),
  icon: categoryToIcon(item.category),
  ctaLabel: item.external_link ? '예약하기' : '상세 보기',
  assignees: [],
});

export default function TaskPage() {
  const navigate = useNavigate();
  const { activePlan, loading, error, refetch } = usePlanContext();

  const allItems = useMemo(() => {
    if (!activePlan?.days) return [];
    return [...activePlan.days]
      .sort((a, b) => a.day_number - b.day_number)
      .flatMap(day =>
        [...(day.items ?? [])].sort((a, b) => a.order_index - b.order_index)
      );
  }, [activePlan]);

  const tasks: Task[] = useMemo(() => allItems.map(itemToTask), [allItems]);

  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const progressPercentage = tasks.length > 0
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;

  return (
    <AppLayout topBarTitle="작업">
      <div className="px-4 py-6 md:px-10 md:py-12 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="mb-16">
          <SectionHeader
            eyebrow="여행 기반"
            title="기본 계획"
            subtitle="여행 일정의 모든 항목을 확인하세요"
            titleSize="4xl"
            rightSlot={
              tasks.length > 0 ? (
                <div className="text-right">
                  <div className="font-headline font-bold text-2xl text-on-surface">
                    {progressPercentage}%
                  </div>
                  <p className="text-outline text-sm">진행률</p>
                </div>
              ) : null
            }
          />
          {tasks.length > 0 && (
            <div className="mt-8">
              <ProgressBar value={progressPercentage} showLabel={false} />
            </div>
          )}
        </div>

        {/* 로딩 */}
        {loading && <TaskSkeleton />}

        {/* 에러 */}
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

        {/* 플랜 없음 */}
        {!loading && !error && !activePlan && (
          <EmptyState
            icon="assignment"
            title="아직 플랜이 없어요"
            description="일정을 생성하면 예약할 항목들이 여기에 표시돼요."
            ctaLabel="플랜 만들러 가기"
            onCta={() => navigate('/plan')}
          />
        )}

        {/* 플랜 있지만 items 없음 */}
        {!loading && !error && activePlan && tasks.length === 0 && (
          <EmptyState
            icon="checklist"
            title="할 일이 없어요"
            description="일정을 생성하면 예약할 항목들이 여기에 표시돼요."
          />
        )}

        {/* Bento Grid */}
        {!loading && !error && tasks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task, idx) => (
              <TaskCard key={task.id} task={task} featured={idx === 0} />
            ))}
            <EmptySlot label="마일스톤 추가" icon="add" />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
