var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  GetLoginUserResponseSchema: () => GetLoginUserResponseSchema,
  PostTranscribeBodySchema: () => PostTranscribeBodySchema,
  PostTranscribeResponseSchema: () => PostTranscribeResponseSchema,
  PostUserBodySchema: () => PostUserBodySchema,
  UserSchema: () => UserSchema,
  chatRequestSchema: () => chatRequestSchema,
  chatResponseSchema: () => chatResponseSchema,
  explainContentSchema: () => explainContentSchema,
  explainExampleSchema: () => explainExampleSchema,
  explainHistoryItemSchema: () => explainHistoryItemSchema,
  explainRequestSchema: () => explainRequestSchema,
  messageSchema: () => messageSchema,
  translateRequestSchema: () => translateRequestSchema,
  translateResponseSchema: () => translateResponseSchema
});
module.exports = __toCommonJS(index_exports);

// src/schemas/user.ts
var import_zod = require("zod");
var UserSchema = import_zod.z.object({
  id: import_zod.z.string(),
  email: import_zod.z.string().email(),
  name: import_zod.z.string(),
  createdAt: import_zod.z.date(),
  updatedAt: import_zod.z.date()
});
var GetLoginUserResponseSchema = import_zod.z.object({
  uid: import_zod.z.string(),
  email: import_zod.z.string().nullable(),
  displayName: import_zod.z.string(),
  photoURL: import_zod.z.string().nullable(),
  createdAt: import_zod.z.string().datetime(),
  updatedAt: import_zod.z.string().datetime(),
  userType: import_zod.z.enum(["anonymous", "registered"]),
  subscriptionPlan: import_zod.z.enum(["pro"]).nullable(),
  subscriptionExpiresAt: import_zod.z.string().nullable(),
  isAdmin: import_zod.z.boolean()
});
var PostUserBodySchema = import_zod.z.object({
  uid: import_zod.z.string(),
  email: import_zod.z.string().optional(),
  displayName: import_zod.z.string().optional(),
  photoUrl: import_zod.z.string().optional(),
  createdAt: import_zod.z.string().optional(),
  updatedAt: import_zod.z.string().optional(),
  userType: import_zod.z.enum(["ANONYMOUS", "REGISTERED"]),
  subscriptionPlan: import_zod.z.enum(["Pro"]).optional(),
  subscriptionExpiresAt: import_zod.z.string().optional(),
  isAdmin: import_zod.z.boolean()
});

// src/schemas/ai/chat.ts
var import_zod2 = require("zod");
var messageSchema = import_zod2.z.object({
  role: import_zod2.z.enum(["user", "assistant"]),
  content: import_zod2.z.string(),
  translation: import_zod2.z.string().optional(),
  feedback: import_zod2.z.string().optional()
});
var chatRequestSchema = import_zod2.z.object({
  aiRole: import_zod2.z.string(),
  userRole: import_zod2.z.string(),
  situation: import_zod2.z.string(),
  learningContent: import_zod2.z.string(),
  messages: import_zod2.z.array(messageSchema).max(2)
});
var chatResponseSchema = messageSchema.extend({
  role: import_zod2.z.literal("assistant")
});

// src/schemas/ai/explain.ts
var import_zod3 = require("zod");
var explainExampleSchema = import_zod3.z.object({
  english: import_zod3.z.string(),
  japanese: import_zod3.z.string()
});
var explainRequestSchema = import_zod3.z.object({
  expression: import_zod3.z.string(),
  language: import_zod3.z.string().optional()
});
var explainContentSchema = import_zod3.z.object({
  translation: import_zod3.z.string(),
  pronunciation: import_zod3.z.string(),
  grammar: import_zod3.z.string(),
  usage: import_zod3.z.string(),
  examples: import_zod3.z.array(explainExampleSchema)
});
var explainHistoryItemSchema = import_zod3.z.object({
  id: import_zod3.z.string(),
  expression: import_zod3.z.string(),
  explanation: explainContentSchema,
  createdAt: import_zod3.z.string().nullable()
});

// src/schemas/ai/translate.ts
var import_zod4 = require("zod");
var translateRequestSchema = import_zod4.z.object({
  text: import_zod4.z.string()
});
var translateResponseSchema = import_zod4.z.string();

// src/schemas/ai/transcribe.ts
var import_zod5 = require("zod");
var PostTranscribeBodySchema = import_zod5.z.object({
  // 音声ファイルのバイナリデータをBase64エンコードした文字列
  audio: import_zod5.z.string(),
  // 音声ファイルの言語
  language: import_zod5.z.string().optional()
});
var PostTranscribeResponseSchema = import_zod5.z.object({
  text: import_zod5.z.string()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map