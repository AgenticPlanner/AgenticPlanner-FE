import { useEffect, useState } from 'react';
import type { APIPlan } from '@/types/api';
import type { TripDay } from '@/types';
import { getPlans, createPlan, joinPlan, invitePlan, getPlan } from '@/api/plans';
import { adaptPlanToTripDays } from '@/utils/adapters';

export const usePlans = () => {
  const [plans, setPlans] = useState<APIPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => setError('플랜 목록을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreatePlan = async (data: Pick<APIPlan, 'title'> & { description?: string }) => {
    const plan = await createPlan(data);
    setPlans((prev) => [plan, ...prev]);
    return plan;
  };

  const handleJoinPlan = async (invite_code: string) => {
    const plan = await joinPlan(invite_code) as APIPlan;
    setPlans((prev) => [plan, ...prev]);
    return plan;
  };

  const handleInvitePlan = async (id: string) => {
    const { code } = await invitePlan(id);
    return code;
  };

  return {
    plans,
    isLoading,
    error,
    createPlan: handleCreatePlan,
    joinPlan: handleJoinPlan,
    invitePlan: handleInvitePlan,
  };
};

export const usePlanDetail = (planId?: string | null) => {
  const [plan, setPlan] = useState<APIPlan | null>(null);
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) {
      setPlan(null);
      setTripDays([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    getPlan(planId)
      .then((data) => {
        setPlan(data);
        setTripDays(adaptPlanToTripDays(data));
      })
      .catch(() => setError('일정을 불러오지 못했어요.'))
      .finally(() => setIsLoading(false));
  }, [planId]);

  return { plan, tripDays, isLoading, error };
};
