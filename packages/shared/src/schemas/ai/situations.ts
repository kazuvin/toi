import { z } from "zod";

/**
 * シチュエーション
 */
export const situationSchema = z.object({
  title: z.string(),
  aiRole: z.string(),
  userRole: z.string(),
  situation: z.string(),
});

/**
 * シチュエーションの型
 */
export type Situation = z.infer<typeof situationSchema>;

/**
 * シチュエーションリクエストのスキーマ
 */
export const situationRequestSchema = z.object({
  expression: z.string(),
});

/**
 * シチュエーションレスポンスのスキーマ
 */
export const situationResponseSchema = z.object({
  situations: z.array(situationSchema),
});

/**
 * シチュエーションリクエストの型
 */
export type SituationRequest = z.infer<typeof situationRequestSchema>;

/**
 * シチュエーションレスポンスの型
 */
export type SituationResponse = z.infer<typeof situationResponseSchema>;
