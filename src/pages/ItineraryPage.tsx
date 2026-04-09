import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { DaySelector, TimelineThread, StopCard, DaySidebar, ItinerarySkeleton } from '@/components/features/itinerary';
import { FABGroup, ResizeDivider, EmptyState } from '@/components/common';
import { StatRow } from '@/components/ui';
import { usePanelResize } from '@/hooks/usePanelResize';
import { usePlanContext } from '@/contexts/PlanContext';
import { getPlan, getPlanBudgetSummary, type BudgetSummary } from '@/api/plans';
import type { APIPlan, APIPlanWeather } from '@/types/api';
import { adaptPlanToTripDays } from '@/utils/adapters';
type ItineraryMobileTab = 'timeline' | 'sidebar';

export default function ItineraryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const urlPlanId = searchParams.get('planId');

  const { activePlan, setActivePlanId, refetch } = usePlanContext();

  // 로컬 플랜 상태 — 마운트마다 직접 fetch하여 PlanContext 캐시 우회
  const [localPlan, setLocalPlan] = useState<APIPlan | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);

  const refreshBudget = useCallback(() => {
    if (!urlPlanId) return;
    getPlanBudgetSummary(urlPlanId).then(setBudgetSummary).catch(() => {});
  }, [urlPlanId]);

  // urlPlanId 변경 또는 마운트 시 항상 직접 API 호출 (컴포넌트 인스턴스가 바뀌므로 매 진입마다 실행됨)
  useEffect(() => {
    if (!urlPlanId) return;
    setLocalLoading(true);
    setLocalPlan(null);
    setLocalError(null);
    setBudgetSummary(null);
    getPlan(urlPlanId)
      .then(data => {
        setLocalPlan(data);
        setActivePlanId(urlPlanId); // PlanContext도 최신화 (다른 컴포넌트용)
      })
      .catch(() => setLocalError('플랜을 불러오지 못했습니다.'))
      .finally(() => setLocalLoading(false));
    refreshBudget();
  // setActivePlanId는 stable (useCallback [])이므로 deps 생략해도 안전
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPlanId]);

  // forceRefresh state 초기화 (뒤로가기 재발동 방지)
  useEffect(() => {
    if (!location.state?.forceRefresh) return;
    navigate(location.pathname + location.search, { replace: true, state: {} });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.forceRefresh]);

  // 표시할 플랜: 직접 fetch 결과 우선, 없으면 context fallback
  const plan = localPlan ?? activePlan;
  const isLoading = localLoading;
  const error = localError;

  const tripDays = plan ? adaptPlanToTripDays(plan) : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // 플랜 전환 시 Day 1로 리셋
  useEffect(() => {
    setActiveDayIndex(0);
  }, [urlPlanId]);

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
      {/* 그라데이션 추가 */}
      <div className="bg-itinerary-gradient min-h-full">
        <div className="pt-12 px-6 md:px-12 pb-20 max-w-6xl w-full mx-auto font-body">
          {/* 로딩 */}
          {isLoading && (
            <div className="mt-8">
              <ItinerarySkeleton />
            </div>
          )}

          {/* 에러 */}
          {error && !isLoading && (
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="bg-red-50 text-red-600 text-sm font-medium rounded-xl px-5 py-4">
                {error}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (urlPlanId) {
                    setLocalLoading(true);
                    setLocalError(null);
                    getPlan(urlPlanId)
                      .then(setLocalPlan)
                      .catch(() => setLocalError('플랜을 불러오지 못했습니다.'))
                      .finally(() => setLocalLoading(false));
                  } else {
                    refetch();
                  }
                }}
                className="bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 플랜 없음 */}
          {!isLoading && !error && !plan && (
            <EmptyState
              icon="map"
              title="아직 플랜이 없어요"
              description="Plan 페이지에서 Captain Bean과 대화해 첫 여행 계획을 만들어보세요."
              ctaLabel="플랜 만들러 가기"
              onCta={() => navigate('/plan')}
            />
          )}

          {/* 플랜 있지만 일정 없음 */}
          {!isLoading && !error && plan && tripDays.length === 0 && (
            <EmptyState
              icon="event_note"
              title="일정이 아직 없어요"
              description="Captain Bean에게 세부 일정을 요청해보세요."
              ctaLabel="채팅하러 가기"
              onCta={() => navigate('/plan')}
            />
          )}

          {/* 정상 렌더링 */}
          {!isLoading && plan && tripDays.length > 0 && activeDay && (
            <>
              {/* Hero Section */}
              <div className="mb-10 md:mb-16 flex flex-col items-start gap-8">
                <div className="inline-flex flex-col items-start gap-2">
                  <span className="text-xs font-bold text-primary-dark tracking-[1.2px] uppercase">
                    {plan.plan_type || '여행 일정'}
                  </span>
                  <h2 className="font-body font-normal text-5xl leading-[48px] text-on-surface">
                    {plan.title || 'Trip Itinerary'}
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
                      <StopCard key={stop.id} stop={stop} />
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
                    dailyInfo={plan.days?.[activeDayIndex]?.daily_info}
                    weather={(() => {
                      const dailyWeather = plan.days?.[activeDayIndex]?.daily_info?.weather;
                      if (dailyWeather?.avg_temp_c != null) return dailyWeather as unknown as APIPlanWeather;
                      return plan.extra_data?.weather;
                    })()}
                    transport={plan.extra_data?.transport}
                    actualSpent={(() => {
                      const rawDay = plan.days?.[activeDayIndex];
                      if (!rawDay) return 0;
                      return rawDay.items
                        .filter(i => i.is_done && i.actual_amount)
                        .reduce((sum, i) => sum + Number(i.actual_amount), 0);
                    })()}
                  />

                  {(budgetSummary || (plan.total_budget && Number(plan.total_budget) > 0)) && (
                    <div className="bg-white rounded-xl  border border-surface-container-high p-6 shadow-header">
                      <h5 className="font-bold text-lg text-on-surface mb-4">
                        플랜 예산
                      </h5>
                      <StatRow
                        label="총 예산"
                        value={(() => {
                          if (budgetSummary) {
                            const amt = budgetSummary.total_actual > 0
                              ? budgetSummary.total_actual
                              : budgetSummary.total_estimated;
                            return `₩${amt.toLocaleString()}`;
                          }
                          return `₩${Number(plan.total_budget).toLocaleString()}`;
                        })()}
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
