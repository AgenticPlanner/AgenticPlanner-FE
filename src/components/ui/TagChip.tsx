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
      className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
        selected
          ? 'bg-primary text-on-primary hover:opacity-90'
          : 'bg-surface-container-low text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'
      } ${className}`}
    >
      {label}
    </button>
  );
}
