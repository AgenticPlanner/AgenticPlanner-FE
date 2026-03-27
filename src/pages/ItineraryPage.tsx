
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { DaySelector, TimelineThread, StopCard, DaySidebar } from '@/components/features/itinerary';
import { FABGroup, ResizeDivider } from '@/components/common';
import { usePanelResize } from '@/hooks/usePanelResize';
import { usePlans, usePlanDetail } from '@/hooks/usePlans';

type ItineraryMobileTab = 'timeline' | 'sidebar';

export default function ItineraryPage() {
  const [searchParams] = useSearchParams();
  const planIdParam = searchParams.get('planId');

  const { plans } = usePlans();
  const activePlanId = planIdParam || plans[0]?.id || null;

  const { plan, tripDays, isLoading, error } = usePlanDetail(activePlanId);

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const activeDay = tripDays[activeDayIndex] ?? null;
  const currentStops = activeDay?.stops ?? [];

  const [mobileTab, setMobileTab] = useState<ItineraryMobileTab>('timeline');

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const { size: timelineWidth, isDragging, handleMouseDown, handleTouchStart } = usePanelResize({
    direction: 'horizontal',
    initialSize: 66,
    minSize: 50,
    maxSize: 80,
    unit: 'percent',
    storageKey: 'itinerary-timeline-panel',
    containerRef,
  });

  return (
    <AppLayout topBarTitle={plan?.title || '일정'}>
      <div className="pt-8 px-4 md:px-12 pb-20 max-w-6xl w-full mx-auto">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
          </div>
        )}

        {/* 에러 상태 */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-600 text-sm font-medium rounded-xl px-5 py-4 mb-8">
            {error}
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && !error && tripDays.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">map</span>
            <p className="font-headline font-bold text-xl text-on-surface mb-2">아직 일정이 없어요</p>
            <p className="text-on-surface-variant text-sm">Plan 페이지에서 Generate Itinerary로 일정을 만들어보세요.</p>
          </div>
        )}

        {!isLoading && tripDays.length > 0 && activeDay && (
          <>
            {/* Hero Section */}
            <div className="mb-10 md:mb-16">
              <span className="block text-primary font-bold tracking-widest text-xs uppercase mb-2">
                {plan?.description || '여행 일정'}
              </span>
              <h3 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface mb-8 md:mb-10">
                {plan?.title || '여행 일정'}
              </h3>

              {/* Day Selector — horizontal scroll on mobile */}
              <div className="overflow-x-auto no-scrollbar">
                <DaySelector
                  days={tripDays}
                  activeDayIndex={activeDayIndex}
                  onSelect={setActiveDayIndex}
                />
              </div>
            </div>

            {/* Mobile panel switcher */}
            <div className="flex md:hidden bg-surface-container rounded-xl p-1 mb-8">
              {(['timeline', 'sidebar'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMobileTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${mobileTab === tab
                    ? 'bg-surface-container-lowest text-primary shadow-ambient'
                    : 'text-on-surface-variant'
                    }`}
                >
                  {tab === 'timeline' ? 'Timeline' : 'Stats'}
                </button>
              ))}
            </div>

            {/* Resizable two-panel layout */}
            <div
              ref={containerRef}
              className={`flex items-start ${isDragging ? 'pointer-events-none select-none' : ''}`}
            >
              {/* Timeline panel */}
              <div
                className={`${mobileTab === 'timeline' ? 'w-full md:w-auto' : 'hidden md:block'} relative min-w-0`}
                style={isMobile ? undefined : { width: `${timelineWidth}%` }}
              >
                <div className="space-y-12 relative" key={activeDayIndex}>
                  <TimelineThread />
                  {currentStops.map((stop) => (
                    <StopCard key={stop.id} stop={stop} />
                  ))}
                  {currentStops.length === 0 && (
                    <p className="text-on-surface-variant text-sm py-8 text-center">이 날의 일정이 없습니다.</p>
                  )}
                </div>
              </div>

              {/* Resize divider — desktop only */}
              <ResizeDivider
                direction="horizontal"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                isDragging={isDragging}
                className="hidden md:flex self-stretch"
              />

              {/* Sidebar panel */}
              <div
                className={`${mobileTab === 'sidebar' ? 'w-full md:w-auto' : 'hidden md:block'} flex-1 min-w-0 space-y-8 lg:sticky lg:top-28`}
              >
                <DaySidebar day={activeDay} dayIndex={activeDayIndex + 1} />
              </div>
            </div>

            {/* Floating Action Buttons */}
            <FABGroup onShare={() => { }} onAdd={() => { }} addIcon="add_task" />
          </>
        )}
      </div>
    </AppLayout>
  );
}
