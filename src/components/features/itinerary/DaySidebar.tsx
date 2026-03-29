import type { TripDay } from '@/types/index';
import { StatRow } from '@/components/ui';
import { GlassPanel } from '@/components/common';
import { MapPin } from 'lucide-react';

interface DaySidebarProps {
  day: TripDay;
  dayIndex: number;
}

export default function DaySidebar({ day, dayIndex }: DaySidebarProps) {
  return (
    <div className="space-y-8 font-body">

      {/* Map Panel */}
      <div className="bg-white rounded-[20px] shadow-header overflow-hidden border border-slate-100">

        {/* 지도 이미지 배경 임시배치 */}
        <div className="h-64 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')" }}
          />

          <GlassPanel className="absolute bottom-5 left-5 right-5 p-5 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-700 tracking-widest uppercase drop-shadow-sm">
                예상 이동 시간
              </p>
              <p className="font-bold text-base text-slate-900 mt-1 drop-shadow-sm">
                {day.travelTime || '42 mins today'}
              </p>
            </div>
            <MapPin className="text-primary-dark drop-shadow-sm text-2xl" />
          </GlassPanel>
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
      </div>

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
