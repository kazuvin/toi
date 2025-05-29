// src/schemas/user.ts
import { z } from "zod";
var UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});
var GetLoginUserResponseSchema = z.object({
  uid: z.string(),
  email: z.string().nullable(),
  displayName: z.string(),
  photoURL: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userType: z.enum(["anonymous", "registered"]),
  subscriptionPlan: z.enum(["pro"]).nullable(),
  subscriptionExpiresAt: z.string().nullable(),
  isAdmin: z.boolean()
});
var PostUserBodySchema = z.object({
  uid: z.string(),
  email: z.string().optional(),
  displayName: z.string().optional(),
  photoUrl: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  userType: z.enum(["ANONYMOUS", "REGISTERED"]),
  subscriptionPlan: z.enum(["Pro"]).optional(),
  subscriptionExpiresAt: z.string().optional(),
  isAdmin: z.boolean()
});

// src/schemas/ai/chat.ts
import { z as z2 } from "zod";
var messageSchema = z2.object({
  role: z2.enum(["user", "assistant"]),
  content: z2.string(),
  translation: z2.string().optional(),
  feedback: z2.string().optional()
});
var chatRequestSchema = z2.object({
  aiRole: z2.string(),
  userRole: z2.string(),
  situation: z2.string(),
  learningContent: z2.string(),
  messages: z2.array(messageSchema).max(2)
});
var chatResponseSchema = messageSchema.extend({
  role: z2.literal("assistant")
});

// src/schemas/ai/explain.ts
import { z as z3 } from "zod";
var explainExampleSchema = z3.object({
  english: z3.string(),
  japanese: z3.string()
});
var explainRequestSchema = z3.object({
  expression: z3.string(),
  language: z3.string().optional()
});
var explainContentSchema = z3.object({
  translation: z3.string(),
  pronunciation: z3.string(),
  grammar: z3.string(),
  usage: z3.string(),
  examples: z3.array(explainExampleSchema)
});
var explainHistoryItemSchema = z3.object({
  id: z3.string(),
  expression: z3.string(),
  explanation: explainContentSchema,
  createdAt: z3.string().nullable()
});

// src/schemas/ai/translate.ts
import { z as z4 } from "zod";
var translateRequestSchema = z4.object({
  text: z4.string()
});
var translateResponseSchema = z4.string();

// src/schemas/ai/transcribe.ts
import { z as z5 } from "zod";
var PostTranscribeBodySchema = z5.object({
  // 音声ファイルのバイナリデータをBase64エンコードした文字列
  audio: z5.string(),
  // 音声ファイルの言語
  language: z5.string().optional()
});
var PostTranscribeResponseSchema = z5.object({
  text: z5.string()
});
export {
  GetLoginUserResponseSchema,
  PostTranscribeBodySchema,
  PostTranscribeResponseSchema,
  PostUserBodySchema,
  UserSchema,
  chatRequestSchema,
  chatResponseSchema,
  explainContentSchema,
  explainExampleSchema,
  explainHistoryItemSchema,
  explainRequestSchema,
  messageSchema,
  translateRequestSchema,
  translateResponseSchema
};
//# sourceMappingURL=index.mjs.map