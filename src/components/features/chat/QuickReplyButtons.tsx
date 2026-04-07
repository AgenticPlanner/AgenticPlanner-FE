import type { AgentSession } from '@/types/api';

interface QuickReplyButtonsProps {
  phase: string;
  session: AgentSession;
  onSend: (text: string) => void;
  isStreaming: boolean;
}

const QUICK_REPLIES: Record<string, string[]> = {
  initial: [
    '혼자 여행이에요',
    '2명이서 갈 예정이에요',
    '가족 여행이에요 (4명)',
    '커플 여행이에요',
  ],
  guideline: [
    '1번 컨셉으로 할게요',
    '2번 컨셉으로 할게요',
    '3번 컨셉으로 할게요',
    '다른 컨셉 제안해줘',
  ],
  detail_collect: [
    '날짜는 미정이에요',
    '예산은 1인 100만원이에요',
    '3박 4일로 가고 싶어요',
    '이 정도면 충분해요, 계획 세워줘!',
  ],
  planning: [],  // CrawlingStatus 버튼으로 대체
  result: [
    '이 계획으로 확정할게요 ✅',
    '숙소를 바꿔줘',
    '맛집 추천을 더 추가해줘',
    '예산을 줄여줘',
  ],
  editing: [
    '1일차 일정을 바꿔줘',
    '항공편 대안을 알려줘',
    '더 저렴한 숙소로 바꿔줘',
    '이 계획으로 최종 확정',
  ],
};

export default function QuickReplyButtons({
  phase,
  onSend,
  isStreaming,
}: QuickReplyButtonsProps) {
  const replies = QUICK_REPLIES[phase] || [];
  if (!replies.length || isStreaming) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 0' }}>
      {replies.map((text, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSend(text)}
          style={{
            padding: '6px 14px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            fontSize: '13px',
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.borderColor = '#3b82f6';
            (e.target as HTMLElement).style.color = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.borderColor = '#e5e7eb';
            (e.target as HTMLElement).style.color = '#374151';
          }}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
