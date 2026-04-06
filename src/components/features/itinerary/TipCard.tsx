import { useState } from 'react';
import type { ItineraryStop } from '@/types/index';

const TIP_CONFIG: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  ESIM:           { icon: '📶', label: 'eSIM',      color: '#6366f1', bg: '#eef2ff' },
  TRANSPORT_CARD: { icon: '🚇', label: '교통카드',   color: '#0ea5e9', bg: '#e0f2fe' },
  BIKE:           { icon: '🚲', label: '자전거',     color: '#22c55e', bg: '#dcfce7' },
  APP:            { icon: '📱', label: '필수앱',     color: '#f97316', bg: '#fff7ed' },
  SOUVENIR:       { icon: '🎁', label: '기념품',     color: '#ec4899', bg: '#fdf2f8' },
  FOOD_LOCAL:     { icon: '🍜', label: '로컬맛집',   color: '#ef4444', bg: '#fef2f2' },
  CURRENCY:       { icon: '💴', label: '환전',       color: '#eab308', bg: '#fefce8' },
  SAFETY:         { icon: '🛡️', label: '안전정보',  color: '#64748b', bg: '#f1f5f9' },
  WEATHER_TIP:    { icon: '🌤️', label: '날씨',      color: '#0891b2', bg: '#ecfeff' },
  GENERAL:        { icon: '💡', label: '여행팁',     color: '#8b5cf6', bg: '#f5f3ff' },
};

interface TipCardProps {
  stop: ItineraryStop;
}

export default function TipCard({ stop }: TipCardProps) {
  const [expanded, setExpanded] = useState(false);
  const tipType = stop.tip_type || 'GENERAL';
  const cfg = TIP_CONFIG[tipType] ?? TIP_CONFIG.GENERAL;
  const meta = (stop.tip_metadata || {}) as Record<string, unknown>;

  return (
    <div className="relative pl-16">
      {/* 카테고리 아이콘 자리 */}
      <div className="absolute left-0 top-0 z-10 w-10 h-10 flex items-center justify-center text-xl">
        {cfg.icon}
      </div>

      <article style={{
        padding: '14px 16px',
        background: cfg.bg,
        border: `1px solid ${cfg.color}30`,
        borderLeft: `4px solid ${cfg.color}`,
        borderRadius: '10px',
      }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '2px 8px',
            background: cfg.color,
            color: '#fff',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
            flexShrink: 0,
          }}>
            {cfg.label}
          </span>
          <h3 style={{
            flex: 1, margin: 0,
            fontSize: '14px', fontWeight: 600, color: '#111',
          }}>
            {stop.title}
          </h3>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '12px',
              color: cfg.color, fontWeight: 500,
              flexShrink: 0,
            }}
          >
            {expanded ? '접기 ▲' : '자세히 ▼'}
          </button>
        </div>

        {/* subtitle */}
        {stop.subtitle && (
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6b7280' }}>
            {stop.subtitle}
          </p>
        )}

        {/* 펼쳐진 상세 */}
        {expanded && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${cfg.color}20` }}>

            {stop.description && (
              <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                {stop.description}
              </p>
            )}

            {/* APP 메타데이터 */}
            {tipType === 'APP' && Array.isArray(meta.apps) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(meta.apps as Array<Record<string, unknown>>).map((app, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    background: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>
                        {String(app.name)}
                        {!!app.is_essential && (
                          <span style={{ marginLeft: '4px', fontSize: '10px', color: '#ef4444' }}>★필수</span>
                        )}
                      </span>
                      <span style={{ marginLeft: '8px', fontSize: '11px', color: '#9ca3af' }}>
                        {String(app.purpose)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {!!app.ios_url && (
                        <a href={String(app.ios_url)} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: '11px', color: cfg.color }}>iOS</a>
                      )}
                      {!!app.android_url && (
                        <a href={String(app.android_url)} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: '11px', color: cfg.color, marginLeft: '4px' }}>Android</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SOUVENIR 메타데이터 */}
            {tipType === 'SOUVENIR' && Array.isArray(meta.items) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(meta.items as Array<Record<string, unknown>>).map((item, i) => (
                  <div key={i} style={{
                    padding: '8px 10px', background: '#fff',
                    borderRadius: '8px', border: '1px solid #e5e7eb',
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{String(item.name)}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      💰 {String(item.price_range)} · 🏪 {String(item.where_to_buy)}
                    </div>
                    {!!item.description && (
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                        {String(item.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* FOOD_LOCAL 메타데이터 */}
            {tipType === 'FOOD_LOCAL' && Array.isArray(meta.dishes) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(meta.dishes as Array<Record<string, unknown>>).map((dish, i) => (
                  <div key={i} style={{
                    padding: '8px 10px', background: '#fff',
                    borderRadius: '8px', border: '1px solid #e5e7eb',
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{String(dish.name)}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      💰 {String(dish.price_range)}
                    </div>
                    {!!dish.avoid_tourist_trap && (
                      <div style={{ fontSize: '11px', color: '#f97316', marginTop: '4px' }}>
                        ⚠️ {String(dish.avoid_tourist_trap)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ESIM / TRANSPORT_CARD 단순 정보 */}
            {(tipType === 'ESIM' || tipType === 'TRANSPORT_CARD') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {!!meta.price_range && (
                  <span style={{ fontSize: '13px', color: '#374151' }}>
                    💰 예상 비용: {String(meta.price_range)}
                  </span>
                )}
                {!!meta.where_to_get && (
                  <span style={{ fontSize: '13px', color: '#374151' }}>
                    📍 구매처: {String(meta.where_to_get)}
                  </span>
                )}
                {Array.isArray(meta.providers) && (
                  <span style={{ fontSize: '13px', color: '#374151' }}>
                    🌐 제공사: {(meta.providers as string[]).join(', ')}
                  </span>
                )}
              </div>
            )}

            {/* 외부 링크 */}
            {stop.externalLink && (
              <div style={{ marginTop: '10px' }}>
                <a
                  href={stop.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 14px',
                    background: cfg.color,
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  바로가기 →
                </a>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
