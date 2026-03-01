import { type Language } from './translations';

export const CATEGORY_PROMPTS: Record<string, Record<Language, string>> = {
  wedding: {
    en: 'I want to plan a beautiful wedding ceremony with all the details covered',
    ko: '모든 세부사항이 포함된 아름다운 결혼식을 계획하고 싶어요',
  },
  roadtrip: {
    en: 'I wanna plan a road trip with my friends to create unforgettable memories',
    ko: '친구들과 함께 잊지 못할 추억을 만들 로드트립을 계획하고 싶어요',
  },
  family: {
    en: 'I want to organize a perfect family holiday that everyone will enjoy',
    ko: '모두가 즐길 수 있는 완벽한 가족 휴가를 계획하고 싶어요',
  },
  ski: {
    en: 'I wanna plan a 3-day ski trip at Alps with my friend. It should be on budget',
    ko: '친구와 함께 알프스에서 3일간 스키 여행을 계획하고 싶어요. 예산을 고려해주세요',
  },
  gathering: {
    en: 'I want to plan a cozy home gathering for friends and family',
    ko: '친구와 가족을 위한 따뜻한 홈 모임을 계획하고 싶어요',
  },
  trip: {
    en: 'I want to plan an amazing family trip with activities for all ages',
    ko: '모든 연령대가 즐길 수 있는 멋진 가족 여행을 계획하고 싶어요',
  },
};
