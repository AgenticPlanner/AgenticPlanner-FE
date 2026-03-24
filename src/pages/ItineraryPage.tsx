import { useState } from 'react';
import { AppLayout } from '../components/layout';
import { DaySelector, TimelineThread, StopCard, DaySidebar } from '../components/features/itinerary';
import { FABGroup } from '../components/common';
import { tripDays } from '../data/tripData';

export default function ItineraryPage() {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const activeDay = tripDays[activeDayIndex];

  return (
    <AppLayout topBarTitle="일정">
      <div className="pt-8 px-12 pb-20 max-w-6xl w-full mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <span className="block text-primary font-bold tracking-widest text-xs uppercase mb-2">
            태평양 해안 투어
          </span>
          <h3 className="font-headline font-extrabold text-5xl text-on-surface mb-10">
            여행 일정
          </h3>

          {/* Day Selector */}
          <DaySelector days={tripDays} activeDayIndex={activeDayIndex} onSelect={setActiveDayIndex} />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column - Timeline */}
          <div className="col-span-12 lg:col-span-8">
            <div className="space-y-12 relative" key={activeDayIndex}>
              <TimelineThread />
              {activeDay.stops.map((stop) => (
                <StopCard key={stop.id} stop={stop} />
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-28">
              <DaySidebar day={activeDay} dayIndex={activeDayIndex + 1} />
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <FABGroup onShare={() => {}} onAdd={() => {}} addIcon="add_task" />
      </div>
    </AppLayout>
  );
}
