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
  ctaUrl?: string;
  ctaColor?: string;
  isReview?: boolean;
  isDone?: boolean;
  done_at?: string;
}

export interface ItineraryStop {
  id: string;
  time: string;
  endTime?: string;
  category: 'dining' | 'transit' | 'sightseeing' | 'stay' | 'transport' | 'tip';
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  badge?: string;
  tags?: string[];
  amount?: string;
  externalLink?: string;
  ticketUrl?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  tip_type?: string | null;
  tip_metadata?: Record<string, unknown>;
  transportParams?: Record<string, unknown>;
  naverMapUrl?: string;
}

export interface DayStats {
  activities: number;
  temp: string;
  budgetSpent: string;
}

export interface TripDay {
  label: string;
  dayNumber?: number;
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

// 챗봇 메시지 파싱 결과 타입
export type ParsedMessageType =
  | 'text'            // 일반 텍스트
  | 'concepts'        // 컨셉 선택 카드
  | 'concept_confirm' // 선택한 컨셉 확인
  | 'plan_confirm'    // 세부 플랜 확정 확인
  | 'collection'      // 수집 중인 정보 요약 (phase: initial)
  | 'unknown';        // 파싱 불가 → raw 텍스트로 폴백

export interface ConceptOption {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  budget_range: string;
  is_discovery?: boolean;
}

export interface ParsedMessage {
  type: ParsedMessageType;
  text: string;                         // JSON 제거된 순수 텍스트 (앞에 붙은 설명글)
  concepts?: ConceptOption[];           // type === 'concepts'
  selectedConcept?: ConceptOption;      // type === 'concept_confirm'
  confirmation?: string;                // type === 'plan_confirm'
  collected?: Record<string, unknown>;  // type === 'collection'
}