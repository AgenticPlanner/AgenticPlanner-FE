import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/index';
import type { APIPlanItem } from '../types/api';
import { AppLayout } from '../components/layout';
import { TaskCard, TaskSkeleton } from '../components/features/tasks';
import { SectionHeader } from '../components/ui';
import { ProgressBar, EmptySlot, EmptyState } from '../components/common';
import { usePlanContext } from '../contexts/PlanContext';
import { toggleItemDone, getPlanBudgetSummary, type BudgetSummary } from '../api/plans';

// ── 여행 팁 아이콘/레이블 ─────────────────────────────────────────
const TIP_ICON_MAP: Record<string, { icon: string; label: string; color: string }> = {
  ESIM:           { icon: '📶', label: 'eSIM',     color: '#6366f1' },
  TRANSPORT_CARD: { icon: '🚇', label: '교통카드', color: '#0ea5e9' },
  BIKE:           { icon: '🚲', label: '자전거',   color: '#22c55e' },
  APP:            { icon: '📱', label: '필수앱',   color: '#f97316' },
  SOUVENIR:       { icon: '🎁', label: '기념품',   color: '#ec4899' },
  FOOD_LOCAL:     { icon: '🍜', label: '로컬맛집', color: '#ef4444' },
  CURRENCY:       { icon: '💴', label: '환전',     color: '#eab308' },
  SAFETY:         { icon: '🛡️', label: '안전',    color: '#64748b' },
  WEATHER_TIP:    { icon: '🌤️', label: '날씨',    color: '#0891b2' },
  GENERAL:        { icon: '💡', label: '여행팁',   color: '#8b5cf6' },
};

// ── TIP CTA 링크 생성 ──────────────────────────────────────────────
const getTipCtaConfig = (
  item: APIPlanItem,
  destination: string,
): { url: string; label: string; color: string } => {
  const cfg = TIP_ICON_MAP[item.tip_type ?? 'GENERAL'] ?? TIP_ICON_MAP['GENERAL'];
  if (item.external_link) return { url: item.external_link, label: '바로가기', color: cfg.color };

  const q = encodeURIComponent(`${destination} ${item.title}`);
  switch (item.tip_type) {
    case 'ESIM':
      return { url: `https://search.naver.com/search.naver?query=${encodeURIComponent(destination + ' eSIM 구매')}`, label: 'eSIM 알아보기', color: cfg.color };
    case 'TRANSPORT_CARD':
      return { url: `https://search.naver.com/search.naver?query=${encodeURIComponent(destination + ' 교통카드')}`, label: '교통카드 정보', color: cfg.color };
    case 'APP': {
      const apps = (item.tip_metadata?.apps as Array<{ ios_url?: string; android_url?: string }> | undefined);
      const firstLink = apps?.[0]?.ios_url ?? apps?.[0]?.android_url;
      return { url: firstLink ?? `https://search.naver.com/search.naver?query=${q}`, label: '앱 다운로드', color: cfg.color };
    }
    case 'SOUVENIR':
      return { url: `https://search.naver.com/search.naver?query=${encodeURIComponent(destination + ' 기념품')}`, label: '기념품 검색', color: cfg.color };
    case 'FOOD_LOCAL':
      return { url: `https://map.naver.com/v5/search/${encodeURIComponent(destination + ' 맛집')}`, label: '맛집 보기', color: cfg.color };
    case 'CURRENCY':
      return { url: 'https://finance.naver.com/marketindex/', label: '환율 확인', color: cfg.color };
    case 'SAFETY':
      return { url: `https://search.naver.com/search.naver?query=${encodeURIComponent(destination + ' 여행 안전')}`, label: '안전 정보', color: cfg.color };
    case 'WEATHER_TIP':
      return { url: `https://search.naver.com/search.naver?query=${encodeURIComponent(destination + ' 날씨')}`, label: '날씨 확인', color: cfg.color };
    default:
      return { url: `https://search.naver.com/search.naver?query=${q}`, label: '자세히 보기', color: cfg.color };
  }
};

