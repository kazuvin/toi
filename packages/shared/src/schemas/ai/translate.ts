import { z } from "zod";

export const translateRequestSchema = z.object({
  text: z.string(),
});

export const translateResponseSchema = z.string();

export type TranslateRequestBody = z.infer<typeof translateRequestSchema>;
export type TranslateResponse = z.infer<typeof translateResponseSchema>;
