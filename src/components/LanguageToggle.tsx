import { type Language } from '../types/translations';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export default function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="absolute top-7 right-7 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
      aria-label="Toggle language"
    >
      <span className="text-lg">{language === 'en' ? '한' : 'EN'}</span>
      <span className="text-gray-600 dark:text-gray-300">{language === 'en' ? 'KO' : 'EN'}</span>
    </button>
  );
}
