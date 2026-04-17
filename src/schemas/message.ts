import { z } from "zod";

export const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

export const chatActionInputSchema = z.object({
  messages: z.array(messageSchema),
});

export type ApiMessage = z.infer<typeof messageSchema>;

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ChatMessageAvatar = {
  src: string;
  alt: string;
  label: string;
};

export const mapAvatar: Record<ChatMessage["role"], ChatMessageAvatar> = {
  user: {
    src: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
    alt: "User avatar",
    label: "You",
  },
  assistant: {
    src: "https://github.com/openai.png",
    alt: "AI avatar",
    label: "AI",
  },
};
