import { useChatContext } from '@/contexts/ChatContext';

// 기존 사용처(PlanPage 등)의 인터페이스를 유지하면서 ChatContext에 위임
export const useAgentChat = () => {
  const { messages, isStreaming, sendMessage, stopStreaming, initSession, startSession } = useChatContext();
  return { messages, isStreaming, sendMessage, stopStreaming, initSession, startSession };
};