// ── TIP 설명 포맷 ──────────────────────────────────────────────────
const formatTipDescription = (item: APIPlanItem): string => {
  const base = item.description ?? item.subtitle ?? '';
  const meta = item.tip_metadata;
  if (!meta) return base;

  const extras: string[] = [];
  if (item.tip_type === 'APP' && Array.isArray(meta.apps)) {
    const names = (meta.apps as Array<{ name: string }>).map(a => a.name).slice(0, 3);
    if (names.length) extras.push(`추천 앱: ${names.join(', ')}`);
  } else if (item.tip_type === 'SOUVENIR' && Array.isArray(meta.items)) {
    const names = (meta.items as Array<{ name: string }>).map(i => i.name).slice(0, 3);
    if (names.length) extras.push(`추천 기념품: ${names.join(', ')}`);
  } else if (item.tip_type === 'FOOD_LOCAL' && Array.isArray(meta.dishes)) {
    const names = (meta.dishes as Array<{ name: string }>).map(d => d.name).slice(0, 3);
    if (names.length) extras.push(`추천 음식: ${names.join(', ')}`);
  } else if ((item.tip_type === 'ESIM' || item.tip_type === 'TRANSPORT_CARD') && meta.price_range) {
    extras.push(`예상 비용: ${String(meta.price_range)}`);
    if (meta.where_to_get) extras.push(`구매처: ${String(meta.where_to_get)}`);
  }
  return [base, ...extras].filter(Boolean).join(' · ');
};

// ── TIP → Task 변환 ────────────────────────────────────────────────
const tipItemToTask = (item: APIPlanItem, destination: string): Task => {
  const cta = getTipCtaConfig(item, destination);
  const isDone = item.is_done ?? false;
  return {
    id: item.id,
    title: item.title,
    description: formatTipDescription(item),
    status: isDone ? 'done' : 'todo',
    icon: 'lightbulb',
    ctaLabel: cta.label,
    ctaUrl: cta.url,
    ctaColor: cta.color,
    isReview: false,
    assignees: [],
    isDone,
    done_at: item.done_at,
  };
};

// ── 카테고리 설정 ──────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { bookingLabel: string; color: string }> = {
  TRANSPORT:     { bookingLabel: '항공권 예약',  color: '#1a73e8' },
  ACCOMMODATION: { bookingLabel: '숙소 예약',    color: '#6c5ce7' },
  ACTIVITY:      { bookingLabel: '액티비티 예약', color: '#f39c12' },
  RESTAURANT:    { bookingLabel: '식당 검색',    color: '#e17055' },
  OTHER:         { bookingLabel: '검색하기',     color: '#636e72' },
};

// ── 국내 여행지 판단 ───────────────────────────────────────────────
const isKoreanDestination = (destination: string): boolean => {
  const koreanCities = [
    '서울', '부산', '제주', '인천', '대구', '대전', '광주',
    '수원', '강릉', '경주', '전주', '춘천', '속초', '여수',
  ];
  return koreanCities.some(city => destination.includes(city))
    || /[가-힣]/.test(destination);
};

// ── 리뷰 검색 URL ─────────────────────────────────────────────────
const getReviewUrl = (
  item: APIPlanItem,
  destination: string,
  platform: 'naver' | 'youtube' = 'naver',
): string => {
  const query = `${destination} ${item.title} 여행 리뷰`;
  const q = encodeURIComponent(query);
  if (platform === 'youtube') return `https://www.youtube.com/results?search_query=${q}`;
  return `https://search.naver.com/search.naver?query=${q}&where=blog`;
};

// ── 예약 필요 여부 ─────────────────────────────────────────────────
const needsBooking = (item: APIPlanItem): boolean => {
  if (item.category === 'TRANSPORT') return true;
  if (item.category === 'ACCOMMODATION') return true;
  if (item.tags?.includes('예약필요')) return true;
  if (item.external_link) return true;
  return false;
};

// ── 예약 폴백 URL (booking 전용) ──────────────────────────────────
const getFallbackBookingUrl = (item: APIPlanItem, destination: string): string => {
  const q = encodeURIComponent(`${destination} ${item.title}`);
  const loc = encodeURIComponent(item.location || destination);
  switch (item.category) {
    case 'TRANSPORT':     return `https://flight.naver.com/flights?query=${q}`;
    case 'ACCOMMODATION': return `https://hotels.naver.com/searchpage/hotel?query=${loc}`;
    case 'RESTAURANT':    return `https://map.naver.com/v5/search/${q}`;
    case 'ACTIVITY':      return `https://www.klook.com/ko/search/?query=${q}`;
    default:              return `https://www.google.com/search?q=${q}`;
  }
};

