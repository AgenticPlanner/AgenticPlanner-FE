import type { TripDay, Task, InterestTag, ChatMessage } from '../types/index';

export const tripDays: TripDay[] = [
  {
    label: 'Monterey',
    travelTime: '2h 45m',
    stats: {
      activities: 4,
      temp: '72°F',
      budgetSpent: '$450',
    },
    tip: '가벼운 레이어로 입으세요. 해안 바람이 예측 불가능합니다.',
    stops: [
      {
        id: 'day1-stop1',
        time: '8:00 AM',
        category: 'dining',
        title: '퍼스트 어웨이크닝 아침식사',
        subtitle: '팜-투-테이블 아침식사',
        location: 'Monterey, CA',
        description: '신선한 페이스트리와 현지 계란으로 하루를 시작하세요',
        tags: ['아침식사', '유기농'],
      },
      {
        id: 'day1-stop2',
        time: '10:30 AM',
        category: 'sightseeing',
        title: '17마일 드라이브',
        subtitle: '사이프러스 숲을 통과하는 경치 도로',
        location: 'Pacific Grove, CA',
        description: '미국에서 가장 경치 좋은 해안 드라이브 중 하나',
        badge: '필수',
        tags: ['경치', '2시간'],
      },
      {
        id: 'day1-stop3',
        time: '1:00 PM',
        category: 'sightseeing',
        title: '몬터레이 베이 수족관',
        subtitle: '세계 수준의 해양 생물 전시',
        location: 'Monterey, CA',
        description: '수달, 해파리, 인터랙티브 전시회를 보유',
        tags: ['수족관', '3시간'],
      },
      {
        id: 'day1-stop4',
        time: '6:00 PM',
        category: 'stay',
        title: '인터콘티넨탈 호텔 체크인',
        subtitle: '럭셀리 오션프론트 리조트',
        location: 'Monterey, CA',
        description: '오션프론트 스위트에 체크인하세요',
        tags: ['럭셀리', '5성'],
      },
    ],
  },
  {
    label: 'Big Sur',
    travelTime: '1h 30m',
    stats: {
      activities: 3,
      temp: '68°F',
      budgetSpent: '$320',
    },
    tip: '카메라를 챙기세요. Big Sur는 가장 사진 좋은 해안선입니다.',
    stops: [
      {
        id: 'day2-stop1',
        time: '9:00 AM',
        category: 'sightseeing',
        title: 'Bixby 다리',
        subtitle: '상징적인 아치형 다리',
        location: 'Big Sur, CA',
        description: '세계에서 가장 높은 단일 스팬 아치 다리 중 하나',
        badge: 'Instagram 추천',
        tags: ['사진촬영', '30분'],
      },
      {
        id: 'day2-stop2',
        time: '11:00 AM',
        category: 'sightseeing',
        title: 'Pfeiffer 해변',
        subtitle: '보라색 모래 해변',
        location: 'Big Sur, CA',
        description: '망간 광물로 형성된 독특한 보라색 모래',
        tags: ['해변', '1시간'],
      },
      {
        id: 'day2-stop3',
        time: '5:00 PM',
        category: 'stay',
        title: 'Ventana Big Sur 호텔 체크인',
        subtitle: '럭셀리 절벽 리조트',
        location: 'Big Sur, CA',
        description: '놀라운 바다 전망이 있는 절벽 위의 리조트',
        tags: ['럭셀리', '5성'],
      },
    ],
  },
  {
    label: 'San Simeon',
    travelTime: '1h 15m',
    stats: {
      activities: 2,
      temp: '70°F',
      budgetSpent: '$380',
    },
    tip: 'Hearst Castle 투어를 미리 예약하세요. 티켓이 빨리 매진됩니다.',
    stops: [
      {
        id: 'day3-stop1',
        time: '10:00 AM',
        category: 'sightseeing',
        title: 'Hearst Castle 투어',
        subtitle: '역사적인 저택 투어',
        location: 'San Simeon, CA',
        description: '165개 객실의 성과 멋진 미술 컬렉션 탐험',
        badge: 'UNESCO',
        tags: ['역사', '2.5시간'],
      },
      {
        id: 'day3-stop2',
        time: '6:00 PM',
        category: 'dining',
        title: 'Moonstone 해변 저녁식사',
        subtitle: '바다 전망이 있는 신선한 해산물',
        location: 'Cambria, CA',
        description: '현지 해산물을 즐기며 석양을 감상하세요',
        tags: ['해산물', '저녁식사'],
      },
    ],
  },
  {
    label: 'Solvang',
    travelTime: '1h 45m',
    stats: {
      activities: 2,
      temp: '75°F',
      budgetSpent: '$290',
    },
    tip: 'Solvang은 덴마크 건축으로 유명합니다. 마을 탐험 시간을 계획하세요.',
    stops: [
      {
        id: 'day4-stop1',
        time: '10:00 AM',
        category: 'sightseeing',
        title: 'Santa Ynez Valley 와인 테이스팅',
        subtitle: '프리미엄 와이너리 방문',
        location: 'Solvang, CA',
        description: '수상 경력이 있는 피노 누아와 샤르도네를 시음하세요',
        tags: ['와인', '테이스팅'],
      },
      {
        id: 'day4-stop2',
        time: '1:00 PM',
        category: 'dining',
        title: '덴마크식 아침겸점심',
        subtitle: '전통 덴마크 페이스트리',
        location: 'Solvang, CA',
        description: '이 매력적인 마을에서 정통 덴마크 요리를 경험하세요',
        tags: ['아침겸점심', '덴마크'],
      },
    ],
  },
  {
    label: 'Santa Barbara',
    travelTime: '1h 20m',
    stats: {
      activities: 3,
      temp: '76°F',
      budgetSpent: '$410',
    },
    tip: '석양 크루즈를 미리 예약하세요. 여행을 끝내기에 완벽합니다.',
    stops: [
      {
        id: 'day5-stop1',
        time: '9:00 AM',
        category: 'sightseeing',
        title: '올드 미션 산타바바라',
        subtitle: '역사적인 스페인 미션',
        location: 'Santa Barbara, CA',
        description: '1786년 설립, 아름다운 건축과 정원을 갖춘 곳',
        tags: ['역사', '종교시설'],
      },
      {
        id: 'day5-stop2',
        time: '12:00 PM',
        category: 'dining',
        title: 'State Street 점심식사',
        subtitle: '고급 쇼핑과 식사',
        location: 'Santa Barbara, CA',
        description: '부티크를 탐험하고 신선한 지중해 요리를 즐기세요',
        tags: ['점심식사', '쇼핑'],
      },
      {
        id: 'day5-stop3',
        time: '5:00 PM',
        category: 'sightseeing',
        title: '석양 크루즈',
        subtitle: '저녁 해상 크루즈',
        location: 'Santa Barbara Harbor, CA',
        description: '바다에서 마법 같은 석양으로 여행을 마무리하세요',
        badge: '필수',
        tags: ['로맨틱', '석양'],
      },
    ],
  },
];

