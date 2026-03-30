import { useLocation } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import { PlanSelector } from '@/components/common';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  title?: string;
}

const PLAN_ROUTES = ['/itinerary', '/tasks'];

const NAV_TABS = [
  { label: "Overview", href: "/itinerary" },
  { label: "Documents", href: "#" },
  { label: "Budget", href: "#" },
];

export default function TopBar({ title = 'Agentic Planner' }: TopBarProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const showPlanSelector = PLAN_ROUTES.some(r => pathname.startsWith(r));
  const userInitial = user?.username?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between bg-header-bg px-8 shadow-header border-b border-slate-100 backdrop-blur-md font-body">
      {/* Left Section */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <h1 className="font-body font-bold text-primary-dark text-xl tracking-tight whitespace-nowrap">
          {title}
        </h1>

        {/* Search Bar - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex items-center gap-3 bg-surface-container-low/50 rounded-full px-4 py-2 max-w-xs flex-1 border border-slate-100 min-w-0">
          <span className="material-symbols-outlined text-outline-variant text-lg">search</span>
          <input
            type="text"
            placeholder="작업이나 여행 세부사항 검색..."
            className="flex-1 bg-transparent border-none outline-none font-body text-on-surface placeholder:text-outline-variant text-sm"
          />
        </div>
      </div>

      {/* Center Nav */}
      <nav className="hidden xl:flex items-center gap-6 h-full mx-4">
        {NAV_TABS.map((tab) => {
          const active = pathname.startsWith(tab.href) && tab.href !== '#';
          return (
            <div
              key={tab.label}
              className={`relative flex items-center h-full px-1 border-b-2 transition-all duration-300 ${active ? "border-primary-dark" : "border-transparent"}`}
            >
              <button
                className={`text-sm tracking-[-0.35px] whitespace-nowrap transition-colors ${active ? "font-bold text-primary-dark" : "font-normal text-slate-500 hover:text-primary"}`}
              >
                {tab.label}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        {showPlanSelector && (
          <div className="mr-2">
            <PlanSelector />
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Notifications Button */}
          <button type="button" className="p-2.5 text-slate-500 hover:text-primary-dark hover:bg-surface-container-low rounded-full transition-all">
            <Bell size={18} strokeWidth={1.5} />
          </button>

          {/* Settings Button */}
          <button type="button" className="p-2.5 text-slate-500 hover:text-primary-dark hover:bg-surface-container-low rounded-full transition-all">
            <Settings size={18} strokeWidth={1.5} />
          </button>

          {/* User Avatar */}
          <div className="ml-2 w-8 h-8 rounded-full border border-slate-200 bg-primary-container flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="font-label font-bold text-on-primary-container text-xs">{userInitial}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
