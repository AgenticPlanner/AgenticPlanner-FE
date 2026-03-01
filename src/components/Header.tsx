import React from 'react';

interface HeaderProps {
  onLanguageToggle: () => void;
  language: 'en' | 'ko';
}

export default function Header({ onLanguageToggle, language }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2
        text-3xl font-bold text-gray-900 dark:text-white">Agentic Planner
        </div>

        {/* Language Toggle */}
        <button
          onClick={onLanguageToggle}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle language"
        >
          <span>{language === 'en' ? '한' : 'EN'}</span>
        </button>
      </div>
    </header>
  );
}
