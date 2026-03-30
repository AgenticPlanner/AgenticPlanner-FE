import type { InterestTag, ChatMessage } from '../types/index';

export const defaultInterestTags: InterestTag[] = [
  { id: 'hiking',       label: '하이킹',       selected: true  },
  { id: 'local-food',   label: '현지 음식',    selected: true  },
  { id: 'tech-spots',   label: '테크 명소',    selected: true  },
  { id: 'architecture', label: '건축·문화',    selected: false },
  { id: 'nightlife',    label: '나이트라이프',  selected: false },
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'greeting',
    role: 'ai',
    content: "안녕하세요! 저는 캡틴 빈입니다. 꿈꾸는 여행에 대해 이야기해주시거나, 왼쪽 패널에서 여행 정보를 입력해보세요.\n\n최적의 여행 루트 설계, 숨겨진 현지 명소 발굴, 합리적인 예산 내 프리미엄 경험까지 도와드릴 수 있어요. 무엇이 궁금하신가요?",
    timestamp: '방금 전',
  },
];

export const suggestionChips: string[] = [
  "도쿄 5일 일정 추천해줘",
  "포르투갈 한적한 해변 찾아줘",
  "아스펜 펫프렌들리 호텔 알려줘",
];

export const BUDGET_MIN = 100000;     // ₩10만
export const BUDGET_MAX = 10000000;   // ₩1,000만
export const BUDGET_STEP = 100000;    // ₩10만
