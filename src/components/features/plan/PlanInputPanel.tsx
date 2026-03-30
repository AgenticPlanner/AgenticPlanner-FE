import { useState, useRef } from 'react';
import type { PlanFormData } from '@/types';
import { FormField, RangeSlider, TagChip } from '@/components/ui';
import { BUDGET_STEP, BUDGET_MIN, BUDGET_MAX } from '@/data/tripData';

interface PlanInputPanelProps {
  formData: PlanFormData;
  onChange: (updated: Partial<PlanFormData>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const inputBase =
  'w-full bg-surface-container-low rounded-xl p-4 font-body text-sm text-on-surface placeholder:text-outline-variant outline-none focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all';

/** ₩500,000 → "50만원", ₩1,000,000 → "100만원" */
function formatBudget(v: number) {
  const man = Math.round(v / 10000);
  return `${man.toLocaleString()}만원`;
}

export default function PlanInputPanel({ formData, onChange, onSubmit, isLoading = false }: PlanInputPanelProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const addInputRef = useRef<HTMLInputElement>(null);

  const toggleInterest = (id: string) => {
    onChange({
      interests: formData.interests.map((tag) =>
        tag.id === id ? { ...tag, selected: !tag.selected } : tag
      ),
    });
  };

  const openAddTag = () => {
    setIsAddingTag(true);
    setTimeout(() => addInputRef.current?.focus(), 0);
  };

  const commitAddTag = () => {
    const label = newTagInput.trim();
    if (label) {
      onChange({
        interests: [
          ...formData.interests,
          { id: `custom-${Date.now()}`, label, selected: true },
        ],
      });
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const cancelAddTag = () => {
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleBudgetMinInput = (raw: string) => {
    const man = Number(raw);
    if (isNaN(man) || man < 0) return;
    const won = man * 10000;
    const clamped = Math.max(BUDGET_MIN, Math.min(formData.budgetMax - BUDGET_STEP, won));
    onChange({ budgetMin: clamped });
  };

  const handleBudgetMaxInput = (raw: string) => {
    const man = Number(raw);
    if (isNaN(man) || man < 0) return;
    const won = man * 10000;
    const clamped = Math.min(BUDGET_MAX, Math.max(formData.budgetMin + BUDGET_STEP, won));
    onChange({ budgetMax: clamped });
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
      <FormField label="예산 범위 (1인당)" icon="payments">
        <RangeSlider
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={[formData.budgetMin, formData.budgetMax]}
          onChange={([min, max]) => onChange({ budgetMin: min, budgetMax: max })}
          formatLabel={formatBudget}
        />
        {/* 직접 입력 */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1 space-y-1">
            <p className="text-[10px] text-outline-variant uppercase tracking-widest">최소</p>
            <div className="flex items-center gap-1 bg-surface-container-low rounded-xl px-3 py-2.5">
              <input
                type="number"
                value={Math.round(formData.budgetMin / 10000)}
                onChange={(e) => handleBudgetMinInput(e.target.value)}
                min={BUDGET_MIN / 10000}
                max={(formData.budgetMax - BUDGET_STEP) / 10000}
                className="flex-1 bg-transparent outline-none text-sm font-body text-on-surface w-0 min-w-0"
              />
              <span className="text-xs text-outline-variant shrink-0 font-body">만원</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] text-outline-variant uppercase tracking-widest">최대</p>
            <div className="flex items-center gap-1 bg-surface-container-low rounded-xl px-3 py-2.5">
              <input
                type="number"
                value={Math.round(formData.budgetMax / 10000)}
                onChange={(e) => handleBudgetMaxInput(e.target.value)}
                min={(formData.budgetMin + BUDGET_STEP) / 10000}
                max={BUDGET_MAX / 10000}
                className="flex-1 bg-transparent outline-none text-sm font-body text-on-surface w-0 min-w-0"
              />
              <span className="text-xs text-outline-variant shrink-0 font-body">만원</span>
            </div>
          </div>
        </div>
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

          {/* 커스텀 태그 입력 */}
          {isAddingTag ? (
            <div className="flex items-center gap-1 bg-surface-container-low rounded-full pl-3 pr-1.5 py-1">
              <input
                ref={addInputRef}
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); commitAddTag(); }
                  if (e.key === 'Escape') cancelAddTag();
                }}
                placeholder="관심사 입력"
                maxLength={20}
                className="bg-transparent outline-none text-xs font-body text-on-surface w-24 placeholder:text-outline-variant"
              />
              <button
                type="button"
                onClick={commitAddTag}
                className="text-primary hover:opacity-70 transition-opacity"
                aria-label="추가"
              >
                <span className="material-symbols-outlined text-base leading-none">check</span>
              </button>
              <button
                type="button"
                onClick={cancelAddTag}
                className="text-outline-variant hover:opacity-70 transition-opacity"
                aria-label="취소"
              >
                <span className="material-symbols-outlined text-base leading-none">close</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openAddTag}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border border-dashed border-outline-variant text-outline-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              + 추가
            </button>
          )}
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
        disabled={isLoading}
        className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-body disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {isLoading ? '세션 생성 중...' : '일정 생성하기'}
      </button>
    </div>
  );
}
