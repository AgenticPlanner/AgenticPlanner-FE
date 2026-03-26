import { useState, useRef, useEffect } from 'react';
import { AppLayout } from '../components/layout';
import { DaySelector, TimelineThread, StopCard, DaySidebar } from '../components/features/itinerary';
import { FABGroup, ResizeDivider } from '../components/common';
import { usePanelResize } from '../hooks/usePanelResize';
import { tripDays } from '../data/tripData';

type ItineraryMobileTab = 'timeline' | 'sidebar';

export default function ItineraryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const activeDay = tripDays[activeDayIndex];
  const [mobileTab, setMobileTab] = useState<ItineraryMobileTab>('timeline');

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const { size: timelineWidth, isDragging, handleMouseDown, handleTouchStart } = usePanelResize({
    direction: 'horizontal',
    initialSize: 66,
    minSize: 50,
    maxSize: 80,
    unit: 'percent',
    storageKey: 'itinerary-timeline-panel',
    containerRef,
  });

  return (
    <AppLayout topBarTitle="일정">
      <div className="pt-8 px-4 md:px-12 pb-20 max-w-6xl w-full mx-auto">
        {/* Hero Section */}
        <div className="mb-10 md:mb-16">
          <span className="block text-primary font-bold tracking-widest text-xs uppercase mb-2">
            태평양 해안 투어
          </span>
          <h3 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface mb-8 md:mb-10">
            여행 일정
          </h3>

          {/* Day Selector — horizontal scroll on mobile */}
          <div className="overflow-x-auto no-scrollbar">
            <DaySelector
              days={tripDays}
              activeDayIndex={activeDayIndex}
              onSelect={setActiveDayIndex}
            />
          </div>
        </div>

        {/* Mobile panel switcher */}
        <div className="flex md:hidden bg-surface-container rounded-xl p-1 mb-8">
          {(['timeline', 'sidebar'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                mobileTab === tab
                  ? 'bg-surface-container-lowest text-primary shadow-ambient'
                  : 'text-on-surface-variant'
              }`}
            >
              {tab === 'timeline' ? 'Timeline' : 'Stats'}
            </button>
          ))}
        </div>

        {/* Resizable two-panel layout */}
        <div
          ref={containerRef}
          className={`flex items-start ${isDragging ? 'pointer-events-none select-none' : ''}`}
        >
          {/* Timeline panel */}
          <div
            className={`${mobileTab === 'timeline' ? 'w-full md:w-auto' : 'hidden md:block'} relative min-w-0`}
            style={isMobile ? undefined : { width: `${timelineWidth}%` }}
          >
            <div className="space-y-12 relative" key={activeDayIndex}>
              <TimelineThread />
              {activeDay.stops.map((stop) => (
                <StopCard key={stop.id} stop={stop} />
              ))}
            </div>
          </div>

          {/* Resize divider — desktop only */}
          <ResizeDivider
            direction="horizontal"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            isDragging={isDragging}
            className="hidden md:flex self-stretch"
          />

          {/* Sidebar panel */}
          <div
            className={`${mobileTab === 'sidebar' ? 'w-full md:w-auto' : 'hidden md:block'} flex-1 min-w-0 space-y-8 lg:sticky lg:top-28`}
          >
            <DaySidebar day={activeDay} dayIndex={activeDayIndex + 1} />
          </div>
        </div>

        {/* Floating Action Buttons */}
        <FABGroup onShare={() => {}} onAdd={() => {}} addIcon="add_task" />
      </div>
    </AppLayout>
  );
}
