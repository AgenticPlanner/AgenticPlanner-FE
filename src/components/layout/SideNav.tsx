import { Link, useLocation } from 'react-router-dom';

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
  { icon: 'checklist', label: '작업',  href: '/tasks'     },
  { icon: 'route',     label: '일정',  href: '/itinerary' },
  { icon: 'edit_note', label: 'Plan',  href: '/plan'      },
  { icon: 'smart_toy', label: 'Chat',  href: '#', action: 'chat' },
  { icon: 'map',       label: '지도',  href: '#'          },
  { icon: 'explore',   label: '탐색',  href: '#'          },
];

export default function SideNav({ width, onOpenChat }: SideNavProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '#') return false;
    return location.pathname.startsWith(href);
  };

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${
      active
        ? 'bg-surface-container-lowest shadow-ambient text-primary'
        : 'text-outline-variant hover:bg-surface-container-low hover:translate-x-1'
    }`;

  const iconClass = (active: boolean) =>
    `material-symbols-outlined text-lg flex-shrink-0 ${active ? 'text-primary' : 'text-outline-variant'}`;

  return (
    <aside
      className="sticky top-0 h-screen bg-surface-container-lowest hidden md:flex flex-col py-6 px-4 flex-shrink-0"
      style={{ width: width ?? 288 }}
    >
      {/* Top Section - Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg signature-gradient flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-white text-lg">explore</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-headline font-bold text-primary text-sm leading-tight">Trip Planner</h1>
          <p className="text-outline-variant text-[10px] uppercase tracking-widest">Pacific Coast Hwy</p>
        </div>
      </div>

      {/* Middle Section - Navigation */}
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);

          if (item.action === 'chat') {
            return (
              <button
                key="chat"
                type="button"
                onClick={onOpenChat}
                className={navItemClass(false)}
              >
                <span className={iconClass(false)}>{item.icon}</span>
                <span className="font-body font-medium text-sm">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href + item.label}
              to={item.href}
              className={navItemClass(active)}
            >
              <span className={iconClass(active)}>{item.icon}</span>
              <span className="font-body font-medium text-sm">{item.label}</span>
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
        <button className="w-full signature-gradient rounded-full py-3 flex items-center justify-center gap-2 hover:shadow-float transition-shadow duration-300">
          <span className="material-symbols-outlined text-on-primary text-lg">add</span>
          <span className="font-body font-semibold text-on-primary">새로운 일정</span>
        </button>

        {/* User Profile Strip */}
        <div className="flex items-center gap-3 px-2">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
            alt="Alex Rivera"
            className="w-10 h-10 rounded-full ring-2 ring-white flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-body font-bold text-on-surface text-sm leading-tight">Alex Rivera</p>
            <p className="text-outline-variant text-[11px] truncate">프리미엄 멤버</p>
          </div>
          <button className="text-outline-variant hover:text-on-surface transition-colors p-1">
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
