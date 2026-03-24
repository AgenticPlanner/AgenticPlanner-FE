interface BadgeProps {
  status: 'todo' | 'in-progress' | 'done' | 'booked' | 'custom';
  label?: string;
  className?: string;
}

const getStatusStyles = (status: BadgeProps['status']) => {
  switch (status) {
    case 'todo':
      return {
        classes: 'bg-surface-container-high text-outline',
        defaultLabel: 'To Do',
      };
    case 'in-progress':
      return {
        classes: 'bg-secondary-container text-on-secondary-container',
        defaultLabel: 'In Progress',
      };
    case 'done':
      return {
        classes: 'bg-primary-container text-on-primary-container',
        defaultLabel: 'Done',
      };
    case 'booked':
      return {
        classes: 'bg-primary-container text-on-primary-container',
        defaultLabel: 'Booked',
      };
    case 'custom':
      return {
        classes: 'bg-surface-container-high text-outline',
        defaultLabel: 'Custom',
      };
  }
};

export default function Badge({ status, label, className = '' }: BadgeProps) {
  const styles = getStatusStyles(status);
  const displayLabel = label || styles.defaultLabel;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.classes} ${className}`}
    >
      {displayLabel}
    </span>
  );
}
