# 디자인 시스템

## Tailwind v4 설정

`src/index.css` 첫 줄: `@import "tailwindcss";` — 이 한 줄만 사용
모든 디자인 토큰은 `src/index.css`의 `@theme {}` 블록 안에 CSS 변수로 관리

## 색상 토큰

| 용도 | Tailwind 클래스 | 값 |
|------|----------------|-----|
| 주요 액션 | `bg-primary` / `text-primary` | #106a68 |
| 페이지 배경 | `bg-background` | #f8fafb |
| 카드 (부각) | `bg-surface-container-lowest` | #ffffff |
| 카드 (내려앉음) | `bg-surface-container-low` | #f0f4f6 |
| 섹션 배경 | `bg-surface-container` | #eaeff0 |
| 본문 텍스트 | `text-on-surface` | #2c3436 |
| 보조 텍스트 | `text-on-surface-variant` | #596063 |

## 타이포그래피

- 헤드라인: `font-headline font-bold` 또는 `font-extrabold` (Manrope)
- 본문·UI: `font-body font-medium` 또는 `font-semibold` (Inter)
- eyebrow 레이블: `text-primary text-xs font-bold uppercase tracking-widest`

## 버튼 클래스 패턴

```
primary:   signature-gradient text-on-primary rounded-full font-semibold
secondary: bg-surface-container-high text-on-secondary-container rounded-full font-semibold
ghost:     border border-outline-variant text-outline rounded-full font-semibold
```

## 그림자

- 카드: `shadow-ambient`
- FAB: `shadow-float` 또는 인라인 `boxShadow: '0 8px 24px rgba(16,106,104,0.4)'`

## 아이콘 패턴

```tsx
// 기본
<span className="material-symbols-outlined">icon_name</span>

// filled (유일하게 인라인 스타일 허용)
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
  icon_name
</span>
```

## 하지 마

- `bg-[#106a68]` 같은 임의값 사용 금지 → 반드시 토큰 클래스 사용
- `text-black`, `text-white` 직접 사용 금지 → `text-on-surface` 계열 사용
- `1px solid border`로 섹션 구분 금지 → 배경색 변화로만 구분
- `tailwind.config.js` 생성·수정 금지 → `src/index.css @theme{}` 수정
- `@tailwind base/components/utilities` 지시어 사용 금지
- 카드에 `shadow-lg`, `shadow-xl` 등 heavy shadow 사용 금지
- `font-sans`, `font-serif` 등 기본 폰트 클래스 사용 금지 → `font-headline`·`font-body` 사용
