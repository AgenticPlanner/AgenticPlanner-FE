interface StatRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

export default function StatRow({ label, value, valueClassName = '' }: StatRowProps) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span className={`font-bold text-on-surface ${valueClassName}`}>{value}</span>
    </div>
  );
}
