export interface PlanCategory {
  id: string;
  title: string;
  titleKo: string;
  imageUrl: string;
}

export interface NavItem {
  label: string;
  icon: string; // Material Symbol name
  href: string;
  active?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  icon: string;
  assignees?: string[]; // avatar URLs
  ctaLabel: string;
}

export interface ItineraryStop {
  id: string;
  time: string;
  category: 'dining' | 'transit' | 'sightseeing' | 'stay';
  title: string;
  subtitle?: string;
  location?: string;
  description?: string;
  badge?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface DayStats {
  activities: number;
  temp: string;
  budgetSpent: string;
}

export interface TripDay {
  label: string;
  stops: ItineraryStop[];
  stats: DayStats;
  travelTime: string;
  tip?: string;
}