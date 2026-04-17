import { reactive, onScopeDispose } from "vue";
import { chatStore } from "./chatStore";
import type { ChatStore } from "./chatStore";

/**  Sincroniza a store vanilla do Zustand com a reatividade do Vue.. */
export function useChatStore(): ChatStore {
  const state = reactive({ ...chatStore.getState() }) as ChatStore;

  const unsub = chatStore.subscribe(() => {
    Object.assign(state, chatStore.getState());
  });

  onScopeDispose(unsub);
  return state;
}
