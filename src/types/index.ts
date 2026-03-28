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
  endTime?: string;
  category: 'dining' | 'transit' | 'sightseeing' | 'stay' | 'transport';
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  badge?: string;
  tags?: string[];
  amount?: string;
  externalLink?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
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

export type InterestTag = {
  id: string;
  label: string;
  selected: boolean;
};

export interface PlanFormData {
  destination: string;
  departureDate: string;
  returnDate: string;
  budgetMin: number;
  budgetMax: number;
  interests: InterestTag[];
  additionalContext: string;
}

export interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
}