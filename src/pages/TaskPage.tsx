import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/index';
import type { APIPlanItem } from '../types/api';
import { AppLayout } from '../components/layout';
import { TaskCard } from '../components/features/tasks';
import { SectionHeader } from '../components/ui';
import { ProgressBar, EmptySlot } from '../components/common';
import { usePlans, usePlanDetail } from '../hooks/usePlans';

const categoryToIcon = (category: APIPlanItem['category']): string => {
  switch (category) {
    case 'FOOD':          return 'restaurant';
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
  const { plans, isLoading: plansLoading } = usePlans();
  const firstPlanId = plans[0]?.id ?? null;
  const { tripDays, isLoading: detailLoading } = usePlanDetail(firstPlanId);

  const isLoading = plansLoading || detailLoading;

  // tripDays에서 직접 task 생성 (각 stop의 원본 데이터가 필요하지만
  // APIPlan.days를 통해 items를 직접 접근)
  const latestPlan = plans[0];
  const allItems: APIPlanItem[] = latestPlan?.days
    ? [...latestPlan.days]
        .sort((a, b) => a.day_number - b.day_number)
        .flatMap(day => [...day.items].sort((a, b) => a.order_index - b.order_index))
    : [];

  // plans[0].days가 비어 있으면(list API가 days 미포함) tripDays fallback 사용
  const tasks: Task[] = allItems.length > 0
    ? allItems.map(itemToTask)
    : tripDays.flatMap(day => day.stops).map(stop => ({
        id: stop.id,
        title: stop.title,
        description: stop.description || stop.subtitle || stop.location || '',
        status: stop.status === 'CONFIRMED' ? 'done' : 'todo' as Task['status'],
        icon: categoryToIcon(
          stop.category === 'transit' ? 'TRANSPORT'
          : stop.category === 'stay' ? 'ACCOMMODATION'
          : stop.category === 'dining' ? 'FOOD'
          : 'ACTIVITY'
        ),
        ctaLabel: stop.externalLink ? '예약하기' : '상세 보기',
        assignees: [],
      }));

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

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">
              checklist
            </span>
            <p className="font-headline font-bold text-xl text-on-surface mb-2">할 일이 없어요</p>
            <p className="text-on-surface-variant text-sm mb-8">
              일정을 생성하면 예약할 항목들이 여기에 표시돼요.
            </p>
            <button
              type="button"
              onClick={() => navigate('/plan')}
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-semibold text-sm hover:scale-[1.02] transition-all"
            >
              일정 만들러 가기
            </button>
          </div>
        )}

        {/* Bento Grid */}
        {!isLoading && tasks.length > 0 && (
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
