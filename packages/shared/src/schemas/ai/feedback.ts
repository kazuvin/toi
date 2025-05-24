import { z } from "zod";

export const postFeedbackBodySchema = z.object({
  previousMessage: z.string().optional(),
  userMessage: z.string(),
});

export const feedbackResponseSchema = z.object({
  overall: z.object({
    score: z.number().min(0).max(100),
    summary: z.string(),
  }),
  grammar: z.object({
    score: z.number().min(0).max(100),
    issues: z.array(
      z.object({
        type: z.enum(["grammar", "vocabulary", "punctuation", "spelling"]),
        description: z.string(),
        correction: z.object({
          en: z.string(),
          ja: z.string(),
        }),
      })
    ),
  }),
  context: z.object({
    score: z.number().min(0).max(100),
    comments: z.string(),
  }),
  improvements: z.object({
    correctedMessage: z
      .object({
        en: z.string(),
        ja: z.string(),
      })
      .optional(),
    alternativePhrasings: z.array(
      z.object({
        en: z.string(),
        ja: z.string(),
      })
    ),
  }),
});

export type PostFeedbackBody = z.infer<typeof postFeedbackBodySchema>;
export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;
