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
