# CLAUDE.md — Serene Navigator

> 프로젝트별 규칙 파일. 모든 작업은 이 파일의 규칙을 최우선으로 따릅니다.

## 프로젝트 개요

**Serene Navigator** — 럭셔리 여행 플래닝 앱
컨셉: "The Digital Sanctuary" — 스트레스 없는 하이엔드 에디토리얼 UI

**스택**
- React 18 + TypeScript (`strict: true`)
- Vite / Tailwind CSS v4 / react-router-dom v6
- 패키지 매니저: npm

## 세부 규칙 파일

- @.claude/architecture.md — 디렉토리 구조 및 레이어 규칙
- @.claude/design.md — 디자인 시스템 (색상, 타이포그래피, 아이콘)
- @.claude/code-style.md — TypeScript · CSS · import 규칙
- @.claude/git.md — 브랜치·커밋·PR 컨벤션

## 전역 금지 항목

| 하지 마 | 대신 |
|---------|------|
| `<a href="/path">` | `<Link to="/path">` |
| `text-black` | `text-on-surface` |
| `bg-[#106a68]` | `bg-primary` |
| `any` 타입 | 명시적 인터페이스 |
| `1px solid border`로 구분 | 배경색 변화로 구분 |
| `@tailwind base` | `@import "tailwindcss"` |
| `tailwind.config.js` 수정 | `src/index.css` `@theme{}` 수정 |
| 컴포넌트 내 데이터 하드코딩 | `src/data/tripData.ts` import |
| `ui/`에서 data import | `features/`에서만 허용 |
| CSS 모듈·styled-components | Tailwind 유틸리티 클래스 |
