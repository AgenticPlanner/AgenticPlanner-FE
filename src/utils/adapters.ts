import type { APIPlanDay, APIPlanItem, APIPlan } from '@/types/api';
import type { TripDay, ItineraryStop } from '@/types';

const CATEGORY_MAP: Record<string, ItineraryStop['category']> = {
  TRANSPORT:     'transit',
  ACCOMMODATION: 'stay',
  ACTIVITY:      'sightseeing',
  RESTAURANT:    'dining',
  OTHER:         'sightseeing',
  // 소문자 방어 (데이터 불일치 대비)
  transport:     'transit',
  accommodation: 'stay',
  activity:      'sightseeing',
  restaurant:    'dining',
  food:          'dining',
  other:         'sightseeing',
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

export const adaptItemToStop = (item: APIPlanItem): ItineraryStop => ({
  id: String(item.id),
  time: item.start_time ?? '',
  endTime: item.end_time,
  category: CATEGORY_MAP[item.category] ?? 'sightseeing',
  title: item.title,
  subtitle: item.subtitle,
  description: item.description,
  location: item.location,
  imageUrl: item.img_url,
  badge: item.badge,
  tags: item.tags ?? [],
  amount: item.amount,
  externalLink: item.external_link,
  status: item.status,
});

export const adaptDayToTripDay = (day: APIPlanDay): TripDay => ({
  label: `Day ${day.day_number}${day.date ? ` · ${formatDate(day.date)}` : ''}`,
  stops: [...(day.items ?? [])]
    .sort((a, b) => a.order_index - b.order_index)
    .map(adaptItemToStop),
  stats: {
    activities: (day.items ?? []).length,
    temp: '-',
    budgetSpent: day.day_budget
      ? `₩${Number(day.day_budget).toLocaleString()}`
      : '-',
  },
  travelTime: '-',
  tip: undefined,
});

export const adaptPlanToTripDays = (plan: APIPlan): TripDay[] =>
  [...(plan.days ?? [])]
    .sort((a, b) => a.day_number - b.day_number)
    .map(adaptDayToTripDay);
