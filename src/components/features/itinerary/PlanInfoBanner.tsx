import type { APIPlanWeather, APIPlanTransport } from '@/types/api';
import type { BudgetSummary } from '@/api/plans';

interface PlanInfoBannerProps {
  weather?: APIPlanWeather;
  transport?: APIPlanTransport;
  budgetSummary?: BudgetSummary | null;
}

export default function PlanInfoBanner({ weather, transport, budgetSummary }: PlanInfoBannerProps) {
  if (!weather && !transport && !budgetSummary) return null;

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

      {budgetSummary && (
        <div className="bg-white border border-surface-container-high rounded-xl p-4 shadow-ambient">
          <p className="text-xs text-on-surface-variant mb-1">💰 예산 현황</p>
          <p className="text-2xl font-bold text-on-surface">
            ₩{budgetSummary.total_actual.toLocaleString()}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            예상 ₩{budgetSummary.total_estimated.toLocaleString()}
          </p>
          <div className="mt-2 bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${Math.min(budgetSummary.completion_rate, 100)}%`,
                background: budgetSummary.completion_rate > 80 ? '#ef4444' : '#22c55e',
              }}
            />
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            완료 {budgetSummary.done_count} / {budgetSummary.total_count}개
            ({budgetSummary.completion_rate}%)
          </p>
        </div>
      )}
    </div>
  );
}
