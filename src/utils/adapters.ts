import type { APIPlanDay, APIPlanItem } from '@/types/api';
import type { TripDay, ItineraryStop } from '@/types';

export const adaptItemToStop = (item: APIPlanItem): ItineraryStop => ({
  id: String(item.id),
  time: item.time ?? '',
  category: item.category,
  title: item.title,
  description: item.description,
  location: item.location,
  imageUrl: item.image_url,
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
