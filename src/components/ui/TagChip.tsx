interface TagChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TagChip({ label, selected = false, onClick, className = '' }: TagChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors hover:bg-primary-container ${
        selected
          ? 'bg-secondary-container text-on-secondary-container'
          : 'bg-surface-container-low text-on-surface-variant'
      } ${className}`}
    >
      {label}
    </button>
  );
}
