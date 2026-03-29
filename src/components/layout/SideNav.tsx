import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  action?: 'chat';
}

interface SideNavProps {
  width?: number;
  onOpenChat?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'checklist', label: '작업', href: '/tasks' },
  { icon: 'route', label: '일정', href: '/itinerary' },
  { icon: 'edit_note', label: 'Plan', href: '/plan' },
  { icon: 'smart_toy', label: 'Chat', href: '#', action: 'chat' },
  { icon: 'map', label: '지도', href: '#' },
  { icon: 'explore', label: '탐색', href: '#' },
];

export default function SideNav({ width, onOpenChat }: SideNavProps) {
  const location = useLocation();
  const { user } = useAuth();
  const userInitial = user?.username?.charAt(0).toUpperCase() ?? '?';

  const isActive = (href: string) => {
    if (href === '#' || href === '') return false;
    return location.pathname.startsWith(href);
  };

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${active
      ? 'bg-surface-container-lowest shadow-ambient text-primary-dark'
      : 'text-on-surface-variant hover:bg-white/50'
    }`;

  const iconClass = (active: boolean) =>
    `material-symbols-outlined text-lg flex-shrink-0 ${active ? 'text-primary-dark' : 'text-outline-variant'}`;

  return (
    <aside
      className="sticky top-0 h-screen bg-sidebar-bg flex flex-col py-8 px-6 flex-shrink-0 border-r border-slate-100 z-30 font-body"
      style={{ width: width ?? 288 }}
    >
      {/* Top Section - Logo */}
      <div className="flex flex-col px-2 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-logo-gradient" />
          <h1 className="font-headline font-bold text-on-surface text-xl tracking-tight">CABEAN</h1>
        </div>
        <p className="text-outline-variant text-[10px] uppercase tracking-[1.2px] font-medium mt-1 ml-1">
          Pacific Coast Hwy
        </p>
      </div>

      {/* Middle Section - Navigation (님의 기존 로직 그대로 유지) */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);

          if (item.action === 'chat') {
            return (
              <button key="chat" onClick={onOpenChat} className={navItemClass(false)}>
                <span className={iconClass(false)}>{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          }

          return (
            <Link key={item.label} to={item.href} className={navItemClass(active)}>
              <span className={iconClass(active)}>{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-4 pt-4 border-t border-surface-container">
        {/* Captain Bean AI Card */}
        <button
          type="button"
          onClick={onOpenChat}
          className="w-full bg-surface-container-low rounded-xl p-3 flex items-center gap-3 hover:bg-surface-container transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary-fixed text-lg">smart_toy</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-headline font-bold text-sm text-on-surface leading-tight">Captain Bean AI</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider truncate">
              AI Travel Concierge
            </p>
          </div>
        </button>

        {/* Plan New Leg Button */}
        <button className="w-full bg-primary text-white rounded-full py-4 flex items-center justify-center gap-2 shadow-header hover:opacity-90 transition-all active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-on-primary text-lg">add</span>
          <span className="font-body font-semibold text-on-primary">새로운 일정</span>
        </button>

        {/* User Profile Strip */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
            <span className="font-headline font-bold text-on-primary-container text-sm">{userInitial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body font-bold text-on-surface text-sm leading-tight">{user?.username ?? '—'}</p>
            <p className="text-outline-variant text-[11px] truncate">{user?.email ?? ''}</p>
          </div>
          <button className="text-outline-variant hover:text-on-surface transition-colors p-1">
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </button>
        </div>
      </div>
    </aside>
  );
}