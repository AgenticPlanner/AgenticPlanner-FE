import type { ItineraryStop } from '../../types/index';

interface StopCardProps {
  stop: ItineraryStop;
}

const getCategoryConfig = (category: ItineraryStop['category']) => {
  switch (category) {
    case 'dining':
      return { bgColor: 'bg-secondary-container', textColor: 'text-on-secondary-container', icon: 'restaurant', label: '식사' };
    case 'transit':
      return { bgColor: 'bg-tertiary-container', textColor: 'text-on-tertiary-container', icon: 'directions_car', label: '이동' };
    case 'sightseeing':
      return { bgColor: 'bg-primary-container', textColor: 'text-on-primary-container', icon: 'visibility', label: '관광' };
    case 'stay':
      return { bgColor: 'bg-secondary-container', textColor: 'text-on-secondary-container', icon: 'bed', label: '숙박' };
  }
};

export default function StopCard({ stop }: StopCardProps) {
  const config = getCategoryConfig(stop.category);

  // Transit category - special dashed style
  if (stop.category === 'transit') {
    return (
      <div className="relative pl-16 group">
        <div className={`absolute left-0 top-0 w-14 h-14 rounded-full ${config.bgColor} flex items-center justify-center z-10 shadow-sm`}>
          <span className={`material-symbols-outlined text-2xl ${config.textColor}`}>{config.icon}</span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border-dashed border-2 border-outline-variant/30 flex items-center space-x-4">
          <div className="flex-1">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter block mb-1">
              {stop.time} — {config.label}
            </span>
            <h4 className="font-headline font-bold text-xl text-on-surface">{stop.title}</h4>
            {stop.subtitle && <p className="text-on-surface-variant text-sm mt-1">{stop.subtitle}</p>}
          </div>
          <span className="material-symbols-outlined text-slate-300 flex-shrink-0">trending_flat</span>
        </div>
      </div>
    );
  }

  // Sightseeing with image - split card layout
  if (stop.category === 'sightseeing' && stop.imageUrl) {
    return (
      <div className="relative pl-16 group">
        <div className={`absolute left-0 top-0 w-14 h-14 rounded-full ${config.bgColor} flex items-center justify-center z-10 shadow-sm`}>
          <span className={`material-symbols-outlined text-2xl ${config.textColor}`}>{config.icon}</span>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-transparent hover:border-primary-container/30 transition-all overflow-hidden flex flex-col md:flex-row">
          {/* Image section */}
          <img src={stop.imageUrl} alt={stop.title} className="h-80 md:h-auto w-full md:w-1/3 object-cover" />

          {/* Content section */}
          <div className="p-8 md:w-2/3">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter block mb-3">{stop.time} — {config.label}</span>

            <div className="flex justify-between items-start mb-4">
              <h3 className="font-headline font-bold text-2xl text-on-surface flex-1">{stop.title}</h3>
              {stop.badge && (
                <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ml-4">
                  {stop.badge}
                </span>
              )}
            </div>

            {stop.description && (
              <p className="text-on-surface-variant leading-relaxed text-sm mb-6">{stop.description}</p>
            )}

            {stop.location && (
              <div className="flex items-center space-x-2 text-primary text-xs font-semibold mb-6">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span>{stop.location}</span>
              </div>
            )}

            {/* Action buttons for sightseeing */}
            <div className="flex space-x-3">
              <button className="bg-surface-container-high px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-sm">confirmation_number</span>
                <span>예매 보기</span>
              </button>
              <button className="text-primary text-xs font-bold underline decoration-primary-container underline-offset-4 hover:text-primary-fixed transition-colors">
                지도 상세보기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard card for all other categories
  return (
    <div className="relative pl-16 group">
      <div className={`absolute left-0 top-0 w-14 h-14 rounded-full ${config.bgColor} flex items-center justify-center z-10 shadow-sm`}>
        <span className={`material-symbols-outlined text-2xl ${config.textColor}`}>{config.icon}</span>
      </div>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-transparent hover:border-primary-container/30 transition-all p-8">
        <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter block mb-3">{stop.time} — {stop.category.toUpperCase()}</span>

        <div className="flex justify-between items-start mb-4">
          <h3 className="font-headline font-bold text-2xl text-on-surface flex-1">{stop.title}</h3>
          {stop.badge && (
            <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ml-4">
              {stop.badge}
            </span>
          )}
        </div>

        {stop.description && (
          <p className="text-on-surface-variant leading-relaxed text-sm mb-6">{stop.description}</p>
        )}

        {stop.location && (
          <div className="flex items-center space-x-2 text-primary text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>{stop.location}</span>
          </div>
        )}

        {/* Tags for stay category */}
        {stop.tags && stop.tags.length > 0 && (
          <div className="flex space-x-2 flex-wrap gap-2">
            {stop.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 rounded-md bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
