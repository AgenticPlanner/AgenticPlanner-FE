import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, User } from 'lucide-react';
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const showPlanSelector = PLAN_ROUTES.some(r => pathname.startsWith(r));
  const userInitial = user?.username?.charAt(0).toUpperCase() ?? '?';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    logout();
  };

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

          {/* User Avatar & Dropdown */}
          <div className="relative ml-2" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full border border-slate-200 bg-primary-container flex items-center justify-center shadow-sm flex-shrink-0 hover:ring-2 hover:ring-primary/20 transition-all overflow-hidden"
            >
              <span className="font-label font-bold text-on-primary-container text-xs">{userInitial}</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold text-primary-dark truncate">{user?.username}</p>
                </div>

                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}