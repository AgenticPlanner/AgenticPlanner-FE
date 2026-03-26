import React, { useRef } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = '캡틴 빈에게 무엇이든 물어보세요...',
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    onChange(el.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSubmit();
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="bg-surface-container rounded-2xl flex flex-col shadow-sm focus-within:bg-white focus-within:ring-1 focus-within:ring-primary/20 transition-all">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onInput={handleInput}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none resize-none px-5 pt-4 pb-2 font-body text-sm text-on-surface placeholder:text-outline-variant focus:ring-0"
      />
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-1">
          {(['image', 'attach_file', 'mic'] as const).map((icon) => (
            <button
              key={icon}
              type="button"
              className="p-1.5 rounded-lg text-outline-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">{icon}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled}
          className="bg-primary text-on-primary p-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
    </div>
  );
}
