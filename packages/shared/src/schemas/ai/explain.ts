import { z } from "zod";

export const explainExampleSchema = z.object({
  english: z.string(),
  japanese: z.string(),
});

export const explainRequestSchema = z.object({
  expression: z.string(),
  language: z.string().optional(),
});

export const explainContentSchema = z.object({
  translation: z.string(),
  pronunciation: z.string(),
  grammar: z.string(),
  usage: z.string(),
  examples: z.array(explainExampleSchema),
});

export const explainHistoryItemSchema = z.object({
  id: z.string(),
  expression: z.string(),
  explanation: explainContentSchema,
  createdAt: z.string().nullable(),
});

export type ExplainExample = z.infer<typeof explainExampleSchema>;
export type ExplainRequestBody = z.infer<typeof explainRequestSchema>;
export type ExplainContent = z.infer<typeof explainContentSchema>;
export type ExplainHistoryResponse = z.infer<typeof explainHistoryItemSchema>[];
export type ExplainResponse = z.infer<typeof explainHistoryItemSchema>;
