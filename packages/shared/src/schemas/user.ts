import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * ログインユーザー情報レスポンス
 */
export const GetLoginUserResponseSchema = z.object({
  uid: z.string(),
  email: z.string().nullable(),
  displayName: z.string(),
  photoURL: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userType: z.enum(["anonymous", "registered"]),
  subscriptionPlan: z.enum(["pro"]).nullable(),
  subscriptionExpiresAt: z.string().nullable(),
  isAdmin: z.boolean(),
});

export type GetLoginUserResponse = z.infer<typeof GetLoginUserResponseSchema>;

/**
 * ユーザー情報追加リクエスト
 */
export const PostUserBodySchema = z.object({
  uid: z.string(),
  email: z.string().optional(),
  displayName: z.string().optional(),
  photoUrl: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  userType: z.enum(["ANONYMOUS", "REGISTERED"]),
  subscriptionPlan: z.enum(["Pro"]).optional(),
  subscriptionExpiresAt: z.string().optional(),
  isAdmin: z.boolean(),
});

export type PostUserBody = z.infer<typeof PostUserBodySchema>;
