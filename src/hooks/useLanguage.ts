import { useState } from 'react';
import { type Language, TRANSLATIONS } from '../types/translations';

export function useLanguage(defaultLanguage: Language = 'ko') {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en');
  };

  const t = TRANSLATIONS[language];

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };
}
