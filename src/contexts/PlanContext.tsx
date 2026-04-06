import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { APIPlan } from '@/types/api';
import { getPlans, getPlan } from '@/api/plans';

const STORAGE_KEY = 'activePlanId';

interface PlanContextValue {
  plans: APIPlan[];
  activePlan: APIPlan | null;
  activePlanId: string | null;
  setActivePlanId: (id: string) => void;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<APIPlan[]>([]);
  const [activePlan, setActivePlan] = useState<APIPlan | null>(null);
  const [activePlanId, setActivePlanIdState] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const initializedRef = useRef(false);

  const loadPlans = useCallback(() => {
    setLoading(true);
    setError(null);
    getPlans()
      .then((data) => {
        setPlans(data);
        return data;
      })
      .catch(() => {
        setError('플랜 목록을 불러오지 못했습니다.');
        setPlans([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 초기 로드
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // plans 로드 후 activePlanId 결정
  useEffect(() => {
    if (loading || initializedRef.current) return;
    if (plans.length === 0) {
      setActivePlan(null);
      initializedRef.current = true;
      return;
    }

    const urlPlanId = searchParams.get('planId');
    const storedId = localStorage.getItem(STORAGE_KEY);
    const candidateId = urlPlanId ?? storedId ?? plans[0].id;

    const found = plans.find(p => p.id === candidateId);
    const resolvedId = found ? candidateId : plans[0].id;

    setActivePlanIdState(resolvedId);
    localStorage.setItem(STORAGE_KEY, resolvedId);

    const resolvedPlan = plans.find(p => p.id === resolvedId) ?? plans[0];
    setActivePlan(resolvedPlan);
    initializedRef.current = true;
  }, [plans, loading, searchParams]);

  const setActivePlanId = useCallback((id: string) => {
    setActivePlanIdState(id);
    localStorage.setItem(STORAGE_KEY, id);

    // 항상 최신 데이터 fetch (캐시 무시 — editing 후 stale 방지)
    setLoading(true);
    getPlan(id)
      .then(setActivePlan)
      .catch(() => setError('플랜을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PlanContext.Provider
      value={{
        plans,
        activePlan,
        activePlanId,
        setActivePlanId,
        loading,
        error,
        refetch: loadPlans,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlanContext() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlanContext must be used inside PlanProvider');
  return ctx;
}
