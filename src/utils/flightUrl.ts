/**
 * 네이버 항공권 URL 유효성 검사.
 * 규칙:
 *   - flight.naver.com/flights/international/ 포함
 *   - {IATA}:city-{IATA}:city-{YYYYMMDD} 패턴 포함
 *   - adult=N 포함
 *   - fareType=Y 포함
 *   - 'None', 'undefined', 'null' 미포함
 */
export const isValidNaverFlightUrl = (url: string): boolean => {
  if (!url) return false
  if (!url.includes('flight.naver.com')) return false

  const invalidTokens = ['None', 'undefined', 'null', ':city-:city']
  if (invalidTokens.some(t => url.includes(t))) return false

  // 정상 딥링크 패턴
  const deepLinkPattern = /[A-Z]{3}:city-[A-Z]{3}:city-\d{8}/
  const hasDeepLink = deepLinkPattern.test(url)

  // 검색 fallback 패턴도 허용
  const searchPattern =
    url.includes('/flights/international') || url.includes('/flights?query=')

  return hasDeepLink || searchPattern
}

/**
 * PlanItem의 external_link가 유효한 항공권 URL인지 확인.
 * 유효하지 않으면 null 반환 → FE에서 fallback URL 사용.
 */
export const getFlightUrl = (
  externalLink: string | null | undefined,
  origin: string,
  destination: string,
  departDate: string,
  returnDate: string,
  adults: number,
): string => {
  // 저장된 URL이 유효하면 그대로 사용
  if (externalLink && isValidNaverFlightUrl(externalLink)) {
    return externalLink
  }

  // FE 클라이언트 사이드 URL 생성 (BE 저장 실패 대비)
  const orig = getIataClient(origin)
  const dest = getIataClient(destination)

  if (!orig || !dest) {
    const q = encodeURIComponent(`${origin} ${destination} 항공권`)
    return `https://flight.naver.com/flights?query=${q}&adult=${adults}`
  }

  const fmtDate = (d: string) => d.replace(/-/g, '')
  const depart = fmtDate(departDate)
  const ret = fmtDate(returnDate)

  if (!depart) {
    const q = encodeURIComponent(`${origin} ${destination} 항공권`)
    return `https://flight.naver.com/flights/international?query=${q}&adult=${adults}&fareType=Y`
  }

  const path = ret
    ? `${orig}:city-${dest}:city-${depart}/${dest}:city-${orig}:city-${ret}`
    : `${orig}:city-${dest}:city-${depart}`

  return `https://flight.naver.com/flights/international/${path}?adult=${adults}&isDirect=false&fareType=Y`
}

/**
 * transport_params dict → 교통편 예약 URL 생성 (클라이언트 사이드 fallback).
 * BE build_transport_url_from_params의 FE 미러 구현.
 */
export const buildTransportUrlClient = (
  params: Record<string, unknown>,
  destination: string,
): string => {
  const type = String(params.type ?? 'flight').toLowerCase()
  const origin = String(params.origin_city ?? '')
  const dest = String(params.destination_city ?? destination)
  const oIata = String(params.origin_iata ?? getIataClient(origin))
  const dIata = String(params.destination_iata ?? getIataClient(dest))
  const depDate = String(params.depart_date ?? '').replace(/-/g, '')
  const retDate = String(params.return_date ?? '').replace(/-/g, '')
  const adults = Math.max(1, Number(params.adults ?? 1))

  if (type === 'ktx') {
    return (
      `https://www.korail.com/ticket/search/general` +
      `?selGoDay=${depDate}&txtGoStart=${encodeURIComponent(origin)}` +
      `&txtGoEnd=${encodeURIComponent(dest)}&radJobId=1`
    )
  }
  if (type === 'srt') {
    return (
      `https://etk.srail.kr/main.do` +
      `?startStation=${encodeURIComponent(origin)}` +
      `&endStation=${encodeURIComponent(dest)}&dptDt=${depDate}`
    )
  }
  if (type === 'bus') {
    return (
      `https://www.kobus.co.kr/main.do?method=expSearch` +
      `&startCityId=${encodeURIComponent(origin)}&endCityId=${encodeURIComponent(dest)}`
    )
  }
  if (type === 'ferry') {
    const q = encodeURIComponent(`${dest} ferry`)
    return `https://www.kkday.com/ko/category/transport/list?query=${q}`
  }
  if (type === 'drive') {
    return `https://map.naver.com/v5/directions/${encodeURIComponent(origin)}/${encodeURIComponent(dest)}/-/car`
  }
  if (type === 'domestic_flight') {
    if (oIata && dIata && depDate) {
      return `https://flight.naver.com/flights/domestic/${oIata}-${dIata}-${depDate}?adult=${adults}`
    }
    return `https://flight.naver.com/flights/domestic?departure=${encodeURIComponent(origin)}&arrival=${encodeURIComponent(dest)}&adult=${adults}`
  }

  // 국제선 항공 (기본값)
  if (!oIata || !dIata || !depDate) {
    const q = encodeURIComponent(`${origin || dest} 항공권`)
    return `https://flight.naver.com/flights/international?query=${q}&adult=${adults}&fareType=Y`
  }
  const path = retDate
    ? `${oIata}:city-${dIata}:city-${depDate}/${dIata}:city-${oIata}:city-${retDate}`
    : `${oIata}:city-${dIata}:city-${depDate}`
  return `https://flight.naver.com/flights/international/${path}?adult=${adults}&isDirect=false&fareType=Y`
}

// FE용 간이 IATA 변환 (자주 쓰는 도시만)
const IATA_MAP_CLIENT: Record<string, string> = {
  '서울': 'SEL', '인천': 'ICN', '김포': 'GMP',
  '도쿄': 'TYO', '오사카': 'OSA', '홍콩': 'HKG',
  '방콕': 'BKK', '싱가포르': 'SIN', '발리': 'DPS',
  '파리': 'PAR', '런던': 'LON', '로마': 'ROM',
  '뉴욕': 'NYC', '더블린': 'DUB', '바르셀로나': 'BCN',
  '타이베이': 'TPE', '베이징': 'BJS', '상하이': 'SHA',
}

const getIataClient = (city: string): string => {
  if (!city) return ''
  if (/^[A-Z]{3}$/.test(city)) return city
  for (const [k, v] of Object.entries(IATA_MAP_CLIENT)) {
    if (city.includes(k)) return v
  }
  return ''
}
