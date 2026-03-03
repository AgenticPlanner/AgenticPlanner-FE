import React, { useRef, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, onSubmit, onFocus, onBlur, placeholder = "Tell us what you want to plan..." }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() && onSubmit) {
      onSubmit();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  return (
    <div className="w-full max-w-[800px] mx-auto mb-8">
      <div className="flex items-center gap-3 w-full px-6 py-4 bg-[#EAF0EC] border-2 border-[#C5D0C9] dark:bg-gray-800 dark:border-gray-600 rounded-full transition-all duration-300 shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-gray-400 dark:focus-within:border-gray-500 group">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 text-[1.1rem] font-semibold placeholder-gray-500 dark:placeholder-gray-400 font-serif"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? '' : placeholder}
          aria-label="Planning input"
          aria-describedby="input-helper"
        />
      </div>
    </div>
  );
}