export const tripTasks: Task[] = [
  {
    id: 'task1',
    title: '항공권 예약',
    description: '샌프란시스코 왕복 항공권 예약하기',
    status: 'in-progress',
    icon: 'flight',
    ctaLabel: '계속',
    assignees: [],
  },
  {
    id: 'task2',
    title: '숙소 찾기',
    description: '5박 동안의 호텔 검색 및 예약',
    status: 'todo',
    icon: 'hotel',
    ctaLabel: '검색',
    assignees: [],
  },
  {
    id: 'task3',
    title: 'Offline 지도 다운로드',
    description: 'Google 지도를 Offline 네비게이션용으로 다운로드',
    status: 'todo',
    icon: 'map',
    ctaLabel: '다운로드',
    assignees: [],
  },
  {
    id: 'task4',
    title: '컨버터블 자동차 렌트',
    description: '경해안 드라이브를 위한 고급 컨버터블 예약',
    status: 'done',
    icon: 'directions_car',
    ctaLabel: '예약 확인',
    assignees: [],
  },
  {
    id: 'task5',
    title: '짐 준비 리스트',
    description: '여행용 짐 체크리스트 작성 및 검토',
    status: 'todo',
    icon: 'backpack',
    ctaLabel: '짐 준비 시작',
    assignees: [],
  },
];

export const tasks = tripTasks;

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

export const BUDGET_MIN = 1000;
export const BUDGET_MAX = 20000;
export const BUDGET_STEP = 500;
