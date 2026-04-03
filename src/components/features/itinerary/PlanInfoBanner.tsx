import type { APIPlanWeather, APIPlanTransport } from '@/types/api';

interface PlanInfoBannerProps {
  weather?: APIPlanWeather;
  transport?: APIPlanTransport;
}

export default function PlanInfoBanner({ weather, transport }: PlanInfoBannerProps) {
  if (!weather && !transport) return null;

  return (
    <div className="grid gap-3 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>

      {weather?.avg_temp_c != null && (
        <div className="bg-white border border-surface-container-high rounded-xl p-4 shadow-ambient">
          <p className="text-xs text-on-surface-variant mb-1">🌡️ {weather.month} 평균 기온</p>
          <p className="text-3xl font-bold text-on-surface">{weather.avg_temp_c}°C</p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            최저 {weather.min_temp_c}° / 최고 {weather.max_temp_c}°
          </p>
          <p className="mt-2 bg-green-50 text-green-800 rounded-lg px-2.5 py-1.5 text-xs">
            👗 {weather.clothing_tip}
          </p>
        </div>
      )}

      {transport?.total_minutes != null && (
        <div className="bg-white border border-surface-container-high rounded-xl p-4 shadow-ambient">
          <p className="text-xs text-on-surface-variant mb-1">
            ✈️ {transport.origin} → {transport.destination}
          </p>
          <p className="text-3xl font-bold text-on-surface">
            {Math.floor(transport.total_minutes / 60)}h
            {transport.total_minutes % 60 > 0 ? ` ${transport.total_minutes % 60}m` : ''}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">{transport.duration_desc}</p>
          <p className="mt-2 bg-blue-50 text-blue-800 rounded-lg px-2.5 py-1.5 text-xs">
            🕐 예상 소요시간
          </p>
        </div>
      )}


    </div>
  );
}
