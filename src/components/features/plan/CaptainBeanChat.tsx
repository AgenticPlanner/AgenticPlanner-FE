import { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types';
import { ChatBubble, ChatInput } from '@/components/common';
import { suggestionChips } from '@/data/tripData';

interface CaptainBeanChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isStreaming?: boolean;
  onUnmount?: () => void;
}

// 스트리밍 중 표시되는 점 애니메이션
function StreamingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export default function CaptainBeanChat({
  messages,
  onSendMessage,
  isStreaming = false,
  onUnmount,
}: CaptainBeanChatProps) {
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const onUnmountRef = useRef(onUnmount);
  onUnmountRef.current = onUnmount;

  // 새 메시지 or 스트리밍 청크마다 최하단 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // unmount 시에만 스트리밍 중단 (onUnmount 참조 변경에 반응하지 않음)
  useEffect(() => {
    return () => {
      onUnmountRef.current?.();
    };
  }, []);

  const handleSubmit = () => {
    if (!inputValue.trim() || isStreaming) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  // 스트리밍 중인 마지막 AI 메시지가 비어 있으면 dots 표시
  const lastMsg = messages[messages.length - 1];
  const showDots = isStreaming && lastMsg?.role === 'ai' && lastMsg.content === '';

  return (
    <div className="flex-1 flex flex-col bg-surface-container-lowest relative min-h-0">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={msg.id}>
            <ChatBubble message={msg} />
            {/* Suggestion chips after first AI message when no other messages exist */}
            {idx === 0 && messages.length === 1 && (
              <div className="ml-14 mt-4 flex flex-wrap gap-3">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => onSendMessage(chip)}
                    disabled={isStreaming}
                    className="text-xs bg-white border border-surface-container px-4 py-2 rounded-full text-on-surface-variant hover:border-primary transition-colors font-body disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 스트리밍 점 애니메이션 (빈 AI 메시지 대기 중) */}
        {showDots && <StreamingDots />}

        {/* 자동 스크롤 앵커 */}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-6 md:p-10 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest to-transparent">
        <div className="max-w-3xl mx-auto space-y-3">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            disabled={isStreaming}
          />
          <p className="text-center text-[10px] text-outline-variant uppercase tracking-widest">
            Serene Intelligence v4.2 기반
          </p>
        </div>
      </div>
    </div>
  );
}
