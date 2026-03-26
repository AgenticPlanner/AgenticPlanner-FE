// 인증
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserMe {
  id: number;
  username: string;
  email: string;
}

// Plans
export interface APIPlan {
  id: number;
  title: string;
  description?: string;
  invite_code?: string;
  created_at: string;
  updated_at: string;
}

export interface APIPlanDay {
  id: number;
  plan: number;
  date: string;         // "YYYY-MM-DD"
  day_number: number;
  title?: string;
}

export interface APIPlanItem {
  id: number;
  day: number;
  title: string;
  description?: string;
  time?: string;        // "HH:MM"
  category: 'dining' | 'transit' | 'sightseeing' | 'stay';
  location?: string;
  image_url?: string;
  order: number;
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
