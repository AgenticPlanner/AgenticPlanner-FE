import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { DaySelector, TimelineThread, StopCard, TipCard, DaySidebar, ItinerarySkeleton } from '@/components/features/itinerary';
import { FABGroup, ResizeDivider, EmptyState } from '@/components/common';
import { StatRow } from '@/components/ui';
import { usePanelResize } from '@/hooks/usePanelResize';
import { usePlanContext } from '@/contexts/PlanContext';
import { adaptPlanToTripDays } from '@/utils/adapters';
type ItineraryMobileTab = 'timeline' | 'sidebar';

export default function ItineraryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlPlanId = searchParams.get('planId');

  const { activePlan, activePlanId, setActivePlanId, loading, error, refetch } = usePlanContext();

  // URL planId가 있으면 해당 플랜 활성화
  useEffect(() => {
    if (urlPlanId && urlPlanId !== activePlanId) {
      setActivePlanId(urlPlanId);
    }
  }, [urlPlanId, activePlanId, setActivePlanId]);

  const tripDays = activePlan ? adaptPlanToTripDays(activePlan) : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // 플랜 전환 시 Day 1로 리셋
  useEffect(() => {
    setActiveDayIndex(0);
  }, [activePlanId]);

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
    <AppLayout topBarTitle={activePlan?.title || '일정'}>
      {/* 그라데이션 추가 */}
      <div className="bg-itinerary-gradient min-h-full">
        <div className="pt-12 px-6 md:px-12 pb-20 max-w-6xl w-full mx-auto font-body">
          {/* 로딩 */}
          {loading && (
            <div className="mt-8">
              <ItinerarySkeleton />
            </div>
          )}

          {/* 에러 */}
          {error && !loading && (
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="bg-red-50 text-red-600 text-sm font-medium rounded-xl px-5 py-4">
                {error}
              </div>
              <button
                type="button"
                onClick={refetch}
                className="bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 플랜 없음 */}
          {!loading && !error && !activePlan && (
            <EmptyState
              icon="map"
              title="아직 플랜이 없어요"
              description="Plan 페이지에서 Captain Bean과 대화해 첫 여행 계획을 만들어보세요."
              ctaLabel="플랜 만들러 가기"
              onCta={() => navigate('/plan')}
            />
          )}

          {/* 플랜 있지만 일정 없음 */}
          {!loading && !error && activePlan && tripDays.length === 0 && (
            <EmptyState
              icon="event_note"
              title="일정이 아직 없어요"
              description="Captain Bean에게 세부 일정을 요청해보세요."
              ctaLabel="채팅하러 가기"
              onCta={() => navigate('/plan')}
            />
          )}

          {/* 정상 렌더링 */}
          {!loading && activePlan && tripDays.length > 0 && activeDay && (
            <>
              {/* Hero Section */}
              <div className="mb-10 md:mb-16 flex flex-col items-start gap-8">
                <div className="inline-flex flex-col items-start gap-2">
                  <span className="text-xs font-bold text-primary-dark tracking-[1.2px] uppercase">
                    {activePlan.plan_type || '여행 일정'}
                  </span>
                  <h2 className="font-body font-normal text-5xl leading-[48px] text-on-surface">
                    {activePlan.title || 'Trip Itinerary'}
                  </h2>
                </div>

                {/* Day Selector */}
                <div className="overflow-x-auto no-scrollbar w-full pb-2">
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
                      stop.category === 'tip'
                        ? <TipCard key={stop.id} stop={stop} />
                        : <StopCard key={stop.id} stop={stop} />
                    ))}
                    {currentStops.length === 0 && (
                      <p className="text-on-surface-variant text-sm py-16 text-center pl-0">
                        이 날의 일정이 없습니다.
                      </p>
                    )}
                  </div>
                </div>

                <ResizeDivider
                  direction="horizontal"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  isDragging={isDragging}
                  className="hidden md:flex self-stretch"
                />

                <div
                  className={`${mobileTab === 'sidebar' ? 'w-full md:w-auto' : 'hidden md:block'} flex-1 min-w-0 space-y-8 lg:sticky lg:top-28`}
                >
                  <DaySidebar
                    day={activeDay}
                    dayIndex={activeDayIndex + 1}
                    dailyInfo={activePlan.days?.[activeDayIndex]?.daily_info}
                    weather={activePlan.extra_data?.weather}
                    transport={activePlan.extra_data?.transport}
                    actualSpent={(() => {
                      const rawDay = activePlan.days?.[activeDayIndex];
                      if (!rawDay) return 0;
                      return rawDay.items
                        .filter(i => i.is_done && i.actual_amount)
                        .reduce((sum, i) => sum + Number(i.actual_amount), 0);
                    })()}
                  />

                  {activePlan.total_budget && Number(activePlan.total_budget) > 0 && (
                    <div className="bg-white rounded-xl  border border-surface-container-high p-6 shadow-header">
                      <h5 className="font-bold text-lg text-on-surface mb-4">
                        플랜 예산
                      </h5>
                      <StatRow
                        label="총 예산"
                        value={`₩${Number(activePlan.total_budget).toLocaleString()}`}
                        valueClassName="text-primary-dark"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Action Buttons */}
              <FABGroup onShare={() => { }} onAdd={() => { }} addIcon="add_task" />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}