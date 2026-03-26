import { useRef } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
}

const defaultFormat = (v: number) => `$${v >= 1000 ? `${v / 1000}k` : v}`;

export default function RangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  formatLabel = defaultFormat,
}: RangeSliderProps) {
  const [minVal, maxVal] = value;
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.min(Number(e.target.value), maxVal - step);
    onChange([next, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.max(Number(e.target.value), minVal + step);
    onChange([minVal, next]);
  };

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <span className="text-xs font-bold text-primary bg-primary-container px-2 py-0.5 rounded-full">
          {formatLabel(minVal)} — {formatLabel(maxVal)}
        </span>
      </div>

      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute w-full h-1.5 bg-surface-container-high rounded-lg" />
        {/* Active range track */}
        <div
          className="absolute h-1.5 bg-primary rounded-lg"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />

        {/* Min thumb */}
        <input
          ref={minRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer accent-primary"
          style={{ zIndex: minVal > max - step ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          ref={maxRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer accent-primary"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex justify-between">
        <span className="text-[10px] text-outline-variant uppercase tracking-tighter">{formatLabel(min)}</span>
        <span className="text-[10px] text-outline-variant uppercase tracking-tighter">{formatLabel(max)}</span>
      </div>
    </div>
  );
}
