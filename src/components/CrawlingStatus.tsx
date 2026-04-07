import { useState, useEffect } from 'react'

interface CrawlingStatusProps {
  phase: string
  isStreaming: boolean
  crawlingStatus: {
    accommodation_count: number
    activity_count: number
    flight_count: number
    has_exchange_rate: boolean
  } | null
  thinkingSteps: string[]
  isDone: boolean
  planSummary?: {
    days: number
    accommodations: number
    restaurants: number
    transports: number
  }
  onViewPlan?: () => void
}

const BEAN_PHASES: Record<string, {
  label: string
  subLabel: (steps: string[], cs: CrawlingStatusProps['crawlingStatus']) => string
  speed: number
  colorVar: string
  bgVar: string
  borderVar: string
}> = {
  guideline: {
    label: '여행 테마 설정 중',
    subLabel: () => 'Captain Bean이 딱 맞는 여행 스타일을 찾고 있어요',
    speed: 1600,
    colorVar: '--color-text-info',
    bgVar: '--color-background-secondary',
    borderVar: '--color-border-tertiary',
  },
  detail_collect: {
    label: '여행 정보 수집 중',
    subLabel: () => 'Captain Bean이 여행 조건을 꼼꼼히 정리하고 있어요',
    speed: 1400,
    colorVar: '--color-text-info',
    bgVar: '--color-background-secondary',
    borderVar: '--color-border-tertiary',
  },
  planning: {
    label: '실시간 가격 수집 중',
    subLabel: (_, cs) => cs
      ? '숙소·항공·맛집 정보를 긁어오고 있어요. 잠깐만요!'
      : '데이터를 모으는 중이에요',
    speed: 900,
    colorVar: '--color-text-primary',
    bgVar: '--color-background-secondary',
    borderVar: '--color-border-tertiary',
  },
  result: {
    label: 'Captain Bean이 일정을 짜고 있어요',
    subLabel: (steps) => steps.length > 0
      ? `💭 ${steps[steps.length - 1]}`
      : '열심히 최적 경로를 고민 중이에요',
    speed: 700,
    colorVar: '--color-text-primary',
    bgVar: '--color-background-secondary',
    borderVar: '--color-border-tertiary',
  },
  editing: {
    label: '수정 사항 반영 중',
    subLabel: (steps) => steps.length > 0
      ? `💭 ${steps[steps.length - 1]}`
      : 'Captain Bean이 다시 검토하고 있어요',
    speed: 800,
    colorVar: '--color-text-primary',
    bgVar: '--color-background-secondary',
    borderVar: '--color-border-tertiary',
  },
}

