import type { APIPlanDay, APIPlanItem } from '@/types/api';
import type { TripDay, ItineraryStop } from '@/types';

export const adaptItemToStop = (item: APIPlanItem): ItineraryStop => ({
  id: String(item.id),
  time: item.start_time ? item.start_time.substring(0, 5) : '', // "HH:MM"
  category: item.category,
  title: item.title,
  subtitle: item.subtitle,
  description: item.description,
  location: item.location,
  imgUrl: item.img_url,
});

export const adaptDayToTripDay = (
  day: APIPlanDay,
  items: APIPlanItem[]
): TripDay => ({
  label: day.title ?? `Day ${day.day_number}`,
  stops: items.map(adaptItemToStop),
  stats: { activities: items.length, temp: '-', budgetSpent: '-' },
  travelTime: '-',
});
