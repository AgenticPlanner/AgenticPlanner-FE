import { useEffect, useState } from 'react';
import type { APIPlan } from '@/types/api';
import type { TripDay } from '@/types';
import { getPlans, createPlan, joinPlan, invitePlan, getPlan, getDays, getItems } from '@/api/plans';
import { adaptDayToTripDay } from '@/utils/adapters';

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

  const handleCreatePlan = async (data: Pick<APIPlan, 'title' | 'description'>) => {
    const plan = await createPlan(data);
    setPlans((prev) => [plan, ...prev]);
    return plan;
  };

  const handleJoinPlan = async (invite_code: string) => {
    const plan = await joinPlan(invite_code) as APIPlan;
    setPlans((prev) => [plan, ...prev]);
    return plan;
  };

  const handleInvitePlan = async (id: number) => {
    const { invite_code } = await invitePlan(id);
    return invite_code;
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

export const usePlanDetail = (planId: number | null) => {
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [plan, setPlan] = useState<APIPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) return;

    setIsLoading(true);
    setError(null);

    const fetchAll = async () => {
      const [fetchedPlan, days] = await Promise.all([
        getPlan(planId),
        getDays(planId),
      ]);
      setPlan(fetchedPlan);

      const daysWithItems = await Promise.all(
        days.map(async (day) => {
          const items = await getItems(planId, day.id);
          return adaptDayToTripDay(day, items);
        })
      );
      setTripDays(daysWithItems);
    };

    fetchAll()
      .catch(() => setError('일정을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false));
  }, [planId]);

  return { plan, tripDays, isLoading, error };
};
