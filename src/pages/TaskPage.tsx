import { AppLayout } from '../components/layout';
import TaskCard from '../components/tasks/TaskCard';
import AddTaskPlaceholder from '../components/tasks/AddTaskPlaceholder';
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
          {/* Top row with title and progress */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-8">
            {/* Left side */}
            <div>
              <span className="block text-primary font-bold tracking-widest text-xs uppercase mb-2">
                여행 기반
              </span>
              <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-2">
                기본 계획
              </h1>
              <p className="text-on-surface-variant text-lg">
                태평양 해안 고속도로 여행의 모든 준비 작업을 추적하세요
              </p>
            </div>

            {/* Right side - Progress */}
            <div className="text-right">
              <div className="font-headline font-bold text-2xl text-on-surface">
                {progressPercentage}%
              </div>
              <p className="text-outline text-sm">진행률</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
            <div
              className="signature-gradient h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
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
          <AddTaskPlaceholder />
        </div>
      </div>
    </AppLayout>
  );
}
