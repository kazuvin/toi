import { z } from "zod";
import { messageSchema } from "./chat";

export const postRecommendBodySchema = z.object({
  messages: z.array(messageSchema),
  aiRole: z.string(),
  userRole: z.string(),
  situation: z.string(),
  learningContent: z.string(),
});

export const recommendResponseSchema = z.object({
  recommendations: z.array(
    z.object({
      en: z.string(),
      ja: z.string(),
    })
  ),
});

export type PostRecommendBody = z.infer<typeof postRecommendBodySchema>;
export type RecommendResponse = z.infer<typeof recommendResponseSchema>;
