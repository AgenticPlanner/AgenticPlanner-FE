import type { Task } from '../../types/index';

interface TaskCardProps {
  task: Task;
  featured?: boolean;
}

const getStatusBadgeStyles = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return 'bg-surface-container-high text-outline';
    case 'in-progress':
      return 'bg-secondary-container text-on-secondary-container';
    case 'done':
      return 'bg-primary-container text-on-primary-container';
  }
};

const getStatusLabel = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in-progress':
      return 'In Progress';
    case 'done':
      return 'Done';
  }
};

const getIconColor = (status: Task['status'], featured?: boolean) => {
  if (status === 'done') return 'text-primary';
  return featured ? 'text-primary-fixed-dim' : 'text-secondary';
};

export default function TaskCard({ task, featured = false }: TaskCardProps) {
  const isDone = task.status === 'done';
  const cardClass = featured ? 'lg:col-span-2' : '';

  return (
    <div className={cardClass}>
      <div
        className={`group relative bg-surface-container-lowest rounded-xl p-8
          ${featured ? 'hover:bg-surface-container-low' : ''}
          transition-colors overflow-hidden ${isDone ? 'opacity-80' : ''}`}
      >
        {/* Abstract circle background */}
        <div
          className="absolute -right-12 -top-12 w-48 h-48 signature-gradient opacity-5 rounded-full blur-3xl
            group-hover:opacity-10 transition-opacity duration-300"
        />

        {/* Top row: Status badge + Icon */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${getStatusBadgeStyles(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
          <span
            className={`material-symbols-outlined text-2xl ${getIconColor(task.status, featured)}`}
            style={isDone ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            {isDone ? 'check_circle' : task.icon}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-headline font-bold ${featured ? 'text-2xl' : 'text-xl'} text-on-surface mb-3 relative z-10 ${isDone ? 'line-through opacity-60' : ''}`}>
          {task.title}
        </h3>

        {/* Description */}
        <p className={`text-on-surface-variant ${featured ? 'leading-relaxed mb-6 max-w-md' : 'text-sm mb-8 leading-relaxed'} relative z-10`}>
          {task.description}
        </p>

        {/* Bottom content */}
        <div className="flex items-center justify-between relative z-10">
          {/* Avatar stack (featured only) */}
          {featured && task.assignees && task.assignees.length > 0 && (
            <div className="flex">
              {task.assignees.slice(0, 3).map((assignee, idx) => (
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
          {featured ? (
            <button className="bg-primary text-on-primary rounded-full px-6 py-2.5 font-semibold text-sm hover:shadow-ambient transition-shadow duration-300">
              {task.ctaLabel}
            </button>
          ) : (
            <button
              className={`w-full ${
                isDone
                  ? 'border border-outline-variant text-outline rounded-full py-2.5 cursor-not-allowed'
                  : 'bg-surface-container-high text-on-secondary-container rounded-full py-2.5 hover:bg-surface-container transition-colors'
              } font-semibold text-sm`}
              disabled={isDone}
            >
              {task.ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
