import { z } from "zod";

/**
 * ソース詳細取得のレスポンススキーマ
 */
export const GetSourceDetailResponseSchema = z.object({
  id: z.string(),
  uid: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  type: z.literal("TEXT"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * ソース詳細取得のレスポンスの型
 */
export type GetSourceDetailResponse = z.infer<
  typeof GetSourceDetailResponseSchema
>;

/**
 * ソース一覧取得のレスポンススキーマ
 */
export const GetSourcesResponseSchema = z.array(GetSourceDetailResponseSchema);

/**
 * ソース一覧取得のレスポンスの型
 */
export type GetSourcesResponse = z.infer<typeof GetSourcesResponseSchema>;

/**
 * ソースIDによる取得のレスポンススキーマ
 */
export const GetSourceByIdResponseSchema = GetSourceDetailResponseSchema;

/**
 * ソースIDによる取得のレスポンスの型
 */
export type GetSourceByIdResponse = z.infer<typeof GetSourceByIdResponseSchema>;

/**
 * ソース作成 (POST) のリクエストボディスキーマ
 */
export const PostSourceBodySchema = z.object({
  content: z.string(),
  type: z.literal("TEXT"),
});

/**
 * ソース作成 (POST) のリクエストボディの型
 */
export type PostSourceBody = z.infer<typeof PostSourceBodySchema>;

/**
 * ソース作成 (POST) のレスポンススキーマ
 */
export const PostSourceDetailResponseSchema = GetSourceDetailResponseSchema;

/**
 * ソース作成 (POST) のレスポンスの型
 */
export type PostSourceDetailResponse = z.infer<
  typeof PostSourceDetailResponseSchema
>;

/**
 * ソース更新 (PUT) のリクエストボディスキーマ
 */
export const PutSourceBodySchema = z.object({
  content: z.string(),
  type: z.literal("TEXT"),
});

/**
 * ソース更新 (PUT) のリクエストボディの型
 */
export type PutSourceBody = z.infer<typeof PutSourceBodySchema>;

/**
 * ソース更新 (PUT) のレスポンススキーマ
 */
export const PutSourceDetailResponseSchema = GetSourceDetailResponseSchema;

/**
 * ソース更新 (PUT) のレスポンスの型
 */
export type PutSourceDetailResponse = z.infer<
  typeof PutSourceDetailResponseSchema
>;

/**
 * フラッシュカードのスキーマ
 */
export const flashcardSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

/**
 * フラッシュカード作成 (POST) のリクエストボディスキーマ
 */
export const postFlashcardRequestBody = z.object({
  sourceId: z.string(),
});

/**
 * フラッシュカード作成 (POST) のレスポンススキーマ
 */
export const postFlashcardResponseSchema = z.object({
  flashcards: z.array(flashcardSchema),
});

/**
 * フラッシュカードの型
 */
export type Flashcard = z.infer<typeof flashcardSchema>;

/**
 * フラッシュカード作成 (POST) のリクエストボディの型
 */
export type PostFlashcardRequestBody = z.infer<typeof postFlashcardRequestBody>;

/**
 * フラッシュカード作成 (POST) のレスポンスの型
 */
export type PostFlashcardResponse = z.infer<typeof postFlashcardResponseSchema>;

/**
 * source (GET /sources/[id]/flashcards) のレスポンススキーマ
 */
export const getSourceFlashcardsResponseSchema = z.object({
  flashcards: z.array(
    z.object({
      id: z.string(),
      sourceId: z.string(),
      question: z.string(),
      answer: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
});

/**
 * source (GET /sources/[id]/flashcards) のレスポンスの型
 */
export type GetSourceFlashcardsResponse = z.infer<
  typeof getSourceFlashcardsResponseSchema
>;
