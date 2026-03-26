export interface MobileNavItem {
  label: string;
  icon: string;
  value: string;
}

interface MobileBottomNavProps {
  items: MobileNavItem[];
  activeValue: string;
  onSelect: (value: string) => void;
}

export default function MobileBottomNav({ items, activeValue, onSelect }: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 w-full md:hidden z-50 bg-background/80 backdrop-blur-lg rounded-t-2xl shadow-bottom-nav">
      <div className="flex justify-around items-center px-4 pt-2 pb-safe">
        {items.map((item) => {
          const active = item.value === activeValue;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelect(item.value)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                active ? 'bg-primary-container/30 text-primary' : 'text-on-surface opacity-50'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="font-label text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
