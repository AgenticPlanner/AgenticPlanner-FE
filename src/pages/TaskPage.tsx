import { AppLayout } from '../components/layout';
import { TaskCard } from '../components/features/tasks';
import { SectionHeader } from '../components/ui';
import { ProgressBar, EmptySlot } from '../components/common';
import { tripTasks } from '../data/tripData';

export default function TaskPage() {
  // Calculate progress percentage
  const doneCount = tripTasks.filter(task => task.status === 'done').length;
  const progressPercentage = Math.round((doneCount / tripTasks.length) * 100);

  return (
    <AppLayout topBarTitle="작업">
      <div className="px-10 py-12 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="mb-16">
          <SectionHeader
            eyebrow="여행 기반"
            title="기본 계획"
            subtitle="태평양 해안 고속도로 여행의 모든 준비 작업을 추적하세요"
            titleSize="4xl"
            rightSlot={
              <div className="text-right">
                <div className="font-headline font-bold text-2xl text-on-surface">
                  {progressPercentage}%
                </div>
                <p className="text-outline text-sm">진행률</p>
              </div>
            }
          />

          {/* Progress bar */}
          <div className="mt-8">
            <ProgressBar value={progressPercentage} showLabel={false} />
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured task (in-progress) */}
          <TaskCard task={tripTasks[0]} featured={true} />

          {/* Standard tasks */}
          <TaskCard task={tripTasks[1]} />
          <TaskCard task={tripTasks[2]} />
          <TaskCard task={tripTasks[3]} />
          <TaskCard task={tripTasks[4]} />

          {/* Add Milestone placeholder */}
          <EmptySlot label="마일스톤 추가" icon="add" />
        </div>
      </div>
    </AppLayout>
  );
}
