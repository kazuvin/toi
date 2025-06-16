import { z } from "zod";

/**
 * ソース詳細取得のレスポンススキーマ
 */
export const GetSourceDetailResponseSchema = z.object({
  id: z.string(),
  uid: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  isFlashcardGenerated: z.boolean().optional(),
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
 * URL からソース作成 (POST) のリクエストボディスキーマ
 */
export const PostSourceFromUrlBodySchema = z.object({
  url: z.string().url(),
});

/**
 * PDF からソース作成 (POST) のリクエストボディスキーマ
 */
export const PostSourceFromPdfBodySchema = z.object({
  fileName: z.string(),
  fileContent: z.string(), // base64 encoded PDF content
});

/**
 * ソース作成 (POST) のリクエストボディの型
 */
export type PostSourceBody = z.infer<typeof PostSourceBodySchema>;

/**
 * URL からソース作成 (POST) のリクエストボディの型
 */
export type PostSourceFromUrlBody = z.infer<typeof PostSourceFromUrlBodySchema>;

/**
 * PDF からソース作成 (POST) のリクエストボディの型
 */
export type PostSourceFromPdfBody = z.infer<typeof PostSourceFromPdfBodySchema>;

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

/**
 * タイトル生成 (POST) のリクエストボディスキーマ
 */
export const postTitleRequestBody = z.object({
  sourceId: z.string(),
});

/**
 * タイトル生成 (POST) のレスポンススキーマ
 */
export const postTitleResponseSchema = z.object({
  title: z.string(),
});

/**
 * タイトル生成 (POST) のリクエストボディの型
 */
export type PostTitleRequestBody = z.infer<typeof postTitleRequestBody>;

/**
 * タイトル生成 (POST) のレスポンスの型
 */
export type PostTitleResponse = z.infer<typeof postTitleResponseSchema>;

/**
 * フラッシュカード更新 (PUT) のリクエストボディスキーマ
 */
export const putFlashcardRequestBodySchema = z.object({
  question: z.string(),
  answer: z.string(),
});

/**
 * フラッシュカード更新 (PUT) のレスポンススキーマ
 */
export const putFlashcardResponseSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  question: z.string(),
  answer: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * フラッシュカード更新 (PUT) のリクエストボディの型
 */
export type PutFlashcardRequestBody = z.infer<typeof putFlashcardRequestBodySchema>;

/**
 * フラッシュカード更新 (PUT) のレスポンスの型
 */
export type PutFlashcardResponse = z.infer<typeof putFlashcardResponseSchema>;

/**
 * ソース削除 (DELETE) のレスポンススキーマ
 */
export const DeleteSourceResponseSchema = z.object({
  message: z.string(),
});

/**
 * ソース削除 (DELETE) のレスポンスの型
 */
export type DeleteSourceResponse = z.infer<typeof DeleteSourceResponseSchema>;

/**
 * フラッシュカード一括更新 (PUT) のリクエストボディスキーマ
 */
export const putFlashcardsBulkRequestBodySchema = z.object({
  flashcards: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      answer: z.string(),
    })
  ),
});

/**
 * フラッシュカード一括更新 (PUT) のレスポンススキーマ
 */
export const putFlashcardsBulkResponseSchema = z.object({
  updatedCount: z.number(),
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
 * フラッシュカード一括更新 (PUT) のリクエストボディの型
 */
export type PutFlashcardsBulkRequestBody = z.infer<typeof putFlashcardsBulkRequestBodySchema>;

/**
 * フラッシュカード一括更新 (PUT) のレスポンスの型
 */
export type PutFlashcardsBulkResponse = z.infer<typeof putFlashcardsBulkResponseSchema>;
