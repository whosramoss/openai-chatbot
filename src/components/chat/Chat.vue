<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useChatStore } from "@/store/chatStore";
import type { ChatStore } from "@/store/types";
import { mapAvatar } from "../../schemas/message";

const store: ChatStore = useChatStore();
const scrollRef = ref<HTMLDivElement | null>(null);

async function scrollToBottom() {
  await nextTick();
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  }
}

watch(
  () => [store.messages.length, store.isLoading] as const,
  () => {
    void scrollToBottom();
  },
);
</script>

<template>
  <div class="chat-card green-drift-bg">
    <div class="chat-header">
      <div class="chat-header-top">
        <h3 class="chat-title">OpenAI Chatbot</h3>
        <button
          type="button"
          class="chat-mock-toggle"
          @click="store.setUseMockResponses(!store.useMockResponses)"
        >
          {{ store.useMockResponses ? "Mock ON" : "Mock OFF" }}
        </button>
      </div>
      <p class="chat-subtitle">Talk a little bit with the AI.</p>
    </div>

    <div class="chat-messages-container">
      <div ref="scrollRef" class="chat-messages-scroll">
        <div
          v-for="message in store.messages"
          :key="message.id"
          class="chat-message-row"
        >
          <div class="chat-message-avatar">
            <img
              :src="mapAvatar[message.role].src"
              :alt="mapAvatar[message.role].alt"
              class="chat-message-avatar-image"
            />
          </div>

          <p class="chat-message-content">
            <span class="chat-message-role">{{
              mapAvatar[message.role].label
            }}</span>
            <span class="chat-message-text">{{ message.content }}</span>
          </p>
        </div>

        <div v-if="store.isLoading" class="chat-message-row">
          <div class="chat-loading-avatar">AI</div>
          <p class="chat-loading-text">Thinking...</p>
        </div>
      </div>
    </div>

    <div class="chat-composer">
      <p v-if="store.errorMessage" class="chat-composer-error">
        {{ store.errorMessage }}
      </p>
      <form class="chat-composer-form" @submit="store.submit">
        <input
          :value="store.input"
          :disabled="store.isLoading"
          placeholder="How can I help you?"
          class="chat-composer-input"
          @input="store.setInput(($event.target as HTMLInputElement).value)"
        />
        <button
          type="submit"
          :disabled="store.isLoading"
          class="chat-composer-button"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>
