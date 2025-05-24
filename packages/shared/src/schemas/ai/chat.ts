import { z } from "zod";

/**
 * メッセージの共通スキーマ
 */
export const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  translation: z.string().optional(),
  feedback: z.string().optional(),
});

/**
 * メッセージの共通型
 */
export type Message = z.infer<typeof messageSchema>;

/**
 * チャットリクエストのスキーマ
 */
export const chatRequestSchema = z.object({
  aiRole: z.string(),
  userRole: z.string(),
  situation: z.string(),
  learningContent: z.string(),
  messages: z.array(messageSchema).max(2),
});

/**
 * チャットレスポンスのスキーマ
 */
export const chatResponseSchema = messageSchema.extend({
  role: z.literal("assistant"),
});

/**
 * チャットリクエストの型
 */
export type ChatRequest = z.infer<typeof chatRequestSchema>;

/**
 * チャットレスポンスの型
 */
export type ChatResponse = z.infer<typeof chatResponseSchema>;
