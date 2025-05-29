import { z } from "zod";

export const GetSourceDetailResponseSchema = z.object({
  id: z.string(),
  uid: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  type: z.literal("TEXT"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type GetSourceDetailResponse = z.infer<
  typeof GetSourceDetailResponseSchema
>;

export const GetSourcesResponseSchema = z.array(GetSourceDetailResponseSchema);

export type GetSourcesResponse = z.infer<typeof GetSourcesResponseSchema>;

export const GetSourceByIdResponseSchema = GetSourceDetailResponseSchema;

export type GetSourceByIdResponse = z.infer<typeof GetSourceByIdResponseSchema>;

export const PostSourceBodySchema = z.object({
  content: z.string(),
  type: z.literal("TEXT"),
});

export type PostSourceBody = z.infer<typeof PostSourceBodySchema>;
