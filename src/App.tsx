import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import OnboardingSection from './components/OnboardingSection';
import { useLanguage } from './hooks/useLanguage';
import { CATEGORY_PROMPTS } from './types/categoryPrompts';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('ski');
  const [isVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  
  const { language, toggleLanguage, t } = useLanguage('ko');

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setPrompt(CATEGORY_PROMPTS[categoryId]?.[language] || '');
  };

  const handleLanguageToggle = () => {
    toggleLanguage();
    // 언어 변경 시 현재 프롬프트도 업데이트
    const newLang = language === 'en' ? 'ko' : 'en';
    if (prompt && activeCategoryId) {
      setPrompt(CATEGORY_PROMPTS[activeCategoryId]?.[newLang] || '');
    }
  };

  const handleStartPlanning = () => {
    if (prompt.trim()) {
      // TODO: Navigate to planning page or trigger planning flow
      console.log('Starting planning with:', prompt);
      alert(`Starting your plan: "${prompt}"`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex flex-col">
      <Header language={language} onLanguageToggle={handleLanguageToggle} />
      
      <main className="flex-1 w-full flex flex-col">
      <HeroSection
        isVisible={isVisible}
        isFocused={isFocused}
        prompt={prompt}
        activeCategoryId={activeCategoryId}
        language={language}
        mainTitle={t.mainTitle}
        searchPlaceholder={t.searchPlaceholder}
        onPromptChange={setPrompt}
        onSubmit={handleStartPlanning}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onCategoryChange={handleCategoryChange}
        onLanguageToggle={handleLanguageToggle}
      />

      <OnboardingSection
        howItWorks={t.howItWorks}
        step1Title={t.step1Title}
        step1Desc={t.step1Desc}
        step2Title={t.step2Title}
        step2Desc={t.step2Desc}
        step3Title={t.step3Title}
        step3Desc={t.step3Desc}
        ctaButton={t.ctaButton}
      />
      </main>

      <Footer />
    </div>
  );
}