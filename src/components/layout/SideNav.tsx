import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

interface SideNavProps {
  width?: number;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'chat', label: '채팅', href: '/chat' },
  { icon: 'checklist', label: '작업', href: '/tasks' },
  { icon: 'route', label: '일정', href: '/itinerary' },
  { icon: 'edit_note', label: 'Plan', href: '/plan' },
  { icon: 'map', label: '지도', href: '/map' },
  { icon: 'explore', label: '탐색', href: '#' },
];

export default function SideNav({ width }: SideNavProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '#' || href === '') return false;
    return location.pathname.startsWith(href);
  };

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${active
      ? 'bg-surface-container-lowest shadow-nav-active text-primary-dark'
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
          <h1 className="font-label font-bold text-primary-dark text-xl tracking-tight">CABEAN</h1>
        </div>
        <p className="text-outline-variant text-[10px] uppercase tracking-[1.2px] font-medium mt-1 ml-1">
          Pacific Coast Hwy
        </p>
      </div>

      {/* Middle Section - Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.label} to={item.href} className={navItemClass(active)}>
              <span className={iconClass(active)}>{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-surface-container">
        <Link
          to="/plan"
          className="w-full bg-primary text-white rounded-full py-4 flex items-center justify-center gap-2 shadow-plan-btn hover:opacity-90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-on-primary text-lg">add</span>
          <span className="font-body font-semibold text-on-primary">새로운 일정</span>
        </Link>
      </div>
    </aside>
  );
}
