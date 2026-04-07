import type { APIPlanItem } from '@/types/api';
import {
  CATEGORY_ICON, CATEGORY_LABEL,
  getBookingAction, getReviewActions, fmtAmount,
  type ActionBtn,
} from './taskConfig';

interface Props {
  item: APIPlanItem;
  section: 'BOOKING' | 'REVIEW';
  onToggle: (item: APIPlanItem) => void;
}

function ActionLinks({ btns }: { btns: ActionBtn[] }) {
  if (btns.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
      {btns.map(btn => (
        <a
          key={btn.url + btn.label}
          href={btn.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '5px 12px', background: btn.color, color: '#fff',
            borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            textDecoration: 'none', display: 'inline-flex',
            alignItems: 'center', gap: '3px', whiteSpace: 'nowrap',
          }}
        >
          {btn.label}
        </a>
      ))}
    </div>
  );
}

export default function TaskItem({ item, section, onToggle }: Props) {
  const isDone = !!item.is_done;

  const btns: ActionBtn[] =
    section === 'BOOKING'
      ? (() => {
          const main = getBookingAction(item);
          const result: ActionBtn[] = main ? [main] : [];
          if (item.ticket_url)
            result.push({ url: item.ticket_url, label: '🎟️ 입장권 보기', color: '#7c3aed' });
          if (item.naver_map_url && !item.transport_params && !main?.label.includes('길찾기'))
            result.push({ url: item.naver_map_url, label: '🗺️ 길찾기', color: '#03c75a' });
          return result;
        })()
      : getReviewActions(item);

  return (
    <div style={{
      padding: '14px 16px', borderBottom: '1px solid #f3f4f6',
      background: isDone ? '#fafafa' : '#fff', opacity: isDone ? 0.72 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>

        {section === 'BOOKING' && item.is_task && (
          <button
            onClick={() => onToggle(item)}
            style={{
              marginTop: '3px', width: '22px', height: '22px', borderRadius: '50%',
              border: `2px solid ${isDone ? '#22c55e' : '#d1d5db'}`,
              background: isDone ? '#22c55e' : '#fff',
              cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: '#fff',
            }}
          >
            {isDone ? '✓' : null}
          </button>
        )}

        <span style={{ fontSize: '20px', flexShrink: 0 }}>
          {CATEGORY_ICON[item.category] ?? '📌'}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {CATEGORY_LABEL[item.category] ?? item.category}
          </span>

          <p style={{
            margin: '2px 0 0', fontSize: '14px', fontWeight: 600,
            color: isDone ? '#9ca3af' : '#111827',
            textDecoration: isDone ? 'line-through' : 'none',
          }}>
            {item.title}
          </p>

          {item.subtitle && (
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>{item.subtitle}</p>
          )}

          {fmtAmount(item.amount) && (
            <p style={{ margin: '4px 0 0', fontSize: '12px', fontWeight: 700, color: '#3b82f6' }}>
              {fmtAmount(item.amount)}
            </p>
          )}

          {isDone && item.done_at && (
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#22c55e', fontWeight: 500 }}>
              ✓ {new Date(item.done_at).toLocaleDateString('ko-KR')} 완료
            </p>
          )}

          <ActionLinks btns={btns} />
        </div>
      </div>
    </div>
  );
}
