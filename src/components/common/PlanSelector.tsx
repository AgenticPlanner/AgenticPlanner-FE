import { useState, useEffect, useRef } from 'react';
import { usePlanContext } from '@/contexts/PlanContext';

interface PlanSelectorProps {
  className?: string;
}

export default function PlanSelector({ className = '' }: PlanSelectorProps) {
  const { plans, activePlan, activePlanId, setActivePlanId } = usePlanContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (plans.length === 0) return null;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => plans.length > 1 && setOpen(prev => !prev)}
        className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full text-sm font-semibold hover:bg-surface-container-high transition-colors"
      >
        <span className="material-symbols-outlined text-primary text-sm">map</span>
        <span className="text-on-surface max-w-[160px] truncate">
          {activePlan?.title ?? '플랜 없음'}
        </span>
        {plans.length > 1 && (
          <span
            className={`material-symbols-outlined text-outline text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            expand_more
          </span>
        )}
      </button>

      {open && plans.length > 1 && (
        <div className="absolute top-full mt-2 left-0 z-50 w-64 bg-surface-container-lowest rounded-xl shadow-float border border-surface-container-high overflow-hidden">
          {plans.map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                setActivePlanId(plan.id);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-surface-container-low transition-colors flex items-center justify-between ${
                plan.id === activePlanId
                  ? 'text-primary font-bold bg-primary/5'
                  : 'text-on-surface'
              }`}
            >
              <span className="truncate">{plan.title}</span>
              {plan.id === activePlanId && (
                <span className="material-symbols-outlined text-primary text-sm flex-shrink-0 ml-2">
                  check
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
