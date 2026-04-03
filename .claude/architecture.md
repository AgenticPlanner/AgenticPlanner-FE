# 디렉토리 구조 및 레이어 규칙

## 디렉토리 구조

```
src/
├── components/
│   ├── ui/           # 순수 시각 프리미티브 — 로직 없음
│   │   └── Button, Badge, Chip, Card, SectionHeader, StatRow
│   ├── common/       # 2곳 이상 재사용되는 조합 패턴
│   │   └── GlassPanel, FABGroup, ProgressBar, EmptySlot, CategoryIcon
│   ├── layout/       # 앱 셸
│   │   └── AppLayout, SideNav, TopBar
│   └── features/     # 페이지 전용 조립체
│       ├── tasks/    → TaskCard, TaskGrid
│       └── itinerary/ → StopCard, DaySelector, DaySidebar, TimelineThread
├── pages/            # LandingPage, TaskPage, ItineraryPage
├── data/
│   └── tripData.ts   # 모든 mock 데이터의 단일 출처
├── types/
│   └── index.ts      # 모든 공유 TypeScript 인터페이스
└── hooks/            # 커스텀 훅만
```

## 레이어 규칙

| 레이어 | data import | useState/useEffect | tripData.ts |
|--------|-------------|-------------------|-------------|
| `ui/` | 금지 | 금지 | 금지 |
| `common/` | 금지 | 허용 | 금지 |
| `features/` | 허용 | 허용 | 허용 |
| `pages/` | 허용 | 허용 | 허용 |

- 새 타입 → `src/types/index.ts`에만 추가, 컴포넌트 내 로컬 타입 선언 금지
- 새 mock 데이터 → `src/data/tripData.ts`에만 추가

## 파일 내 import 순서 (모든 컴포넌트 파일 준수)

```ts
// 1. React
// 2. 서드파티 (react-router-dom, 외부 라이브러리)
// 3. 내부 — types → data → components 순
// 4. Props 인터페이스 정의
// 5. 컴포넌트 함수
// 6. default export
```

## 하지 마

- `ui/` 컴포넌트에 `useState`, `useEffect`, data import 추가 금지
- `common/` 컴포넌트에서 `tripData.ts` 직접 import 금지
- `src/types/index.ts` 외부에 타입 정의 금지
- 컴포넌트 파일 안에 데이터 배열·객체 하드코딩 금지
- `hooks/` 폴더에 컴포넌트 JSX 반환 함수 추가 금지
