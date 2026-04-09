import { useState, useEffect } from 'react'

interface PlanningOverlayProps {
  phase: string
  crawlingStatus: {
    accommodation_count: number
    activity_count: number
    flight_count: number
    has_exchange_rate: boolean
  } | null
  thinkingSteps: string[]
  progress: number
  savingStep?: { step: string; message: string } | null
}

const STEP_MESSAGES = [
  { min: 0,   max: 15,  bean: '🫘', msg: '실시간 데이터를 긁어오고 있어요',       sub: '잠깐만요, 금방 돼요!' },
  { min: 15,  max: 35,  bean: '🫘', msg: '숙소 가격을 확인하고 있어요',           sub: '최저가 찾는 중...' },
  { min: 35,  max: 55,  bean: '🫘', msg: '액티비티 정보를 모으고 있어요',         sub: '재미있는 것들이 많네요!' },
  { min: 55,  max: 70,  bean: '🫘', msg: '항공/교통 정보 확인 중',               sub: '최적 루트를 찾고 있어요' },
  { min: 70,  max: 82,  bean: '🫘', msg: 'Captain Bean이 일정을 짜고 있어요',    sub: '퍼즐 맞추듯 최적 배치 중' },
  { min: 82,  max: 93,  bean: '🫘', msg: '맛집을 골라내고 있어요',               sub: '현지인 추천 위주로 선별 중!' },
  { min: 93,  max: 99,  bean: '🫘', msg: '마지막 점검 중이에요',                 sub: '거의 다 됐어요!' },
  { min: 99,  max: 101, bean: '🫘', msg: '완성!',                               sub: '최고의 여행 계획이에요 ✨' },
]

export default function PlanningOverlay({
  crawlingStatus,
  thinkingSteps,
  progress,
  savingStep,
}: PlanningOverlayProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [bobSpeed, setBobSpeed] = useState(1600)

  // 진행률 스무스 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress((prev) => {
        if (progress > prev) return Math.min(prev + 1, progress)
        return prev
      })
    }, 30)
    return () => clearTimeout(timer)
  }, [progress, displayProgress])

  // 진행률에 따라 bean 속도 빨라짐
  useEffect(() => {
    setBobSpeed(progress < 30 ? 1600 : progress < 70 ? 1000 : 700)
  }, [progress])

  const step =
    STEP_MESSAGES.find((s) => displayProgress >= s.min && displayProgress < s.max) ||
    STEP_MESSAGES[0]

  const crawlItems = [
    { icon: '🏨', label: '숙소',      done: (crawlingStatus?.accommodation_count ?? 0) > 0 },
    { icon: '🎡', label: '액티비티',  done: (crawlingStatus?.activity_count ?? 0) > 0 },
    { icon: '✈️', label: '항공/교통', done: (crawlingStatus?.flight_count ?? 0) > 0 },
    { icon: '💱', label: '환율',      done: !!crawlingStatus?.has_exchange_rate },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'overlayIn 0.3s ease',
      }}
    >
      <style>{`
        @keyframes overlayIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
        @keyframes beanBob {
          0%, 100% { transform: translateY(0) }
          50%       { transform: translateY(-8px) }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3 }
          50%       { opacity: 1 }
        }
        .bean-bounce {
          display: inline-block;
          animation: beanBob var(--bob-speed, 1600ms) ease-in-out infinite;
        }
        .dot1 { animation: dotPulse 1.2s infinite 0s }
        .dot2 { animation: dotPulse 1.2s infinite 0.4s }
        .dot3 { animation: dotPulse 1.2s infinite 0.8s }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        @keyframes spin {
          to { transform: rotate(360deg) }
        }
      `}</style>

      {/* 카드 */}
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px 28px',
          width: '100%',
          maxWidth: '360px',
          margin: '0 20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          animation: 'cardIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Bean + 메시지 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <span
            className="bean-bounce"
            style={
              {
                fontSize: '52px',
                lineHeight: 1,
                marginBottom: '16px',
                '--bob-speed': `${bobSpeed}ms`,
              } as React.CSSProperties
            }
          >
            {step.bean}
          </span>
          <p style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#111827' }}>
            {step.msg}
            {displayProgress < 99 && (
              <>
                <span className="dot1" style={{ display: 'inline-block', marginLeft: '3px' }}>·</span>
                <span className="dot2" style={{ display: 'inline-block' }}>·</span>
                <span className="dot3" style={{ display: 'inline-block' }}>·</span>
              </>
            )}
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{step.sub}</p>
        </div>

        {/* 진행률 바 */}
        <div
          style={{
            background: '#f3f4f6',
            borderRadius: '999px',
            height: '8px',
            overflow: 'hidden',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: `${displayProgress}%`,
              height: '100%',
              background:
                displayProgress >= 99
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              borderRadius: '999px',
              transition: 'width 0.3s ease, background 0.5s ease',
            }}
          />
        </div>
        <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#9ca3af', textAlign: 'right' }}>
          {Math.round(displayProgress)}%
        </p>

        {/* 크롤링 배지 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {crawlItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 10px',
                background: item.done ? '#f0fdf4' : '#f9fafb',
                border: `1px solid ${item.done ? '#86efac' : '#e5e7eb'}`,
                borderRadius: '10px',
                fontSize: '12px',
                color: item.done ? '#166534' : '#9ca3af',
                fontWeight: item.done ? 600 : 400,
                transition: 'all 0.4s ease',
              }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.done ? (
                <span style={{ color: '#22c55e' }}>✓</span>
              ) : (
                <span style={{ display: 'flex', gap: '1px' }}>
                  <span className="dot1">·</span>
                  <span className="dot2">·</span>
                  <span className="dot3">·</span>
                </span>
              )}
            </div>
          ))}
        </div>

        {/* thinking step */}
        {thinkingSteps.length > 0 && (
          <p
            style={{
              margin: '16px 0 0',
              fontSize: '11px',
              color: '#a78bfa',
              fontStyle: 'italic',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            💭 {thinkingSteps[thinkingSteps.length - 1]}
          </p>
        )}

        {/* 저장 단계 */}
        {savingStep && (
          <div
            style={{
              marginTop: '16px',
              padding: '10px 14px',
              background: savingStep.step === 'plan_saved' ? '#f0fdf4' : '#eff6ff',
              border: `1px solid ${savingStep.step === 'plan_saved' ? '#86efac' : '#bfdbfe'}`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: savingStep.step === 'plan_saved' ? '#166534' : '#1e40af',
              fontWeight: 500,
              animation: 'fadeIn 0.3s ease',
            }}
          >
            {savingStep.step === 'plan_saved' ? (
              <span>✅</span>
            ) : (
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid #3b82f6',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  flexShrink: 0,
                }}
              />
            )}
            {savingStep.message}
          </div>
        )}

        {/* 저장 완료 로그 */}
        {savingStep?.step === 'plan_saved' && (
          <div
            style={{
              marginTop: '8px',
              padding: '8px 12px',
              background: '#f9fafb',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#9ca3af',
              fontFamily: 'monospace',
            }}
          >
            <div>📋 일정 저장됨</div>
            <div>✈️ 교통편 처리됨</div>
            <div>🏨 숙소 연결됨</div>
            <div>✅ 체크리스트 생성됨</div>
          </div>
        )}
      </div>
    </div>
  )
}
