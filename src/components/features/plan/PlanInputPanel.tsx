import type { PlanFormData } from '@/types';
import { FormField, RangeSlider, TagChip } from '@/components/ui';
import { BUDGET_STEP } from '@/data/tripData';

interface PlanInputPanelProps {
  formData: PlanFormData;
  onChange: (updated: Partial<PlanFormData>) => void;
  onSubmit: () => void;
}

const inputBase =
  'w-full bg-surface-container-low rounded-xl p-4 font-body text-sm text-on-surface placeholder:text-outline-variant outline-none focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all';

function formatBudget(v: number) {
  return v >= 1000 ? `$${v / 1000}k` : `$${v}`;
}

export default function PlanInputPanel({ formData, onChange, onSubmit }: PlanInputPanelProps) {
  const toggleInterest = (id: string) => {
    onChange({
      interests: formData.interests.map((tag) =>
        tag.id === id ? { ...tag, selected: !tag.selected } : tag
      ),
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 lg:p-12 space-y-10 border-r border-surface-container no-scrollbar">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-headline font-extrabold text-3xl text-primary">Define Your Escape</h2>
        <p className="font-body text-on-surface-variant max-w-sm text-sm leading-relaxed">
          Tell us where you dream of going. Our AI will craft a bespoke itinerary just for you.
        </p>
      </div>

      {/* Destination */}
      <FormField label="Destination" icon="location_on">
        <input
          type="text"
          placeholder="Where would you like to go?"
          value={formData.destination}
          onChange={(e) => onChange({ destination: e.target.value })}
          className={inputBase}
        />
      </FormField>

      {/* Travel Dates */}
      <FormField label="Travel Dates" icon="calendar_today">
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <p className="text-[10px] text-outline-variant uppercase tracking-widest">Departure</p>
            <input
              type="date"
              value={formData.departureDate}
              onChange={(e) => onChange({ departureDate: e.target.value })}
              className={`${inputBase} w-full`}
            />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] text-outline-variant uppercase tracking-widest">Return</p>
            <input
              type="date"
              value={formData.returnDate}
              onChange={(e) => onChange({ returnDate: e.target.value })}
              className={`${inputBase} w-full`}
            />
          </div>
        </div>
      </FormField>

      {/* Budget Range */}
      <FormField label="Budget Range" icon="payments">
        <RangeSlider
          min={1000}
          max={20000}
          step={BUDGET_STEP}
          value={[formData.budgetMin, formData.budgetMax]}
          onChange={([min, max]) => onChange({ budgetMin: min, budgetMax: max })}
          formatLabel={formatBudget}
        />
      </FormField>

      {/* Travel Style & Interests */}
      <FormField label="Travel Style & Interests" icon="local_activity">
        <div className="flex flex-wrap gap-2">
          {formData.interests.map((tag) => (
            <TagChip
              key={tag.id}
              label={tag.label}
              selected={tag.selected}
              onClick={() => toggleInterest(tag.id)}
            />
          ))}
          <button
            type="button"
            className="px-4 py-1.5 rounded-full text-xs font-semibold border border-dashed border-outline-variant text-outline-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            + more
          </button>
        </div>
      </FormField>

      {/* Additional Context */}
      <FormField label="Additional Context" icon="notes">
        <textarea
          rows={4}
          placeholder="Any special requests, dietary restrictions, or travel preferences..."
          value={formData.additionalContext}
          onChange={(e) => onChange({ additionalContext: e.target.value })}
          className={`${inputBase} resize-none`}
        />
      </FormField>

      {/* CTA */}
      <button
        type="button"
        onClick={onSubmit}
        className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-body"
      >
        Generate Itinerary
      </button>
    </div>
  );
}
