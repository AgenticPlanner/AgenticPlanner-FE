import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlanFormData } from '@/types';
import type { TravelInfo } from '@/types/api';
import { AppLayout } from '@/components/layout';
import { PlanInputPanel } from '@/components/features/plan';
import { createAgentSession } from '@/api/agent';
import { defaultInterestTags, BUDGET_MIN, BUDGET_MAX } from '@/data/tripData';

export default function PlanPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PlanFormData>({
    destination: '',
    departureDate: '',
    returnDate: '',
    budgetMin: BUDGET_MIN,
    budgetMax: BUDGET_MAX,
    interests: defaultInterestTags,
    additionalContext: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (updated: Partial<PlanFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleGenerateItinerary = async () => {
    try {
      setIsLoading(true);
      const travelInfo: TravelInfo = {
        destination: formData.destination || '',
        start_date: formData.departureDate || '',
        end_date: formData.returnDate || '',
        group_size: 2,
        budget: formData.budgetMax,
        travel_style: formData.interests
          .filter((t) => t.selected)
          .map((t) => t.label)
          .join(', '),
        special_requests: formData.additionalContext || '',
      };
      const session = await createAgentSession(travelInfo);
      navigate(`/chat?sessionId=${session.id}&autoStart=true`);
    } catch (error) {
      console.error('세션 생성 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout topBarTitle="플랜">
      <div className="flex overflow-hidden bg-surface h-[calc(100vh-5rem)]">
        <div className="h-full flex flex-col w-full">
          <PlanInputPanel
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleGenerateItinerary}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AppLayout>
  );
}