export default function CrawlingStatus({
  phase,
  isStreaming,
  crawlingStatus,
  thinkingSteps,
  isDone,
  planSummary,
  onViewPlan,
}: CrawlingStatusProps) {
  const [progress, setProgress] = useState(0)

  const cfg = BEAN_PHASES[phase] || BEAN_PHASES.planning

  // 진행률 계산
  useEffect(() => {
    if (isDone) { setProgress(100); return }
    if (!isStreaming) { setProgress(0); return }

    let p = 10
    if (crawlingStatus) {
      p = 25
      if (crawlingStatus.accommodation_count > 0) p = Math.max(p, 40)
      if (crawlingStatus.activity_count > 0)      p = Math.max(p, 55)
      if (crawlingStatus.flight_count > 0)         p = Math.max(p, 65)
      if (crawlingStatus.has_exchange_rate)        p = Math.max(p, 70)
    }
    if (thinkingSteps.length > 0) p = Math.max(p, 75)
    if (thinkingSteps.length > 2) p = Math.max(p, 82)
    if (thinkingSteps.length > 5) p = Math.max(p, 88)
    if (thinkingSteps.length > 8) p = Math.max(p, 93)
    setProgress(p)
  }, [isStreaming, isDone, crawlingStatus, thinkingSteps])

  if (!isStreaming && !isDone) return null

  // ── 완료 상태 ──────────────────────────────────────────
  if (isDone) {
    return (
      <div style={{
        background: 'var(--color-background-success)',
        border: '0.5px solid var(--color-border-success)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '8px',
        animation: 'fadeIn 0.4s ease',
      }}>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <span style={{ fontSize: '24px', lineHeight: 1 }}>🫘</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-success)' }}>
            완성! Captain Bean의 역작이에요 ✨
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-success)', opacity: 0.8 }}>
            {planSummary
              ? `${planSummary.days}일 일정 · 숙소 ${planSummary.accommodations}곳 · 맛집 ${planSummary.restaurants}곳`
              : '여행 계획이 완성됐어요'}
          </p>
        </div>
        {onViewPlan && (
          <button
            onClick={onViewPlan}
            style={{
              fontSize: '12px',
              padding: '6px 14px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            플랜 보기 →
          </button>
        )}
      </div>
    )
  }

  // ── 진행 중 상태 ─────────────────────────────────────────
  const showProgress = phase === 'result' || phase === 'editing'
  const showCrawlBadges = phase === 'planning' && crawlingStatus !== null

  return (
    <div style={{
      background: `var(${cfg.bgVar})`,
      border: `0.5px solid var(${cfg.borderVar})`,
      borderRadius: 'var(--border-radius-lg)',
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      marginBottom: '8px',
    }}>
      <style>{`
        @keyframes bob-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes dot-pulse{0%,100%{opacity:0.3}50%{opacity:1}}
        .bean-anim{animation:bob-slow ${cfg.speed}ms ease-in-out infinite}
        .d1{animation:dot-pulse 1.2s infinite 0s}
        .d2{animation:dot-pulse 1.2s infinite 0.4s}
        .d3{animation:dot-pulse 1.2s infinite 0.8s}
      `}</style>

      {/* Captain Bean */}
      <span className="bean-anim" style={{ fontSize: '26px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>
        🫘
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 제목 */}
        <p style={{
          margin: '0 0 3px',
          fontSize: '14px',
          fontWeight: 500,
          color: `var(${cfg.colorVar})`,
        }}>
          {cfg.label}
        </p>

        {/* 서브 텍스트 */}
        <p style={{
          margin: '0 0 8px',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {cfg.subLabel(thinkingSteps, crawlingStatus)}
          {!showProgress && (
            <>
              <span className="d1" style={{ display: 'inline-block', marginLeft: '2px' }}>·</span>
              <span className="d2" style={{ display: 'inline-block' }}>·</span>
              <span className="d3" style={{ display: 'inline-block' }}>·</span>
            </>
          )}
        </p>

        {/* 크롤링 배지 (planning phase) */}
        {showCrawlBadges && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {[
              { key: 'accommodation', icon: '🏨', label: '숙소', done: (crawlingStatus?.accommodation_count ?? 0) > 0, count: crawlingStatus?.accommodation_count },
              { key: 'activity',      icon: '🏄', label: '액티비티', done: (crawlingStatus?.activity_count ?? 0) > 0, count: crawlingStatus?.activity_count },
              { key: 'flight',        icon: '✈️', label: '항공', done: (crawlingStatus?.flight_count ?? 0) > 0, count: crawlingStatus?.flight_count },
              { key: 'exchange',      icon: '💱', label: '환율', done: !!crawlingStatus?.has_exchange_rate, count: null },
            ].map(item => (
              <span key={item.key} style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--border-radius-md)',
                background: item.done ? 'var(--color-background-success)' : 'var(--color-background-primary)',
                color: item.done ? 'var(--color-text-success)' : 'var(--color-text-secondary)',
                border: `0.5px solid ${item.done ? 'var(--color-border-success)' : 'var(--color-border-tertiary)'}`,
                transition: 'all 0.3s ease',
              }}>
                {item.icon} {item.label}
                {item.done && item.count ? ` ${item.count}개 ✓` : item.done ? ' ✓' : (
                  <>
                    <span className="d1" style={{ display: 'inline-block', marginLeft: '2px' }}>·</span>
                    <span className="d2" style={{ display: 'inline-block' }}>·</span>
                    <span className="d3" style={{ display: 'inline-block' }}>·</span>
                  </>
                )}
              </span>
            ))}
          </div>
        )}

        {/* 진행률 바 (result/editing phase) */}
        {showProgress && (
          <>
            <div style={{
              background: 'var(--color-background-primary)',
              borderRadius: '999px',
              height: '4px',
              overflow: 'hidden',
              border: '0.5px solid var(--color-border-tertiary)',
              marginBottom: '4px',
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--color-text-success)',
                borderRadius: '999px',
                transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
              }}/>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              {progress}%
            </p>
          </>
        )}
      </div>
    </div>
  )
}
