import { useMemo } from 'react';
import type { ChatMessage } from '@/types';
import { parseAgentMessage } from '@/utils/parseAgentMessage';

interface ChatBubbleProps {
  message: ChatMessage;
  avatarSrc?: string;
  isStreaming?: boolean;
  onAction?: (text: string) => void;
}

function renderText(content: string) {
  return content.split('\n').map((line, i) => (
    <p key={i} className="font-body text-sm text-on-surface leading-relaxed">
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} className="font-bold text-primary">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      })}
    </p>
  ));
}

export default function ChatBubble({
  message,
  avatarSrc = '',
  isStreaming = false,
  onAction,
}: ChatBubbleProps) {
  const parsed = useMemo(
    () => (message.role === 'ai' ? parseAgentMessage(message.content) : null),
    [message.content, message.role]
  );

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
            {/* 스트리밍 중 빈 메시지 → 로딩 점 */}
            {isStreaming && message.content === '' ? (
              <div className="flex gap-1 items-center py-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            ) : (
              <>
                {/* 텍스트 영역 */}
                {parsed?.text && (
                  <div className="space-y-1">
                    {renderText(parsed.text)}
                  </div>
                )}

                {/* type === 'concepts' — 컨셉 카드 그리드 */}
                {parsed?.type === 'concepts' && parsed.concepts && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parsed.concepts.map((concept) => (
                      <button
                        key={concept.id}
                        type="button"
                        disabled={!onAction}
                        onClick={() => onAction?.(concept.title)}
                        className="text-left p-4 rounded-xl bg-surface-container-lowest
                                   border border-surface-container-high
                                   hover:border-primary hover:bg-primary-container/10
                                   transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{concept.emoji}</span>
                          <div>
                            <p className="font-headline font-bold text-sm text-on-surface">
                              {concept.title}
                            </p>
                            <p className="text-[10px] text-on-surface-variant">
                              {concept.tagline}
                            </p>
                          </div>
                          {concept.is_discovery && (
                            <span className="ml-auto text-[10px] bg-tertiary-container
                                             text-on-tertiary-container px-2 py-0.5 rounded-full">
                              추천
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">
                          {concept.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {concept.highlights.map((h) => (
                            <span
                              key={h}
                              className="text-[10px] bg-surface-container px-2 py-0.5
                                         rounded-full text-on-surface-variant"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs font-bold text-primary">{concept.budget_range}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* type === 'concept_confirm' — 선택 컨셉 확인 + 진행 버튼 */}
                {parsed?.type === 'concept_confirm' && parsed.selectedConcept && (
                  <div className="mt-3 p-4 rounded-xl bg-primary-container/20
                                  border border-primary-container">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{parsed.selectedConcept.emoji}</span>
                      <div>
                        <p className="font-headline font-bold text-sm">
                          {parsed.selectedConcept.title}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {parsed.selectedConcept.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!onAction}
                        onClick={() => onAction?.('응 그걸로 확정')}
                        className="flex-1 bg-primary text-on-primary py-2 rounded-full
                                   text-xs font-bold hover:opacity-90 transition-opacity
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        이 컨셉으로 확정
                      </button>
                      <button
                        type="button"
                        disabled={!onAction}
                        onClick={() => onAction?.('다른 컨셉 보여줘')}
                        className="flex-1 bg-surface-container-high text-on-secondary-container
                                   py-2 rounded-full text-xs font-semibold
                                   hover:bg-surface-container-highest transition-colors
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다시 선택
                      </button>
                    </div>
                  </div>
                )}

                {/* type === 'plan_confirm' — 플랜 확정 버튼 */}
                {parsed?.type === 'plan_confirm' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={!onAction}
                      onClick={() => onAction?.('응 그걸로 확정')}
                      className="flex-1 bg-primary text-on-primary py-2.5 rounded-full
                                 text-xs font-bold hover:opacity-90 transition-opacity
                                 flex items-center justify-center gap-1
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      일정 확정하기
                    </button>
                    <button
                      type="button"
                      disabled={!onAction}
                      onClick={() => onAction?.('다시 계획해줘')}
                      className="flex-1 bg-surface-container-high text-on-secondary-container
                                 py-2.5 rounded-full text-xs font-semibold
                                 hover:bg-surface-container-highest transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      수정 요청
                    </button>
                  </div>
                )}

                {/* type === 'collection' — 수집 정보 태그 칩 */}
                {parsed?.type === 'collection' && parsed.collected && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(parsed.collected)
                      .filter(([, v]) => v !== null && v !== undefined)
                      .map(([k, v]) => (
                        <span
                          key={k}
                          className="text-[10px] bg-secondary-container
                                     text-on-secondary-container px-3 py-1 rounded-full font-medium"
                        >
                          {String(v)}
                        </span>
                      ))}
                  </div>
                )}
              </>
            )}
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
