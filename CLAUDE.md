# CLAUDE.md — Serene Navigator

> 이 파일은 Claude Code가 프로젝트를 시작할 때 자동으로 읽는 컨텍스트 파일입니다.
> 모든 작업은 이 파일의 규칙을 최우선으로 따릅니다.

---

## 프로젝트 개요

**Serene Navigator** — 럭셔리 여행 플래닝 앱
"The Digital Sanctuary" 컨셉: 스트레스 없는 하이엔드 에디토리얼 UI

**스택**
- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS v4
- react-router-dom v6
- 패키지 매니저: npm

---

## 디렉토리 구조

```
src/
├── components/
│   ├── ui/           # 순수 시각 프리미티브 (로직 없음)
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Chip.tsx
│   │   ├── Card.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── StatRow.tsx
│   │   └── index.ts
│   ├── common/       # 2곳 이상 재사용되는 조합 패턴
│   │   ├── GlassPanel.tsx
│   │   ├── FABGroup.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── EmptySlot.tsx
│   │   ├── CategoryIcon.tsx
│   │   └── index.ts
│   ├── layout/       # 앱 셸
│   │   ├── AppLayout.tsx
│   │   ├── SideNav.tsx
│   │   ├── TopBar.tsx
│   │   └── index.ts
│   └── features/     # 페이지 전용 조립체
│       ├── tasks/
│       │   ├── TaskCard.tsx
│       │   ├── TaskGrid.tsx
│       │   └── index.ts
│       └── itinerary/
│           ├── StopCard.tsx
│           ├── DaySelector.tsx
│           ├── DaySidebar.tsx
│           ├── TimelineThread.tsx
│           └── index.ts
├── pages/
│   ├── LandingPage.tsx
│   ├── TaskPage.tsx
│   └── ItineraryPage.tsx
├── data/
│   └── tripData.ts       # 모든 mock 데이터의 단일 출처
├── types/
│   └── index.ts          # 모든 공유 TypeScript 인터페이스
└── hooks/                # 커스텀 훅만
```

**레이어 규칙 (절대 준수)**
- `ui/` → useState, useEffect, data import 금지
- `common/` → tripData.ts import 금지
- `features/` → data import 허용되는 유일한 레이어
- 새 타입은 반드시 `src/types/index.ts`에만 추가
- 컴포넌트 내 데이터 하드코딩 금지 → `src/data/tripData.ts`에서 import

---

## 디자인 시스템

### Tailwind v4 설정 방식
```css
/* src/index.css */
@import "tailwindcss";   ← 이 한 줄만. @tailwind base/components/utilities 사용 금지

@theme {
  --color-primary: #106a68;
  /* 모든 토큰은 @theme {} 블록 안에 CSS 변수로 */
}
```
- `tailwind.config.js` 없음 — 모든 토큰은 `src/index.css`의 `@theme {}`에서 관리
- 임의값 사용 금지: `bg-[#106a68]` ❌ → `bg-primary` ✅

### 핵심 색상 토큰
| 용도 | 클래스 | 값 |
|------|--------|-----|
| 주요 액션 | `bg-primary` | #106a68 |
| 페이지 배경 | `bg-background` | #f8fafb |
| 카드 (부각) | `bg-surface-container-lowest` | #ffffff |
| 카드 (내려앉음) | `bg-surface-container-low` | #f0f4f6 |
| 섹션 배경 | `bg-surface-container` | #eaeff0 |
| 본문 텍스트 | `text-on-surface` | #2c3436 |
| 보조 텍스트 | `text-on-surface-variant` | #596063 |

### No-Line 규칙
1px solid border로 섹션 구분 **절대 금지**
→ 배경색 변화로만 영역 구분
→ 예외: ghost input 테두리(15~20% opacity), dashed 플레이스홀더

### 타이포그래피
- 헤드라인/디스플레이: `font-headline` (Manrope) + `font-bold` 또는 `font-extrabold`
- 본문/UI: `font-body` (Inter) + `font-medium` 또는 `font-semibold`
- eyebrow: `text-primary text-xs font-bold uppercase tracking-widest`
- 순수 검정 텍스트 금지 → 항상 `text-on-surface`

### 버튼 클래스
```
primary:   signature-gradient text-on-primary rounded-full font-semibold
secondary: bg-surface-container-high text-on-secondary-container rounded-full font-semibold
ghost:     border border-outline-variant text-outline rounded-full font-semibold
```

### 그림자
- 카드: `shadow-ambient` (ambient glow, heavy shadow 금지)
- FAB: `shadow-float` 또는 인라인 `rgba(16,106,104,0.4)`

### 아이콘
```tsx
// 항상 이 패턴만 사용
<span className="material-symbols-outlined">icon_name</span>

// filled 아이콘만 예외적으로 인라인 스타일 허용
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
  icon_name
</span>
```

---

## 코드 스타일

### TypeScript
- `strict: true` — `any` 절대 금지
- 모든 props는 `{ComponentName}Props` 인터페이스로 명시적 타입 정의
- union type 우선: `'todo' | 'in-progress' | 'done'` (enum 사용 금지)
- 내부 네비게이션은 `<Link>` — `<a href>` 절대 금지

### 파일 구조 순서
```ts
// 1. React import
// 2. 서드파티 (react-router-dom 등)
// 3. 내부 import (types → data → components 순)
// 4. Props 인터페이스 정의
// 5. 컴포넌트 함수
// 6. default export
```

### CSS
- Tailwind 유틸리티 클래스만 사용 (CSS 모듈, styled-components 금지)
- 조건부 클래스: 템플릿 리터럴 또는 clsx
- 인라인 스타일: `fontVariationSettings`와 FAB `boxShadow`만 허용

### path alias
```ts
import { Button } from '@/components/ui';
import { FABGroup } from '@/components/common';
```

---

## Git 컨벤션

### 브랜치 네이밍
```
feat/feature-name        # 새 기능
UI/component-name        # 스타일/디자인 변경
fix/bug-description      # 버그 수정
refactor/what-changed    # 리팩토링
chore/task-description   # 설정, 의존성, 툴링
docs/what-changed        # 문서
```

### 브랜치 흐름
```
main ← develop ← feature branch
```
- feature 브랜치는 항상 `develop`에서 분기
- PR은 `develop`으로만

### 커밋 메시지 형식
```
{브랜치명}

{type}: 한 줄 요약 (명령형, 72자 이내)

- 상세 내용 1
- 상세 내용 2
```

### PR 템플릿
```markdown
## 구현 기능
* 구현한 기능을 bullet point로 요약

## 구현 상태 (선택)
* 스크린샷, 표, 또는 동작 설명
```

---

## 절대 하지 말 것

```
✗ <a href="/tasks">   →  ✅ <Link to="/tasks">
✗ text-black          →  ✅ text-on-surface
✗ bg-[#106a68]        →  ✅ bg-primary
✗ @tailwind base      →  ✅ @import "tailwindcss"
✗ tailwind.config.js  →  ✅ src/index.css @theme{}
✗ 1px solid border    →  ✅ bg color shift
✗ any 타입            →  ✅ 명시적 인터페이스
✗ 컴포넌트 내 하드코딩  →  ✅ tripData.ts import
✗ ui/ 에서 data import →  ✅ features/ 에서만
```
