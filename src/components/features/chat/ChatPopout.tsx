import { useState } from 'react';
import type { ChatMessage } from '@/types';
import { ChatBubble, ChatInput } from '@/components/common';
import { initialChatMessages, suggestionChips } from '@/data/tripData';

interface ChatPopoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPopout({ isOpen, onClose }: ChatPopoutProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (content: string) => {
    if (!content.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-on-surface/20 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Popout panel — slides up from bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest rounded-t-3xl shadow-float flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '85dvh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary-fixed text-base">smart_toy</span>
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">Captain Bean AI</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                AI Travel Concierge
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar">
          {messages.map((msg, idx) => (
            <div key={msg.id}>
              <ChatBubble message={msg} />
              {idx === 0 && messages.length === 1 && (
                <div className="ml-14 mt-4 flex flex-wrap gap-2">
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleSend(chip)}
                      className="text-xs bg-white border border-surface-container px-3 py-1.5 rounded-full text-on-surface-variant hover:border-primary transition-colors font-body"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 pb-safe pt-3 flex-shrink-0">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={() => handleSend(inputValue)}
          />
          <p className="text-center text-[10px] text-outline-variant uppercase tracking-widest mt-2">
            Powered by Serene Intelligence v4.2
          </p>
        </div>
      </div>
    </>
  );
}
