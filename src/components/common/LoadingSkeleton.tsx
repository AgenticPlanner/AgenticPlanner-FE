interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export default function LoadingSkeleton({ lines = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-high animate-pulse rounded-lg"
          style={{ height: '1rem', width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
