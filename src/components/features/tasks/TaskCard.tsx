import type { Task } from '@/types/index';
import { Badge, Card } from '@/components/ui';

interface TaskCardProps {
  task: Task;
  featured?: boolean;
  onToggleDone?: () => void;
}

const getStatusBadgeStatus = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return 'todo';
    case 'in-progress':
      return 'in-progress';
    case 'done':
      return 'done';
  }
};

const getIconColor = (status: Task['status'], featured?: boolean) => {
  if (status === 'done') return 'text-primary';
  return featured ? 'text-primary-fixed-dim' : 'text-secondary';
};

export default function TaskCard({ task, featured = false, onToggleDone }: TaskCardProps) {
  const isDone = task.status === 'done';
  const cardClass = featured ? 'lg:col-span-2' : '';
  const badgeStatus = getStatusBadgeStatus(task.status);

  return (
    <div className={cardClass}>
      <Card padding="md" hover={featured ? true : false}>
        {/* Abstract circle background */}
        <div
          className="absolute -right-12 -top-12 w-48 h-48 signature-gradient opacity-5 rounded-full blur-3xl
            group-hover:opacity-10 transition-opacity duration-300"
        />

        {/* Top row: Status badge + Toggle button */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <Badge status={badgeStatus as any} />
          <button
            type="button"
            onClick={onToggleDone}
            title={isDone ? '완료 취소' : '완료로 표시'}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: onToggleDone ? 'pointer' : 'default',
              lineHeight: 1,
            }}
          >
            <span
              className={`material-symbols-outlined text-2xl ${getIconColor(task.status, featured)}`}
              style={isDone ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {isDone ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          </button>
        </div>

        {/* Title */}
        <h3
          className={`font-headline font-bold ${featured ? 'text-2xl' : 'text-xl'} text-on-surface mb-3 relative z-10 ${
            isDone ? 'line-through opacity-60' : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        <p
          className={`text-on-surface-variant ${
            featured
              ? 'leading-relaxed mb-6 max-w-md'
              : 'text-sm mb-4 leading-relaxed'
          } relative z-10`}
        >
          {task.description}
        </p>

        {/* done_at 완료 날짜 */}
        {isDone && task.done_at && (
          <p className="text-xs mb-4 relative z-10" style={{ color: '#22c55e' }}>
            ✓ {new Date(task.done_at).toLocaleDateString('ko-KR')} 완료
          </p>
        )}

        {/* Bottom content */}
        <div className="flex items-center justify-between relative z-10">
          {/* Avatar stack (featured only) */}
          {featured && task.assignees && task.assignees.length > 0 && (
            <div className="flex">
              {task.assignees.slice(0, 3).map((assignee: string, idx: number) => (
                <img
                  key={idx}
                  src={assignee}
                  alt="assignee"
                  className={`w-8 h-8 rounded-full border-2 border-white ${idx > 0 ? '-ml-2' : ''}`}
                />
              ))}
            </div>
          )}

          {/* CTA Button */}
          {task.ctaUrl && !isDone ? (
            <a
              href={task.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 14px',
                background: task.ctaColor ?? '#1a73e8',
                color: '#fff',
                borderRadius: '7px',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {task.isReview && (
                <span style={{ fontSize: '10px' }}>
                  {task.ctaLabel.includes('네이버') ? '🔍' : '▶'}
                </span>
              )}
              {task.ctaLabel}
            </a>
          ) : isDone ? (
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>완료됨</span>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
