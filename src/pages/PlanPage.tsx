import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlanFormData } from '@/types';
import type { TravelInfo } from '@/types/api';
import { AppLayout } from '@/components/layout';
import { PlanInputPanel, SessionList } from '@/components/features/plan';
import { ResizeDivider } from '@/components/common';
import { usePanelResize } from '@/hooks/usePanelResize';
import { createAgentSession } from '@/api/agent';
import { defaultInterestTags, BUDGET_MIN, BUDGET_MAX } from '@/data/tripData';

export default function PlanPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const { size: leftPanelPercent, isDragging, handleMouseDown, handleTouchStart } = usePanelResize({
    direction: 'horizontal',
    initialSize: 55,
    minSize: 35,
    maxSize: 70,
    unit: 'percent',
    storageKey: 'plan-left-panel',
    containerRef,
  });

  const [formData, setFormData] = useState<PlanFormData>({
    destination: '',
    departureDate: '',
    returnDate: '',
    budgetMin: BUDGET_MIN,
    budgetMax: BUDGET_MAX,
    interests: defaultInterestTags,
    additionalContext: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (updated: Partial<PlanFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleGenerateItinerary = async () => {
    try {
      setIsLoading(true);
      const travelInfo: TravelInfo = {
        destination: formData.destination,
        start_date: formData.departureDate,
        end_date: formData.returnDate,
        group_size: 2,
        budget: formData.budgetMax,
        travel_style: formData.interests
          .filter((t) => t.selected)
          .map((t) => t.label)
          .join(', '),
        special_requests: formData.additionalContext || undefined,
      };
      const session = await createAgentSession(travelInfo);
      navigate(`/chat?sessionId=${session.id}&autoStart=true`);
    } catch (error) {
      console.error('세션 생성 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout topBarTitle="플랜">
      <div
        ref={containerRef}
        className={`flex overflow-hidden bg-surface h-[calc(100vh-5rem)] ${
          isDragging ? 'pointer-events-none select-none' : ''
        }`}
      >
        {/* 폼 패널 — 모바일 전체, 데스크톱 리사이즈 가능 */}
        <div
          className="h-full flex flex-col"
          style={isMobile ? { width: '100%' } : { width: `${leftPanelPercent}%` }}
        >
          <PlanInputPanel
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleGenerateItinerary}
            isLoading={isLoading}
          />
        </div>

        {/* 구분선 + 세션 목록 패널 — 데스크톱 전용 */}
        <ResizeDivider
          direction="horizontal"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          isDragging={isDragging}
          className="hidden md:flex h-full"
        />
        <div className="hidden md:flex flex-col flex-1 min-w-0 h-full">
          <SessionList />
        </div>
      </div>
    </AppLayout>
  );
}
