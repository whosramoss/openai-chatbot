import type { ChatMessage } from "../schemas/message";

export type ChatStoreState = {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  errorMessage: string | null;
  useMockResponses: boolean;
  mockResponseIndex: number;
};

export type ChatStoreActions = {
  setInput: (value: string) => void;
  setUseMockResponses: (value: boolean) => void;
  submit: (e: Event) => Promise<void>;
};

export type ChatStore = ChatStoreState & ChatStoreActions;
export type ChatPatchState = (patch: Partial<ChatStoreState>) => void;
