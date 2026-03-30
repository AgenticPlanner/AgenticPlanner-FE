import type { ItineraryStop } from '@/types/index';
import { Badge, Chip, Card } from '@/components/ui';
import { CategoryIcon } from '@/components/common';

interface StopCardProps {
  stop: ItineraryStop;
}

const getCategoryLabel = (category: ItineraryStop['category']) => {
  switch (category) {
    case 'dining':    return '식사';
    case 'transit':   return '이동';
    case 'transport': return '이동';
    case 'sightseeing': return '관광';
    case 'stay':      return '숙박';
    default: return '장소';
  }
};

const formatTime = (start: string, end?: string) => {
  if (!start) return '';
  return end ? `${start} → ${end}` : start;
};

// 금액 포맷: "320000.00" → "₩320,000"
const formatAmount = (amount: string) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return `₩${Math.round(num).toLocaleString()}`;
};

export default function StopCard({ stop }: StopCardProps) {
  const timeLabel = formatTime(stop.time, stop.endTime);
  const badgeLabel = stop.status === 'CONFIRMED' ? 'Confirmed' : stop.badge;

  // Transit category - special dashed style
  if (stop.category === 'transit' || stop.category === 'transport') {
    return (
      <div className="relative pl-16 group">
        <div className="absolute left-0 top-0 z-10">
          <CategoryIcon category={stop.category} />
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border-dashed border-2 border-outline-variant/30 flex items-center space-x-4">
          <div className="flex-1">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter block mb-1">
              {timeLabel && `${timeLabel} — `}{getCategoryLabel(stop.category)}
            </span>
            <h4 className="font-headline font-bold text-xl text-on-surface">{stop.title}</h4>
            {stop.subtitle && (
              <p className="text-on-surface-variant text-sm mt-1">{stop.subtitle}</p>
            )}
          </div>
          <span className="material-symbols-outlined text-slate-300 flex-shrink-0">
            trending_flat
          </span>
        </div>
      </div>
    );
  }

  // Sightseeing with image - split card layout
  if (stop.category === 'sightseeing' && stop.imageUrl) {
    return (
      <div className="relative pl-16 group">
        <div className="absolute left-0 top-0 z-10">
          <CategoryIcon category={stop.category} />
        </div>
        <Card hover={true}>
          <div className="flex flex-col md:flex-row">
            {/* Image section */}
            <img
              src={stop.imageUrl}
              alt={stop.title}
              className="h-80 md:h-auto w-full md:w-1/3 object-cover"
            />

            {/* Content section */}
            <div className="p-8 md:w-2/3">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter block mb-3">
                {timeLabel && `${timeLabel} — `}{getCategoryLabel(stop.category)}
              </span>

              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline font-bold text-2xl text-on-surface flex-1">
                  {stop.title}
                </h3>
                {badgeLabel && (
                  <Badge status="booked" label={badgeLabel} className="flex-shrink-0 ml-4" />
                )}
              </div>

              {stop.description && (
                <p className="text-on-surface-variant leading-relaxed text-sm mb-6">
                  {stop.description}
                </p>
              )}

              {stop.location && (
                <div className="flex items-center space-x-2 text-primary text-xs font-semibold mb-6">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{stop.location}</span>
                </div>
              )}

              {/* Amount */}
              {stop.amount && (
                <p className="text-xs font-bold text-primary mb-4">
                  {formatAmount(stop.amount)}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex space-x-3 flex-wrap gap-2">
                <button type="button" className="bg-surface-container-high px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-sm">confirmation_number</span>
                  <span>예매 보기</span>
                </button>
                {stop.externalLink && (
                  <a
                    href={stop.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs font-bold underline underline-offset-4 hover:text-primary-fixed transition-colors"
                  >
                    예약하기
                  </a>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Standard card for all other categories (dining, stay, etc.)
  return (
    <div className="relative pl-16 group">
      <div className="absolute left-0 top-0 z-10">
        <CategoryIcon category={stop.category} />
      </div>
      <Card hover={true}>
        <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter block mb-3">
          {timeLabel && `${timeLabel} — `}{getCategoryLabel(stop.category)}
        </span>

        <div className="flex justify-between items-start mb-4">
          <h3 className="font-headline font-bold text-2xl text-on-surface flex-1">
            {stop.title}
          </h3>
          {badgeLabel && (
            <Badge status="booked" label={badgeLabel} className="flex-shrink-0 ml-4" />
          )}
        </div>

        {stop.subtitle && (
          <p className="text-on-surface-variant text-sm mb-3">{stop.subtitle}</p>
        )}

        {stop.description && (
          <p className="text-on-surface-variant leading-relaxed text-sm mb-6">
            {stop.description}
          </p>
        )}

        {stop.location && (
          <div className="flex items-center space-x-2 text-primary text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>{stop.location}</span>
          </div>
        )}

        {/* Amount */}
        {stop.amount && (
          <p className="text-xs font-bold text-primary mb-4">
            {formatAmount(stop.amount)}
          </p>
        )}

        {/* Tags */}
        {stop.tags && stop.tags.length > 0 && (
          <div className="flex space-x-2 flex-wrap gap-2 mb-4">
            {stop.tags.map((tag: string) => (
              <Chip key={tag} label={tag} />
            ))}
          </div>
        )}

        {/* External link */}
        {stop.externalLink && (
          <a
            href={stop.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xs font-bold underline underline-offset-4 hover:text-primary-fixed transition-colors"
          >
            예약하기
          </a>
        )}
      </Card>
    </div>
  );
}
