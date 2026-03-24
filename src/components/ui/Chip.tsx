interface ChipProps {
  label: string;
  className?: string;
}

export default function Chip({ label, className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase ${className}`}
    >
      {label}
    </span>
  );
}
