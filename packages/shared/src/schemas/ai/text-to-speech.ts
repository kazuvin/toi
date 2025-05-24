import { z } from "zod";

export const PostTextToSpeechBodySchema = z.object({
  text: z.string().min(1, "テキストは必須です"),
  language: z.string(),
});

export const PostTextToSpeechResponseSchema = z.object({
  audioContent: z.string(),
});

export type PostTextToSpeechBody = z.infer<typeof PostTextToSpeechBodySchema>;
export type PostTextToSpeechResponse = z.infer<
  typeof PostTextToSpeechResponseSchema
>;
