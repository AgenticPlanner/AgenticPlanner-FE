import React from 'react';
import SearchInput from './SearchInput';
import CategoryCard from './CategoryCard';
import { CATEGORIES } from '../data/mockData';
import { type Language } from '../types/translations';

interface HeroSectionProps {
  isVisible: boolean;
  isFocused: boolean;
  prompt: string;
  activeCategoryId: string;
  language: Language;
  mainTitle: string;
  searchPlaceholder: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onCategoryChange: (categoryId: string) => void;
  onLanguageToggle: () => void;
}

export default function HeroSection({
  isVisible,
  isFocused,
  prompt,
  activeCategoryId,
  language,
  mainTitle,
  searchPlaceholder,
  onPromptChange,
  onSubmit,
  onFocus,
  onBlur,
  onCategoryChange,
}: HeroSectionProps) {
  return (
    <div className="mx-auto min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      <div className="w-full flex flex-col items-center">
        
        {/* Title with fade-in animation */}
        <h1 className={`text-[2.5rem] md:text-[3.5rem] font-serif text-gray-900 dark:text-white mb-10 tracking-tight text-center leading-tight transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          {mainTitle}
        </h1>

        {/* Input Component with animation */}
        <div className={`w-full flex justify-center transition-all duration-700 delay-100 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <SearchInput 
            value={prompt} 
            onChange={onPromptChange}
            onSubmit={onSubmit}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={searchPlaceholder}
          />
        </div>

        {/* Category Grid - 검색창 포커스 시에만 표시 */}
        <div className={`w-full flex justify-center overflow-hidden transition-all duration-500 ease-in-out ${
          isFocused ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full max-w-[800px] pt-4 pb-6">
            {CATEGORIES.map((category, index) => (
              <div
                key={category.id}
                className="transition-all duration-500"
                style={{
                  transitionDelay: isFocused ? `${index * 50}ms` : '0ms',
                  opacity: isFocused ? 1 : 0,
                  transform: isFocused ? 'translateY(0)' : 'translateY(-10px)'
                }}
              >
                <CategoryCard
                  category={category}
                  isActive={activeCategoryId === category.id}
                  onClick={onCategoryChange}
                  language={language}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
