import { useState } from 'react';
import type { ChatMessage } from '@/types';
import { ChatBubble, ChatInput } from '@/components/common';
import { suggestionChips } from '@/data/tripData';

interface CaptainBeanChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

export default function CaptainBeanChat({ messages, onSendMessage }: CaptainBeanChatProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col bg-surface-container-lowest relative min-h-0">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={msg.id}>
            <ChatBubble message={msg} />
            {/* Suggestion chips after first message */}
            {idx === 0 && messages.length === 1 && (
              <div className="ml-14 mt-4 flex flex-wrap gap-3">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => onSendMessage(chip)}
                    className="text-xs bg-white border border-surface-container px-4 py-2 rounded-full text-on-surface-variant hover:border-primary transition-colors font-body"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-6 md:p-10 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest to-transparent">
        <div className="max-w-3xl mx-auto space-y-3">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
          />
          <p className="text-center text-[10px] text-outline-variant uppercase tracking-widest">
            Powered by Serene Intelligence v4.2
          </p>
        </div>
      </div>
    </div>
  );
}
