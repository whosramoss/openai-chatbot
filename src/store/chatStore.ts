import { createStore } from "zustand/vanilla";
import { actions } from "astro:actions";
import type { ChatStore } from "./chatStore.types";
import {
  CHAT_ERROR_MESSAGES,
  createUserMessage,
  getNextMockAssistantResponse,
  setErrorState,
  setSubmittingState,
  setSuccessState,
  toApiMessages,
} from "./chatStore.helpers";

export type { ChatStore } from "./chatStore.types";

export const chatStore = createStore<ChatStore>((set, get) => ({
  messages: [],
  input: "",
  isLoading: false,
  errorMessage: null,
  useMockResponses: false,
  mockResponseIndex: 0,

  setInput: (value) =>
    set((state) => ({
      input: value,
      errorMessage: state.errorMessage ? null : state.errorMessage,
    })),

  setUseMockResponses: (value) => set({ useMockResponses: value }),

  submit: async (e) => {
    e.preventDefault();
    const { input, isLoading, messages, useMockResponses, mockResponseIndex } =
      get();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = createUserMessage(text);

    setSubmittingState(set, messages, userMessage);

    if (useMockResponses) {
      const { content, nextIndex } =
        getNextMockAssistantResponse(mockResponseIndex);
      setSuccessState(set, get().messages, content);
      set({ mockResponseIndex: nextIndex });
      return;
    }

    try {
      const { data, error } = await actions.chat({
        messages: toApiMessages(get().messages),
      });

      if (!error && data) {
        setSuccessState(set, get().messages, data.content);
      } else {
        setErrorState(set, CHAT_ERROR_MESSAGES.action);
      }
    } catch {
      setErrorState(set, CHAT_ERROR_MESSAGES.unexpected);
    }
  },
}));
