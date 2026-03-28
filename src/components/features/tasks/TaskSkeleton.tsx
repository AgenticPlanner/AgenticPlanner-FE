export default function TaskSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-surface-container-lowest rounded-xl p-8 space-y-4">
          <div className="flex justify-between">
            <div className="h-5 w-20 bg-surface-container-high rounded-full animate-pulse" />
            <div className="h-6 w-6 bg-surface-container-high rounded animate-pulse" />
          </div>
          <div className="h-6 w-40 bg-surface-container-high rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-surface-container-high rounded animate-pulse" />
          </div>
          <div className="h-9 w-full bg-surface-container-high rounded-full animate-pulse mt-4" />
        </div>
      ))}
    </div>
  );
}
