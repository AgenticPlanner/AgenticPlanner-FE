import type { APIPlanItem } from '@/types/api';
import { buildTransportUrlClient, isValidNaverFlightUrl } from '@/utils/flightUrl';

// ─── 섹션 설정 ─────────────────────────────────────────────────────────────────

export const SECTION_CONFIG = {
  BOOKING: {
    icon: '📋',
    label: '예약 & 구매',
    description: '출발 전 완료해야 할 예약/구매 목록',
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  REVIEW: {
    icon: '🔍',
    label: '리뷰 & 정보 확인',
    description: '방문 전 미리 확인할 여행지/맛집 후기',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
  },
  TIPS: {
    icon: '💡',
    label: '여행자 팁',
    description: '현지 여행자들의 꿀팁 모음',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
} as const;

// ─── 카테고리 메타 ──────────────────────────────────────────────────────────────

export const CATEGORY_ICON: Record<string, string> = {
  TRANSPORT:     '✈️',
  ACCOMMODATION: '🏨',
  ACTIVITY:      '🎡',
  RESTAURANT:    '🍽️',
  TIP:           '💡',
  OTHER:         '📌',
};

export const CATEGORY_LABEL: Record<string, string> = {
  TRANSPORT:     '교통',
  ACCOMMODATION: '숙소',
  ACTIVITY:      '액티비티',
  RESTAURANT:    '식당',
  TIP:           '팁',
  OTHER:         '기타',
};

// ─── 액션 버튼 타입 ─────────────────────────────────────────────────────────────

export interface ActionBtn { url: string; label: string; color: string }

// ─── 예약 액션 결정 ─────────────────────────────────────────────────────────────

export function getBookingAction(item: APIPlanItem): ActionBtn | null {
  const params = item.transport_params ?? {};
  const type   = String(params.type ?? '').toLowerCase();

  if (item.external_link && isValidNaverFlightUrl(item.external_link))
    return { url: item.external_link, label: '✈️ 항공권 검색', color: '#6366f1' };

  if (Object.keys(params).length > 0) {
    const url = buildTransportUrlClient(params, '');
    if (type === 'ktx' || type === 'srt')      return { url, label: '🚅 KTX/SRT 예매',  color: '#1d4ed8' };
    if (type === 'bus')                         return { url, label: '🚌 버스 예매',       color: '#15803d' };
    if (type === 'ferry')                       return { url, label: '⛴️ 배편 검색',       color: '#0891b2' };
    if (type === 'drive' || type === 'transit') return { url, label: '🗺️ 길찾기',         color: '#03c75a' };
    if (type === 'domestic_flight')             return { url, label: '✈️ 국내선 검색',    color: '#6366f1' };
    return { url, label: '✈️ 항공권 검색', color: '#6366f1' };
  }

  if (item.external_link) {
    const label =
      item.category === 'ACCOMMODATION' ? '🏨 숙소 예약'   :
      item.category === 'ACTIVITY'      ? '🎟️ 입장권 예매' :
      item.category === 'RESTAURANT'    ? '🍽️ 식당 예약'   :
      item.category === 'TRANSPORT'     ? '✈️ 교통 예매'   : '🔗 예약하기';
    const color =
      item.category === 'ACCOMMODATION' ? '#f97316' :
      item.category === 'ACTIVITY'      ? '#8b5cf6' :
      item.category === 'RESTAURANT'    ? '#ef4444' : '#3b82f6';
    return { url: item.external_link, label, color };
  }

  if (item.category === 'ACCOMMODATION') {
    const q = encodeURIComponent(item.title ?? item.location ?? '');
    return { url: `https://hotels.naver.com/searchpage/hotel?query=${q}`, label: '🏨 숙소 예약', color: '#f97316' };
  }
  if (item.category === 'ACTIVITY') {
    const q = encodeURIComponent(`${item.title ?? ''} 예약`);
    return { url: `https://www.klook.com/ko/search/?query=${q}`, label: '🎟️ 예약하기', color: '#8b5cf6' };
  }
  if (item.naver_map_url)
    return { url: item.naver_map_url, label: '🗺️ 길찾기', color: '#03c75a' };

  return null;
}

// ─── 리뷰 액션 결정 ─────────────────────────────────────────────────────────────

export function getReviewActions(item: APIPlanItem): ActionBtn[] {
  const btns: ActionBtn[] = [];
  if (item.review_url) {
    const isYt = item.review_url.includes('youtube') || item.review_url.includes('youtu.be');
    btns.push({ url: item.review_url, label: isYt ? '▶ 유튜브 리뷰' : '🔍 네이버 후기', color: isYt ? '#ef4444' : '#03c75a' });
  }
  if (item.naver_map_url)
    btns.push({ url: item.naver_map_url, label: '🗺️ 네이버 지도', color: '#1e40af' });
  if (item.external_link && item.external_link !== item.review_url)
    btns.push({ url: item.external_link, label: '상세 보기', color: '#6b7280' });
  return btns;
}

// ─── 금액 포맷 ──────────────────────────────────────────────────────────────────

export const fmtAmount = (a?: string): string => {
  if (!a) return '';
  const n = parseFloat(a);
  return isNaN(n) || n === 0 ? '' : `₩${Math.round(n).toLocaleString()}`;
};
