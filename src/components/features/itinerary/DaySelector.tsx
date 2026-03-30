import type { TripDay } from '@/types/index';

interface DaySelectorProps {
  days: TripDay[];
  activeDayIndex: number;
  onSelect: (index: number) => void;
}

export default function DaySelector({ days, activeDayIndex, onSelect }: DaySelectorProps) {
  return (
    <div className="flex items-center space-x-4 overflow-x-auto pb-4 no-scrollbar">
      {days.map((day, index) => (
        <button
          key={day.label}
          onClick={() => onSelect(index)}
          className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
            activeDayIndex === index
              ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20'
              : 'bg-surface-container-high text-on-secondary-container font-medium hover:bg-surface-container-highest'
          }`}
        >
          Day {index + 1}
        </button>
      ))}
    </div>
  );
}
