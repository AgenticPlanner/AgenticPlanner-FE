import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { usePlanContext } from '@/contexts/PlanContext';
import { getPlan } from '@/api/plans';
import { adaptPlanToTripDays } from '@/utils/adapters';
import type { APIPlan } from '@/types/api';
import KakaoMap from '@/components/common/KakaoMap';
import { ItinerarySkeleton } from '@/components/features/itinerary';

export default function MapPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const urlPlanId = searchParams.get('planId');

    const { activePlan, setActivePlanId } = usePlanContext();

    // 로컬 플랜 상태 — 마운트마다 직접 fetch하여 PlanContext 캐시 우회
    const [localPlan, setLocalPlan] = useState<APIPlan | null>(null);
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    // urlPlanId 변경 또는 마운트 시 항상 직접 API 호출 (컴포넌트 인스턴스가 바뀌므로 매 진입마다 실행됨)
    useEffect(() => {
        if (!urlPlanId) return;
        setLocalLoading(true);
        setLocalPlan(null);
        setLocalError(null);
        getPlan(urlPlanId)
            .then((data) => {
                setLocalPlan(data);
                setActivePlanId(urlPlanId);
            })
            .catch(() => setLocalError('플랜을 불러오지 못했습니다.'))
            .finally(() => setLocalLoading(false));
    }, [urlPlanId]);

    // forceRefresh state 초기화 (뒤로가기 재발동 방지)
    useEffect(() => {
        if (!location.state?.forceRefresh) return;
        navigate(location.pathname + location.search, { replace: true, state: {} });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state?.forceRefresh]);

    const plan = localPlan ?? activePlan;
    const tripDays = plan ? adaptPlanToTripDays(plan) : [];
    const allStops = tripDays.flatMap((day) => day.stops);

    return (
        <AppLayout topBarTitle={plan?.title || '지도'}>
            <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
                {/* 로딩 상태 */}
                {localLoading && (
                    <div className="absolute inset-0 z-30 bg-white p-10 flex flex-col items-center justify-center">
                        <div className="w-full max-w-2xl"><ItinerarySkeleton /></div>
                    </div>
                )}
                {/* 에러 상태 */}
                {localError && !localLoading && (
                    <div className="absolute inset-0 z-30 bg-white flex flex-col items-center justify-center gap-4">
                        <div className="bg-red-50 text-red-600 text-sm font-medium rounded-xl px-5 py-4">{localError}</div>
                    </div>
                )}
                <div className="w-full h-full">
                    {!localLoading && plan && (
                        <KakaoMap
                            stops={allStops}
                            interactive={true}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}