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
export interface APIPlanItem {
  id: string;
  day: string;
  order_index: number;
  title: string;
  subtitle?: string;
  description?: string;
  category: 'TRANSPORT' | 'ACCOMMODATION' | 'ACTIVITY' | 'FOOD' | 'ETC';
  amount?: string;           // "320000.00"
  badge?: string;            // "₩320,000"
  tags?: string[];
  external_link?: string;
  img_url?: string;
  start_time?: string;       // "HH:MM"
  end_time?: string;
  location?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export interface APIPlanDay {
  id: string;
  plan: string;
  day_number: number;
  date: string;              // "YYYY-MM-DD"
  day_budget?: number;
  items: APIPlanItem[];
}

export interface APIPlan {
  id: string;
  title: string;
  plan_type?: string;
  start_date?: string;
  end_date?: string;
  total_budget?: string;
  days: APIPlanDay[];
  created_at: string;
  updated_at: string;
}

// Agent
export interface AgentSession {
  id: string;
  plan_id?: number;
  created_at: string;
}

export interface AgentChatRequest {
  session_id: string;
  message: string;
  plan_id?: number;
}

// done 이벤트 페이로드
export interface SSEDonePayload {
  type: 'done';
  session: {
    id: string;
    phase: string;
    plan: APIPlan | null;
    messages: unknown[];
  };
  plan_id: string | null;
}

// API 공통 에러 형태
export interface APIError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}
