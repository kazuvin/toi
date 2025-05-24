import { z } from "zod";

/**
 * 音声文字起こしリクエスト
 */
export const PostTranscribeBodySchema = z.object({
  // 音声ファイルのバイナリデータをBase64エンコードした文字列
  audio: z.string(),
  // 音声ファイルの言語
  language: z.string().optional(),
});

export type PostTranscribeBody = z.infer<typeof PostTranscribeBodySchema>;

/**
 * 音声文字起こしレスポンス
 */
export const PostTranscribeResponseSchema = z.object({
  text: z.string(),
});

export type PostTranscribeResponse = z.infer<
  typeof PostTranscribeResponseSchema
>;
