import { useLocation } from 'react-router-dom';
import { PlanSelector } from '@/components/common';

interface TopBarProps {
  title?: string;
}

const PLAN_ROUTES = ['/itinerary', '/tasks'];

export default function TopBar({ title = 'Agentic Planner' }: TopBarProps) {
  const { pathname } = useLocation();
  const showPlanSelector = PLAN_ROUTES.some(r => pathname.startsWith(r));

  return (
    <header className="sticky top-0 h-20 bg-surface-container-lowest/80 backdrop-blur-xl z-40 flex items-center px-8 gap-8 border-b border-surface-container">
      {/* Left Section */}
      <div className="flex-1 flex items-center gap-8">
        <h1 className="font-headline font-extrabold text-2xl text-primary tracking-tight whitespace-nowrap">
          {title}
        </h1>

        {/* Search Bar - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex items-center gap-3 bg-surface-container-low rounded-full px-4 py-2 max-w-96 flex-1">
          <span className="material-symbols-outlined text-outline-variant text-lg flex-shrink-0">search</span>
          <input
            type="text"
            placeholder="작업이나 여행 세부사항 검색..."
            className="flex-1 bg-transparent border-none outline-none font-body text-on-surface placeholder:text-outline-variant text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Plan Selector — itinerary, tasks 페이지에서만 노출 */}
        {showPlanSelector && <PlanSelector />}

        {/* Notifications Button */}
        <button type="button" className="p-2 hover:bg-surface-container-low rounded-full transition-colors duration-200">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">notifications</span>
        </button>

        {/* Settings Button */}
        <button type="button" className="p-2 hover:bg-surface-container-low rounded-full transition-colors duration-200">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">settings</span>
        </button>
      </div>
    </header>
  );
}
