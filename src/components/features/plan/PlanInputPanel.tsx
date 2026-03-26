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
        <h2 className="font-headline font-extrabold text-3xl text-primary">나만의 여행 설계</h2>
        <p className="font-body text-on-surface-variant max-w-sm text-sm leading-relaxed">
          꿈꾸는 여행지를 알려주세요. AI가 맞춤형 일정을 만들어드립니다.
        </p>
      </div>

      {/* Destination */}
      <FormField label="여행지" icon="location_on">
        <input
          type="text"
          placeholder="어디로 떠나고 싶으신가요?"
          value={formData.destination}
          onChange={(e) => onChange({ destination: e.target.value })}
          className={inputBase}
        />
      </FormField>

      {/* Travel Dates */}
      <FormField label="여행 날짜" icon="calendar_today">
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <p className="text-[10px] text-outline-variant uppercase tracking-widest">출발일</p>
            <input
              type="date"
              value={formData.departureDate}
              onChange={(e) => onChange({ departureDate: e.target.value })}
              className={`${inputBase} w-full`}
            />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] text-outline-variant uppercase tracking-widest">귀국일</p>
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
      <FormField label="예산 범위" icon="payments">
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
      <FormField label="여행 스타일 & 관심사" icon="local_activity">
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
            + 더보기
          </button>
        </div>
      </FormField>

      {/* Additional Context */}
      <FormField label="추가 요청사항" icon="notes">
        <textarea
          rows={4}
          placeholder="특별 요청, 식이 제한, 또는 여행 선호도를 자유롭게 적어주세요..."
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
        일정 생성하기
      </button>
    </div>
  );
}
