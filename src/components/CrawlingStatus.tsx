import { useEffect, useState } from 'react';

interface CrawlingStatusProps {
  phase: string;
  isStreaming: boolean;
  crawlingStatus: {
    accommodation_count: number;
    activity_count: number;
    flight_count: number;
    has_exchange_rate: boolean;
  } | null;
  thinkingSteps: string[];
  isDone: boolean;
}

export default function CrawlingStatus({
  phase,
  isStreaming,
  crawlingStatus,
  thinkingSteps,
  isDone,
}: CrawlingStatusProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    if (!isStreaming && !isDone) { setProgress(0); return; }
    if (isDone) { setProgress(100); return; }

    if (phase === 'planning') {
      let p = 10;
      if (crawlingStatus) {
        p = 20;
        if (crawlingStatus.accommodation_count > 0) p = Math.max(p, 35);
        if (crawlingStatus.activity_count > 0) p = Math.max(p, 50);
        if (crawlingStatus.flight_count > 0) p = Math.max(p, 60);
        if (crawlingStatus.has_exchange_rate) p = Math.max(p, 65);
      }
      if (thinkingSteps.length > 0) p = Math.max(p, 75);
      if (thinkingSteps.length > 3) p = Math.max(p, 85);
      if (thinkingSteps.length > 6) p = Math.max(p, 92);
      setProgress(p);
      setCurrentStep(thinkingSteps[thinkingSteps.length - 1] || '');
    }
  }, [phase, crawlingStatus, thinkingSteps, isDone, isStreaming]);

  if (!isStreaming && !isDone) return null;
  if (phase !== 'planning' && phase !== 'detail_collect') return null;

  const crawlItems = [
    { key: 'accommodation', icon: '🏨', label: '숙소',     done: (crawlingStatus?.accommodation_count ?? 0) > 0 },
    { key: 'activity',      icon: '🏄', label: '액티비티', done: (crawlingStatus?.activity_count ?? 0) > 0 },
    { key: 'flight',        icon: '✈️', label: '항공',     done: (crawlingStatus?.flight_count ?? 0) > 0 },
    { key: 'exchange',      icon: '💱', label: '환율',     done: crawlingStatus?.has_exchange_rate ?? false },
    { key: 'restaurant',    icon: '🍽️', label: '맛집',     done: false },
  ];

  return (
    <div style={{
      margin: '8px 0',
      padding: '20px',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
      border: '1px solid #c7d2fe',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.05), transparent)',
        animation: isDone ? 'none' : 'shimmer 2s infinite',
      }} />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }
        @keyframes spin {
          to { transform: rotate(360deg) }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-4px) }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px) }
          to { opacity: 1; transform: translateY(0) }
        }
      `}</style>

      <div style={{
        display: 'flex', alignItems: 'center',
        gap: '10px', marginBottom: '16px',
      }}>
        {isDone ? (
          <span style={{ fontSize: '20px' }}>✅</span>
        ) : (
          <div style={{
            width: '20px', height: '20px',
            border: '2px solid #6366f1',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
          }} />
        )}
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#3730a3' }}>
          {isDone
            ? '🎉 여행 계획 생성 완료!'
            : phase === 'planning'
              ? '✈️ 실시간 데이터 수집 중...'
              : '🔍 여행 정보 분석 중...'}
        </span>
        {!isDone && (
          <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 700, color: '#6366f1' }}>
            {progress}%
          </span>
        )}
      </div>

      <div style={{
        background: '#e0e7ff',
        borderRadius: '999px',
        height: '6px',
        overflow: 'hidden',
        marginBottom: '16px',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: isDone
            ? 'linear-gradient(90deg, #22c55e, #16a34a)'
            : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          borderRadius: '999px',
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      {crawlingStatus !== null && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {crawlItems.map((item) => (
            <div key={item.key} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px',
              background: item.done ? '#dcfce7' : '#fff',
              border: `1px solid ${item.done ? '#86efac' : '#e0e7ff'}`,
              borderRadius: '20px',
              fontSize: '12px',
              color: item.done ? '#166534' : '#6b7280',
              fontWeight: item.done ? 600 : 400,
              transition: 'all 0.3s ease',
              animation: item.done ? 'fadeIn 0.3s ease' : 'none',
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.done && <span>✓</span>}
              {!item.done && !isDone && (
                <span style={{
                  display: 'inline-block',
                  animation: 'bounce 1s infinite',
                  animationDelay: `${Math.random() * 0.5}s`,
                }}>·</span>
              )}
            </div>
          ))}
        </div>
      )}

      {currentStep && !isDone && (
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: '#6366f1',
          fontStyle: 'italic',
          animation: 'fadeIn 0.3s ease',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          💭 {currentStep}
        </p>
      )}
    </div>
  );
}
