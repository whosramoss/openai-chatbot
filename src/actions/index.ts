import { defineAction } from "astro:actions";
import OpenAI from "openai";
import { chatActionInputSchema } from "../schemas/message";

export const server = {
  chat: defineAction({
    input: chatActionInputSchema,
    handler: async ({ messages }) => {
      const apiKey = import.meta.env.OPENAI_API_KEY;

      if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set");
      }

      const openai = new OpenAI({ apiKey });

      const defaultModel = "gpt-3.5-turbo";
      const model = import.meta.env.OPENAI_MODEL?.trim() || defaultModel;

      const response = await openai.chat.completions.create({
        model,
        messages,
      });

      const content = response.choices[0]?.message?.content ?? "";

      return { content };
    },
  }),
};
