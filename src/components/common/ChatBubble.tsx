import type { ChatMessage } from '@/types';

interface ChatBubbleProps {
  message: ChatMessage;
  avatarSrc?: string;
}

function renderContent(content: string) {
  return content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatBubble({ message, avatarSrc = '' }: ChatBubbleProps) {
  if (message.role === 'ai') {
    return (
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
          {avatarSrc ? (
            <img src={avatarSrc} alt="Captain Bean AI" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-on-primary-fixed text-lg">smart_toy</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-outline-variant uppercase tracking-wider font-semibold">
              Captain Bean
            </span>
            <span className="text-[10px] text-outline-variant uppercase tracking-wider">
              · {message.timestamp}
            </span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl rounded-tl-none shadow-sm">
            <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
              {renderContent(message.content)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-none max-w-xs">
        <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p className="text-[10px] uppercase tracking-wider mt-2 opacity-70">{message.timestamp}</p>
      </div>
    </div>
  );
}
