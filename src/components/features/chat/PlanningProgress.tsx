import { useEffect, useState } from 'react';

interface CrawlingStatus {
  accommodation_count: number;
  activity_count: number;
  flight_count: number;
  has_exchange_rate: boolean;
}

interface PlanningProgressProps {
  phase: string;
  isStreaming: boolean;
  thinkingSteps: string[];
  crawlingStatus: CrawlingStatus | null;
  isDone: boolean;
}

export default function PlanningProgress({
  phase,
  isStreaming,
  thinkingSteps,
  crawlingStatus,
  isDone,
}: PlanningProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'planning') {
      setProgress(0);
      return;
    }
    if (isDone) {
      setProgress(100);
      return;
    }

    let p = 10;
    if (crawlingStatus) {
      p = 15;
      if (crawlingStatus.accommodation_count > 0) p = Math.max(p, 30);
      if (crawlingStatus.activity_count > 0) p = Math.max(p, 45);
      if (crawlingStatus.flight_count > 0) p = Math.max(p, 55);
      if (crawlingStatus.has_exchange_rate) p = Math.max(p, 65);
    }
    if (thinkingSteps.length > 0) p = Math.max(p, 75);
    if (thinkingSteps.length > 3) p = Math.max(p, 85);
    if (thinkingSteps.length > 6) p = Math.max(p, 90);
    setProgress(p);
  }, [phase, crawlingStatus, thinkingSteps, isDone]);

  if (phase !== 'planning' || (!isStreaming && !isDone)) return null;

  const lastStep = thinkingSteps[thinkingSteps.length - 1];

  return (
    <div
      style={{
        padding: '16px',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#1e40af',
        }}
      >
        <span>✈️ 여행 계획 생성 중...</span>
        <span>{progress}%</span>
      </div>
      <div
        style={{
          background: '#dbeafe',
          borderRadius: '9999px',
          height: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
            height: '100%',
            borderRadius: '9999px',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
      {lastStep && (
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#3b82f6' }}>
          {lastStep}
        </p>
      )}
    </div>
  );
}
