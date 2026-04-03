import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/index';
import type { APIPlanItem } from '../types/api';
import { AppLayout } from '../components/layout';
import { TaskCard, TaskSkeleton } from '../components/features/tasks';
import { SectionHeader } from '../components/ui';
import { ProgressBar, EmptySlot, EmptyState } from '../components/common';
import { usePlanContext } from '../contexts/PlanContext';

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

// ── dev 검증 ──────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  const testCases = [
    { category: 'TRANSPORT',     title: '서울→부산 KTX', tags: [], external_link: '', dest: '부산' },
    { category: 'ACTIVITY',      title: '경복궁',        tags: ['무료'], external_link: '', dest: '서울' },
    { category: 'ACCOMMODATION', title: '파리 호텔',     tags: [], external_link: '', dest: '파리' },
    { category: 'ACTIVITY',      title: '에펠탑 견학',   tags: ['자유관광'], external_link: '', dest: '파리' },
    { category: 'RESTAURANT',    title: '이치란 라멘',   tags: [], external_link: '', dest: '도쿄' },
  ];
  testCases.forEach(tc => {
    const action = getActionConfig(tc as unknown as APIPlanItem, tc.dest);
    console.log(`[${tc.category}] ${tc.title} → ${action.label} | ${action.url.slice(0, 60)}`);
  });
}

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

const statusToTaskStatus = (status: APIPlanItem['status']): Task['status'] => {
  if (status === 'CONFIRMED') return 'done';
  if (status === 'CANCELLED') return 'done';
  return 'todo';
};

const itemToTask = (item: APIPlanItem, destination: string): Task => {
  const action = getActionConfig(item, destination);
  return {
    id: item.id,
    title: item.title,
    description: item.description || item.subtitle || item.location || '',
    status: statusToTaskStatus(item.status),
    icon: categoryToIcon(item.category),
    ctaLabel: action.label,
    ctaUrl: action.url,
    ctaColor: action.color,
    isReview: action.isReview,
    assignees: [],
  };
};

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

  const destination = activePlan?.title?.split(' ')[0] ?? '';
  const tasks: Task[] = useMemo(
    () => allItems.map((item) => itemToTask(item, destination)),
    [allItems, destination],
  );

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
