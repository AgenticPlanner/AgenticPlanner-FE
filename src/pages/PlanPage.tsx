import { useState, useRef, useEffect } from 'react';
import type { PlanFormData, ChatMessage } from '@/types';
import { AppLayout } from '@/components/layout';
import { PlanInputPanel, CaptainBeanChat } from '@/components/features/plan';
import { ResizeDivider } from '@/components/common';
import { usePanelResize } from '@/hooks/usePanelResize';
import {
  defaultInterestTags,
  initialChatMessages,
  BUDGET_MIN,
  BUDGET_MAX,
} from '@/data/tripData';

export default function PlanPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const { size: leftPanelPercent, isDragging, handleMouseDown, handleTouchStart } = usePanelResize({
    direction: 'horizontal',
    initialSize: 45,
    minSize: 30,
    maxSize: 65,
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

  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);

  const handleSendMessage = (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
  };

  const handleFormChange = (updated: Partial<PlanFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleGenerateItinerary = () => {
    console.log('Generate:', formData);
  };

  return (
    <AppLayout topBarTitle="Plan">
      <div
        ref={containerRef}
        className={`flex overflow-hidden bg-surface h-[calc(100vh-5rem)] ${
          isDragging ? 'pointer-events-none select-none' : ''
        }`}
      >
        {/* Input panel — full width on mobile, resizable on desktop */}
        <div
          className="h-full flex flex-col"
          style={isMobile ? { width: '100%' } : { width: `${leftPanelPercent}%` }}
        >
          <PlanInputPanel
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleGenerateItinerary}
          />
        </div>

        {/* Resize divider + Chat panel — desktop only */}
        <ResizeDivider
          direction="horizontal"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          isDragging={isDragging}
          className="hidden md:flex h-full"
        />
        <div className="hidden md:flex flex-col flex-1 min-w-0 h-full">
          <CaptainBeanChat messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </AppLayout>
  );
}
