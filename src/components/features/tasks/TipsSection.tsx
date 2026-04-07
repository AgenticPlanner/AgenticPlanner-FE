import { useState } from 'react';
import type { APIPlanItem } from '@/types/api';

const TIP_TYPE_CFG: Record<string, { icon: string; color: string; bg: string }> = {
  ESIM:           { icon: '📶', color: '#6366f1', bg: '#eef2ff' },
  TRANSPORT_CARD: { icon: '🚇', color: '#0ea5e9', bg: '#e0f2fe' },
  BIKE:           { icon: '🚲', color: '#22c55e', bg: '#dcfce7' },
  APP:            { icon: '📱', color: '#f97316', bg: '#fff7ed' },
  SOUVENIR:       { icon: '🎁', color: '#ec4899', bg: '#fdf2f8' },
  FOOD_LOCAL:     { icon: '🍜', color: '#ef4444', bg: '#fef2f2' },
  CURRENCY:       { icon: '💴', color: '#eab308', bg: '#fefce8' },
  SAFETY:         { icon: '🛡️', color: '#64748b', bg: '#f1f5f9' },
  WEATHER_TIP:    { icon: '🌤️', color: '#0891b2', bg: '#ecfeff' },
  GENERAL:        { icon: '💡', color: '#8b5cf6', bg: '#f5f3ff' },
};

const PREVIEW_LEN = 80;

function TipCard({ item }: { item: APIPlanItem }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TIP_TYPE_CFG[item.tip_type ?? 'GENERAL'] ?? TIP_TYPE_CFG.GENERAL;
  const summary = item.tip_summary ?? item.description ?? '';
  const needsExpand = summary.length > PREVIEW_LEN;

  return (
    <div style={{
      padding: '12px 14px', background: cfg.bg,
      border: `1px solid ${cfg.color}30`, borderLeft: `4px solid ${cfg.color}`,
      borderRadius: '10px', marginBottom: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>{cfg.icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '13px', color: '#111827' }}>
            {item.title}
          </p>

          {summary && (
            <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {expanded || !needsExpand ? summary : summary.slice(0, PREVIEW_LEN) + '...'}
            </p>
          )}

          {needsExpand && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                marginTop: '6px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: '12px', color: cfg.color,
                fontWeight: 600, padding: 0,
              }}
            >
              {expanded ? '접기 ▲' : '더 보기 ▼'}
            </button>
          )}

          {item.external_link && (
            <div style={{ marginTop: '8px' }}>
              <a
                href={item.external_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '4px 12px', background: cfg.color, color: '#fff',
                  borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none',
                }}
              >
                바로가기 →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TipsSection({ items }: { items: APIPlanItem[] }) {
  return (
    <div style={{ padding: '8px' }}>
      {items.map(item => <TipCard key={item.id} item={item} />)}
    </div>
  );
}
