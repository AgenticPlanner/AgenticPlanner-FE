import { useState } from 'react';
import type { APIPlanItem } from '@/types/api';
import { SECTION_CONFIG } from './taskConfig';
import TaskItem from './TaskItem';
import TipsSection from './TipsSection';

interface Props {
  section: 'BOOKING' | 'REVIEW' | 'TIPS';
  items: APIPlanItem[];
  onToggle: (item: APIPlanItem) => void;
}

export default function TaskSection({ section, items, onToggle }: Props) {
  const [expanded, setExpanded] = useState(true);
  const config = SECTION_CONFIG[section];

  return (
    <div style={{
      marginBottom: '16px',
      border: `1px solid ${config.border}`,
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', padding: '14px 16px', background: config.bg,
          border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: '8px', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '18px' }}>{config.icon}</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: '15px', color: config.color }}>
            {config.label}
          </span>
          <span style={{ marginLeft: '8px', fontSize: '12px', color: '#9ca3af' }}>
            {items.length}개
          </span>
        </div>
        <span style={{ fontSize: '12px', color: config.color, fontWeight: 500 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div style={{ background: '#fff' }}>
          {section === 'TIPS'
            ? <TipsSection items={items} />
            : items.map(item => (
                <TaskItem key={item.id} item={item} section={section} onToggle={onToggle} />
              ))
          }
        </div>
      )}
    </div>
  );
}
