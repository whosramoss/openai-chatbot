import { createPinia, defineStore, type Pinia } from "pinia";
import { actions } from "astro:actions";
import type { ChatStore, ChatStoreState } from "./types";
import {
  CHAT_ERROR_MESSAGES,
  createUserMessage,
  getNextMockAssistantResponse,
  setErrorState,
  setSubmittingState,
  setSuccessState,
  toApiMessages,
} from "./helpers";

export type { ChatStore } from "./types";

const initialState = (): ChatStoreState => ({
  messages: [],
  input: "",
  isLoading: false,
  errorMessage: null,
  useMockResponses: false,
  mockResponseIndex: 0,
});

export const useChatPiniaStore = defineStore("chat", {
  state: initialState,

  actions: {
    setInput(value: string) {
      this.input = value;
      if (this.errorMessage) this.errorMessage = null;
    },

    setUseMockResponses(value: boolean) {
      this.useMockResponses = value;
    },

    async submit(e: Event) {
      e.preventDefault();

      const text = this.input.trim();
      if (!text || this.isLoading) return;

      const patchState = (patch: Partial<ChatStoreState>) => this.$patch(patch);
      const userMessage = createUserMessage(text);

      setSubmittingState(patchState, this.messages, userMessage);

      if (this.useMockResponses) {
        const { content, nextIndex } = getNextMockAssistantResponse(
          this.mockResponseIndex,
        );
        setSuccessState(patchState, this.messages, content);
        this.mockResponseIndex = nextIndex;
        return;
      }

      try {
        const { data, error } = await actions.chat({
          messages: toApiMessages(this.messages),
        });

        if (!error && data) {
          setSuccessState(patchState, this.messages, data.content);
        } else {
          setErrorState(patchState, CHAT_ERROR_MESSAGES.action);
        }
      } catch {
        setErrorState(patchState, CHAT_ERROR_MESSAGES.unexpected);
      }
    },
  },
});

let piniaInstance: Pinia | null = null;

const getPiniaInstance = (): Pinia => {
  if (!piniaInstance) piniaInstance = createPinia();
  return piniaInstance;
};

/** Retorna a store do chat já conectada a uma instância singleton do Pinia. */
export function useChatStore(): ChatStore {
  return useChatPiniaStore(getPiniaInstance());
}
