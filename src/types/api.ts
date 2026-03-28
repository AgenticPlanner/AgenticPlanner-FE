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
  is_active?: boolean;
}

export interface APIPlanDay {
  id: string;
  day_number: number;
  date: string;              // "YYYY-MM-DD"
  day_budget?: number;
  is_active?: boolean;
  items: APIPlanItem[];
}

export interface APIPlan {
  id: string;
  title: string;
  plan_type?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  total_budget?: string;
  days: APIPlanDay[];
  members?: APIPlanMember[];
  created_at: string;
  is_active?: boolean;
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
