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
export interface APIPlan {
  id: string;
  title: string;
  description?: string;
  invite_code?: string;
  created_at: string;
  updated_at: string;
}

export interface APIPlanDay {
  id: string;
  plan: string;
  date: string;         // "YYYY-MM-DD"
  day_number: number;
  title?: string;
}

export interface APIPlanItem {
  id: string;
  day: string;
  title: string;
  subtitle?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  order_index: number;
  location?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | string;
  category: 'dining' | 'transit' | 'sightseeing' | 'stay' | string;
  external_link?: string;
  badge?: string;
  tags?: string[];
  amount?: number;
  paid_at?: string;
  img_url?: string;
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

// API 공통 에러 형태
export interface APIError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}
