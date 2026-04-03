// 인증
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserMe {
  id: string;
  username: string;
  email: string;
}

// Plans
export interface APIPlanMember {
  id: string;
  user: UserMe & { id: number | string };
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  is_active: boolean;
  created_at: string;
}

export interface APIPlanItem {
  id: string;
  order_index: number;
  title: string;
  subtitle?: string;
  description?: string;
  category: 'TRANSPORT' | 'ACCOMMODATION' | 'ACTIVITY' | 'RESTAURANT' | 'OTHER';
  amount?: string;           // "320000.00"
  badge?: string;
  tags?: string[];
  external_link?: string;
  img_url?: string;
  start_time?: string;       // "HH:MM"
  end_time?: string;
  location?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paid_at?: string;
  is_done?: boolean;
  done_at?: string;
  actual_amount?: string;   // "120000.00"
  ticket_url?: string;
  is_active?: boolean;
}

export interface APITransportSegment {
  from: string;
  to: string;
  duration_minutes: number;
  duration_desc: string;
  transport_type: string;
  source: string;
}

export interface APIDailyWeather {
  avg_temp_c: number;
  min_temp_c: number;
  max_temp_c: number;
  weather_desc: string;
  clothing_tip: string;
}

export interface APIDailyInfo {
  weather?: APIDailyWeather;
  transport_segments: APITransportSegment[];
  total_transport_minutes: number;
  total_transport_desc: string;
}

export interface APIPlanDay {
  id: string;
  day_number: number;
  date: string;              // "YYYY-MM-DD"
  day_budget?: number;
  is_active?: boolean;
  daily_info?: APIDailyInfo;
  items: APIPlanItem[];
}

export interface APIPlanWeather {
  month: string;
  avg_temp_c: number;
  min_temp_c: number;
  max_temp_c: number;
  weather_desc: string;
  clothing_tip: string;
}

export interface APIPlanTransport {
  origin: string;
  destination: string;
  total_minutes: number;
  duration_desc: string;
}

export interface APIPlanExtraData {
  weather?: APIPlanWeather;
  transport?: APIPlanTransport;
}

export interface APIPlan {
  id: string;
  title: string;
  plan_type?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  total_budget?: string;
  extra_data?: APIPlanExtraData;
  days: APIPlanDay[];
  members?: APIPlanMember[];
  created_at: string;
  is_active?: boolean;
}

// Agent
export interface TravelInfo {
  destination: string;
  start_date: string;        // YYYY-MM-DD
  end_date: string;          // YYYY-MM-DD
  group_size: number;
  budget: number;
  travel_style: string;      // 쉼표 구분 문자열
  special_requests?: string;
}

export interface Concept {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  image_url?: string;
}

export interface SessionSummary {
  id: string;
  phase: string;
  destination: string;
  start_date: string;
  end_date: string;
  has_plan: boolean;
  created_at: string;
  last_message: string | null;
  message_count: number;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface AgentSession {
  id: string;
  phase: string;
  travel_info: TravelInfo;
  concepts: Concept[] | null;
  plan: APIPlan | null;
  created_at: string;
  messages?: AgentMessage[];
}

export interface SSEEvent {
  type: 'delta' | 'thinking_step' | 'tool_result' | 'phase_change' | 'done' | 'error';
  delta?: string;
  step?: string;
  tool?: string;
  result?: {
    accommodation_count: number;
    activity_count: number;
    flight_count: number;
    has_exchange_rate: boolean;
  };
  phase?: string;
  concepts?: Concept[];        // phase_change 이벤트에서 직접 전달될 수 있음
  session?: AgentSession;
  plan_id?: string;
  error?: string;
}

// API 공통 에러 형태
export interface APIError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}
