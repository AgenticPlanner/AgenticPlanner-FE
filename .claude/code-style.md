# 코드 스타일 규칙

## TypeScript

- `strict: true` 적용 — 컴파일 에러 0 유지
- 모든 컴포넌트 props는 `interface {ComponentName}Props {}` 로 명시적 선언
- 상태값 타입은 union string: `'todo' | 'in-progress' | 'done'`
- 조건부 렌더링: 삼항 연산자 또는 `&&` — `if/else` 블록 JSX 내 금지
- 이벤트 핸들러 타입: `React.MouseEvent<HTMLButtonElement>` 등 명시

## CSS

- Tailwind 유틸리티 클래스만 사용
- 조건부 클래스: 템플릿 리터럴 또는 `clsx()` 사용
  ```tsx
  // 올바른 예
  className={`base-class ${isActive ? 'bg-primary' : 'bg-surface-container'}`}
  ```
- 인라인 `style` 허용 범위: `fontVariationSettings` (아이콘 filled), FAB `boxShadow` 2가지만

## Path Alias

```ts
import { Button } from '@/components/ui';
import { FABGroup } from '@/components/common';
import { TaskCard } from '@/components/features/tasks';
import type { Task } from '@/types';
import { tripData } from '@/data/tripData';
```

## 컴포넌트 작성 규칙

- 컴포넌트 파일 1개 = 컴포넌트 1개 (복수 export 금지)
- 파일당 100줄 이하 목표 — 초과 시 하위 컴포넌트로 분리
- props drilling 3단계 초과 시 Context 또는 상위 컴포넌트 재구성 검토
- 내부 네비게이션: `<Link to="...">` 사용, `window.location` 조작 금지

## 하지 마

- `any`, `unknown` 캐스팅으로 에러 우회 금지 — 타입을 올바르게 정의
- `// @ts-ignore`, `// @ts-expect-error` 사용 금지
- CSS 모듈(`.module.css`), styled-components, emotion 사용 금지
- `<a href="/internal">` 내부 링크에 사용 금지 → `<Link to="...">`
- 인라인 스타일로 색상·간격 직접 지정 금지 → 토큰 클래스 사용
- `enum` 사용 금지 → union type 사용
- 컴포넌트 파일 내 `export const X = ...` 복수 named export 금지
