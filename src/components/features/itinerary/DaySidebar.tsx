import type { TripDay } from '@/types/index';
import { StatRow } from '@/components/ui';
import { GlassPanel } from '@/components/common';

interface DaySidebarProps {
  day: TripDay;
  dayIndex: number;
}

export default function DaySidebar({ day, dayIndex }: DaySidebarProps) {
  return (
    <div className="space-y-8">
      {/* Map Panel */}
      <GlassPanel>
        {/* Map placeholder */}
        <div className="h-64 relative bg-gradient-to-br from-primary-container to-tertiary-container">
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />

          {/* Travel time card */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                예상 이동 시간
              </p>
              <p className="font-headline font-bold text-on-surface mt-1">
                {day.travelTime}
              </p>
            </div>
            <span className="material-symbols-outlined text-primary text-2xl">
              near_me
            </span>
          </div>
        </div>

        {/* Stats section */}
        <div className="p-6">
          <h5 className="font-headline font-bold text-lg text-on-surface mb-4">
            Day {dayIndex} 주요 정보
          </h5>

          <div className="space-y-4">
            <StatRow label="활동" value={day.stats.activities.toString()} />
            <StatRow label="평균 기온" value={day.stats.temp} />
            <StatRow
              label="소비 예산"
              value={day.stats.budgetSpent}
              valueClassName="text-primary"
            />
          </div>
        </div>
      </GlassPanel>

      {/* Tip Panel */}
      {day.tip && (
        <div className="bg-primary-container/30 p-6 rounded-xl border border-primary-container/50 flex items-start space-x-3">
          <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">
            lightbulb
          </span>
          <div>
            <p className="text-xs font-bold text-on-primary-container uppercase tracking-tight mb-1">
              여행 팁
            </p>
            <p className="text-sm text-on-primary-container leading-snug">{day.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}
