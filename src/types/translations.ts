export type Language = 'en' | 'ko';

export const TRANSLATIONS = {
  en: {
    mainTitle: 'What do you wanna plan with us?',
    searchPlaceholder: 'Tell us what you want to plan...',
    howItWorks: 'How it works',
    step1Title: 'Tell us your plan',
    step1Desc: 'Share your ideas, preferences, and requirements. Choose from our categories or describe it in your own words.',
    step2Title: 'We analyze & optimize',
    step2Desc: 'Our AI agents work together to create the perfect plan, considering all details and finding the best options.',
    step3Title: 'Get your perfect plan',
    step3Desc: 'Receive a comprehensive, customized plan with all the details, bookings, and recommendations you need.',
    ctaButton: 'Start Planning',
  },
  ko: {
    mainTitle: '무엇을 함께 계획하고 싶으신가요?',
    searchPlaceholder: '계획하고 싶은 내용을 말씀해주세요...',
    howItWorks: '이용 방법',
    step1Title: '계획을 말하세요',
    step1Desc: '아이디어, 선호사항, 요구사항을 공유해주세요. 카테고리를 선택하거나 자유롭게 설명해주세요.',
    step2Title: '분석 및 최적화',
    step2Desc: 'AI 에이전트가 모든 세부사항을 고려하여 최적의 옵션을 찾아 완벽한 계획을 만듭니다.',
    step3Title: '완벽한 계획 받기',
    step3Desc: '필요한 모든 세부사항, 예약, 추천사항이 포함된 맞춤형 계획을 받아보세요.',
    ctaButton: '계획 시작하기',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;