// ── 액션 URL · 레이블 · 색상 결정 ────────────────────────────────
const getActionConfig = (
  item: APIPlanItem,
  destination: string,
): { url: string; label: string; color: string; isReview: boolean } => {
  const cfg = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG['OTHER'];

  if (needsBooking(item)) {
    return {
      url: item.external_link || getFallbackBookingUrl(item, destination),
      label: cfg.bookingLabel,
      color: cfg.color,
      isReview: false,
    };
  }

  const dom = isKoreanDestination(destination);
  return {
    url: getReviewUrl(item, destination, dom ? 'naver' : 'youtube'),
    label: dom ? '네이버 리뷰' : '유튜브 리뷰',
    color: dom ? '#03c75a' : '#ff0000',
    isReview: true,
  };
};

// ── 헬퍼 함수 ─────────────────────────────────────────────────────
const categoryToIcon = (category: APIPlanItem['category']): string => {
  switch (category) {
    case 'RESTAURANT':    return 'restaurant';
    case 'TRANSPORT':     return 'directions_car';
    case 'ACTIVITY':      return 'explore';
    case 'ACCOMMODATION': return 'hotel';
    default:              return 'travel_explore';
  }
};

const itemToTask = (item: APIPlanItem, destination: string): Task => {
  const action = getActionConfig(item, destination);
  const isDone = item.is_done ?? false;
  return {
    id: item.id,
    title: item.title,
    description: item.description || item.subtitle || item.location || '',
    status: isDone ? 'done' : (item.status === 'CONFIRMED' || item.status === 'CANCELLED' ? 'done' : 'todo'),
    icon: categoryToIcon(item.category),
    ctaLabel: action.label,
    ctaUrl: action.url,
    ctaColor: action.color,
    isReview: action.isReview,
    assignees: [],
    isDone,
    done_at: item.done_at,
  };
};

export default function TaskPage() {
  const navigate = useNavigate();
  const { activePlan, loading, error, refetch } = usePlanContext();

  const [localItems, setLocalItems] = useState<APIPlanItem[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);

  // activePlan이 바뀌면 localItems 초기화
  useEffect(() => {
    if (!activePlan?.days) return;
    const items = [...activePlan.days]
      .sort((a, b) => a.day_number - b.day_number)
      .flatMap(day => [...(day.items ?? [])].sort((a, b) => a.order_index - b.order_index));
    setLocalItems(items);
  }, [activePlan]);

  const planId = activePlan?.id ?? '';
  const destination = activePlan?.title?.split(' ')[0] ?? '';

  const refreshBudget = useCallback(() => {
    if (!planId) return;
    getPlanBudgetSummary(planId).then(setBudgetSummary).catch(() => {});
  }, [planId]);

  useEffect(() => { refreshBudget(); }, [refreshBudget]);

  const tipTasks: Task[] = useMemo(
    () => localItems
      .filter(item => item.category === 'TIP')
      .map(item => tipItemToTask(item, destination)),
    [localItems, destination],
  );

  const tasks: Task[] = useMemo(
    () => localItems.filter(item => item.category !== 'TIP').map(item => itemToTask(item, destination)),
    [localItems, destination],
  );

  const handleToggleDone = async (itemId: string) => {
    try {
      const updated = await toggleItemDone(itemId);
      setLocalItems(prev => prev.map(it => it.id === itemId ? updated : it));
      refreshBudget();
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const doneCount = budgetSummary?.done_count
    ?? (tasks.filter(t => t.status === 'done').length + tipTasks.filter(t => t.status === 'done').length);
  const totalCount = budgetSummary?.total_count ?? (tasks.length + tipTasks.length);
  const progressPercentage = budgetSummary?.completion_rate
    ?? (totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0);

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
              totalCount > 0 ? (
                <div className="text-right">
                  <div className="font-headline font-bold text-2xl text-on-surface">
                    {progressPercentage}%
                  </div>
                  <p className="text-outline text-sm">진행률</p>
                </div>
              ) : null
            }
          />
          {totalCount > 0 && (
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
        {!loading && !error && activePlan && tasks.length === 0 && tipTasks.length === 0 && (
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
              <TaskCard
                key={task.id}
                task={task}
                featured={idx === 0}
                onToggleDone={() => handleToggleDone(task.id)}
              />
            ))}
            <EmptySlot label="마일스톤 추가" icon="add" />
          </div>
        )}

        {/* 여행 팁 체크리스트 */}
        {!loading && !error && tipTasks.length > 0 && (
          <div className="mt-16">
            <h3 className="font-headline font-bold text-2xl text-on-surface mb-6">
              여행 준비 체크리스트
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tipTasks.map((task, idx) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  featured={idx === 0}
                  onToggleDone={() => handleToggleDone(task.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
