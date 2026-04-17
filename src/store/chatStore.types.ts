import type { StateCreator } from "zustand/vanilla";
import type { ChatMessage } from "../schemas/message";

export type ChatStore = {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  errorMessage: string | null;
  useMockResponses: boolean;
  mockResponseIndex: number;
  setInput: (value: string) => void;
  setUseMockResponses: (value: boolean) => void;
  submit: (e: Event) => Promise<void>;
};

export type ChatSetState = Parameters<StateCreator<ChatStore>>[0];
