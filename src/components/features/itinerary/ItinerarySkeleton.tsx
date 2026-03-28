export default function ItinerarySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="relative pl-16">
          <div className="absolute left-0 top-0 w-14 h-14 rounded-full bg-surface-container-high animate-pulse" />
          <div className="bg-surface-container-lowest rounded-xl p-8 space-y-3">
            <div className="h-3 w-24 bg-surface-container-high rounded animate-pulse" />
            <div className="h-6 w-48 bg-surface-container-high rounded animate-pulse" />
            <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
