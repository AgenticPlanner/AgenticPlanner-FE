import type { TripDay } from '@/types/index';
import type { APIPlanWeather, APIPlanTransport, APIDailyInfo } from '@/types/api';
import { StatRow } from '@/components/ui';
import { GlassPanel } from '@/components/common';
import { MapPin } from 'lucide-react';
import KakaoMap from '@/components/common/KakaoMap';
interface DaySidebarProps {
  day: TripDay;
  dayIndex: number;
  actualSpent?: number;
  weather?: APIPlanWeather;
  transport?: APIPlanTransport;
  dailyInfo?: APIDailyInfo;
}

export default function DaySidebar({ day, dayIndex, actualSpent, weather, transport, dailyInfo }: DaySidebarProps) {
  const effectiveWeather = dailyInfo?.weather ?? weather;
  return (
    <div className="space-y-8 font-body">
      <div className="bg-white rounded-[20px] shadow-header overflow-hidden border border-slate-100">

        {/* 지도 이미지 배경 임시배치 */}
        <div className="h-64 relative overflow-hidden">
          <KakaoMap stops={day.stops || []} />

          {/* 지도 가림 이슈로 임시 주석 처리 */}
          {/* <GlassPanel className="absolute bottom-5 left-5 right-5 p-5 flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-700 tracking-widest uppercase drop-shadow-sm">
                {transport ? `✈️ ${transport.origin} → ${transport.destination}` : '예상 이동 시간'}
              </p>
              <p className="font-bold text-base text-slate-900 mt-1 drop-shadow-sm">
                {dailyInfo?.total_transport_desc ||
                  (transport
                    ? `${Math.floor(transport.total_minutes / 60)}h${transport.total_minutes % 60 > 0 ? ` ${transport.total_minutes % 60}m` : ''}`
                    : (day.travelTime || '-'))}
              </p>
              {dailyInfo?.transport_segments && dailyInfo.transport_segments.length > 0 && (
                <div className="mt-1.5 space-y-0.5">
                  {dailyInfo.transport_segments.map((seg, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-slate-600 drop-shadow-sm">
                      <span className="truncate max-w-[65%]">
                        {seg.from.slice(0, 8)} → {seg.to.slice(0, 8)}
                      </span>
                      <span className="font-medium text-slate-800 shrink-0 ml-1">{seg.duration_desc}</span>
                    </div>
                  ))}
                </div>
              )}
              {!dailyInfo && transport?.duration_desc && (
                <p className="text-xs text-slate-600 mt-0.5 drop-shadow-sm">{transport.duration_desc}</p>
              )}
            </div>
            <MapPin className="text-primary-dark drop-shadow-sm text-2xl shrink-0 ml-3" />
          </GlassPanel> */}
        </div>

        {/* Stats section */}
        <div className="p-6">
          <h5 className="font-headline font-bold text-lg text-on-surface mb-4">
            Day {dayIndex} 주요 정보
          </h5>

          <div className="space-y-4">
            <StatRow label="활동" value={day.stats.activities.toString()} />
            {effectiveWeather ? (
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-on-surface-variant">평균 기온</span>
                  <span className="font-semibold text-on-surface">{effectiveWeather.avg_temp_c}°C</span>
                </div>
                <p className="text-xs text-on-surface-variant text-right">
                  최저 {effectiveWeather.min_temp_c}° / 최고 {effectiveWeather.max_temp_c}°
                </p>
                <p className="bg-green-50 text-green-800 rounded-lg px-2.5 py-1.5 text-xs">
                  👗 {effectiveWeather.clothing_tip}
                </p>
              </div>
            ) : (
              <StatRow label="평균 기온" value={day.stats.temp} />
            )}
            <StatRow
              label="소비 예산"
              value={day.stats.budgetSpent}
              valueClassName="text-primary"
            />
            {actualSpent != null && actualSpent > 0 && (
              <StatRow
                label="실소비"
                value={`₩${actualSpent.toLocaleString()}`}
                valueClassName="text-green-600"
              />
            )}
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