import type { Task } from '../types/index';
import type { ItineraryStop } from '../types/index';
import { AppLayout } from '../components/layout';
import { TaskCard } from '../components/features/tasks';
import { SectionHeader } from '../components/ui';
import { ProgressBar, EmptySlot } from '../components/common';
import { usePlans, usePlanDetail } from '../hooks/usePlans';

const categoryToIcon = (category: string): string => {
  switch (category) {
    case 'dining': return 'restaurant';
    case 'transit': return 'directions_car';
    case 'sightseeing': return 'explore';
    case 'stay': return 'hotel';
    default: return 'travel_explore';
  }
};

const stopToTask = (stop: ItineraryStop): Task => ({
  id: stop.id,
  title: stop.title,
  description: stop.description || stop.subtitle || stop.location || '',
  status: 'todo',
  icon: categoryToIcon(stop.category),
  ctaLabel: '상세 보기',
  assignees: [],
});

export default function TaskPage() {
  const { plans, isLoading: plansLoading } = usePlans();
  const firstPlanId = plans[0]?.id ?? null;
  const { tripDays, isLoading: detailLoading } = usePlanDetail(firstPlanId);

  const isLoading = plansLoading || detailLoading;
  const allStops = tripDays.flatMap((day) => day.stops);
  const tasks = allStops.map(stopToTask);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <EmptySlot label="Generate Itinerary로 일정을 만들어보세요" icon="travel_explore" />
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
