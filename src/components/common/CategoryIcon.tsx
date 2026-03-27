interface CategoryIconProps {
  category: 'dining' | 'transit' | 'sightseeing' | 'stay' | string;
  size?: 'sm' | 'md';
}

const getCategoryConfig = (category: CategoryIconProps['category']) => {
  switch (category) {
    case 'dining':
      return {
        bgColor: 'bg-secondary-container',
        textColor: 'text-on-secondary-container',
        icon: 'restaurant',
      };
    case 'transit':
      return {
        bgColor: 'bg-tertiary-container',
        textColor: 'text-on-tertiary-container',
        icon: 'directions_car',
      };
    case 'sightseeing':
      return {
        bgColor: 'bg-primary-container',
        textColor: 'text-on-primary-container',
        icon: 'visibility',
      };
    case 'stay':
      return {
        bgColor: 'bg-secondary-container',
        textColor: 'text-on-secondary-container',
        icon: 'bed',
      };
    default:
      return {
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-600',
        icon: 'location_on',
      };
  }
};

export default function CategoryIcon({
  category,
  size = 'md',
}: CategoryIconProps) {
  const config = getCategoryConfig(category);
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-sm z-10 ${config.bgColor}`}
    >
      <span
        className={`material-symbols-outlined text-2xl ${config.textColor}`}
      >
        {config.icon}
      </span>
    </div>
  );
}
