import type { ChatMessage } from "../schemas/message";
import type { ChatSetState } from "./chatStore.types";

export const CHAT_ERROR_MESSAGES = {
  action: "It was not possible to obtain the answer now. Try again.",
  unexpected: "Unexpected error sending message. Try again.",
} as const;

export const createUserMessage = (content: string): ChatMessage => {
  return {
    id: crypto.randomUUID(),
    role: "user",
    content,
  };
};

export const toApiMessages = (messages: ChatMessage[]) => {
  return messages.map(({ role, content }) => ({ role, content }));
};

export const getNextMockAssistantResponse = (
  currentIndex: number,
): { content: string; nextIndex: number } => {
  const MOCK_ASSISTANT_RESPONSES = [
    "Sure! I can help with that. Tell me a bit more about what you want to achieve.",
    "Great question. A practical next step is to break this into smaller tasks and validate each one.",
    "Nice progress so far. If you want, I can also provide a cleaner version optimized for readability.",
    "I'm here to help! What would you like to know?",
    "Of course! I'm here to assist you.",
  ] as const;

  const safeIndex = currentIndex % MOCK_ASSISTANT_RESPONSES.length;
  const content = MOCK_ASSISTANT_RESPONSES[safeIndex];
  const nextIndex = (safeIndex + 1) % MOCK_ASSISTANT_RESPONSES.length;
  return { content, nextIndex };
};

export const setSubmittingState = (
  set: ChatSetState,
  messages: ChatMessage[],
  userMessage: ChatMessage,
): void => {
  set({
    messages: [...messages, userMessage],
    input: "",
    isLoading: true,
    errorMessage: null,
  });
};

export const setSuccessState = (
  set: ChatSetState,
  messages: ChatMessage[],
  content: string,
): void => {
  const assistantMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
  };
  set({
    messages: [...messages, assistantMessage],
    isLoading: false,
    errorMessage: null,
  });
};

export const setErrorState = (set: ChatSetState, message: string): void => {
  set({
    isLoading: false,
    errorMessage: message,
  });
};
