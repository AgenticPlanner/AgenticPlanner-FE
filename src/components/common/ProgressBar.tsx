interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  showLabel = true,
  className = '',
}: ProgressBarProps) {
  return (
    <div className={className}>
      {showLabel && (
        <div className="text-right mb-2">
          <span className="font-headline font-bold text-on-surface">{value}%</span>
        </div>
      )}
      <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
        <div
          className="signature-gradient h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
