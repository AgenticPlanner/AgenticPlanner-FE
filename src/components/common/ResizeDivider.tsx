import type React from 'react';

interface ResizeDividerProps {
  direction: 'horizontal' | 'vertical';
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  isDragging: boolean;
  className?: string;
}

export default function ResizeDivider({
  direction,
  onMouseDown,
  onTouchStart,
  isDragging,
  className = '',
}: ResizeDividerProps) {
  const isHorizontal = direction === 'horizontal';

  const sizeClasses = isHorizontal
    ? 'w-1.5 h-fit cursor-col-resize flex-shrink-0 flex-col'
    : 'h-1.5 w-full cursor-row-resize flex-shrink-0 flex-row';

  const bgClass = isDragging
    ? 'bg-primary'
    : 'bg-surface-container-high hover:bg-primary-fixed-dim';

  const dotColor = isDragging ? 'bg-primary-container' : 'bg-outline-variant';

  return (
    <div
      role="separator"
      aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
      className={`flex items-center justify-center gap-1 transition-colors duration-150 select-none ${sizeClasses} ${bgClass} ${className}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className={`w-1 h-1 rounded-full transition-colors duration-150 ${dotColor}`} />
      ))}
    </div>
  );
}
