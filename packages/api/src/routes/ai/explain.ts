import { Hono } from "hono";
import { ExplainRequestBody } from "@parrot-buddy/shared/src/schemas/ai/explain";
import {
  explainExpression,
  getExplainHistory,
  getExplainHistoryById,
} from "@/services/ai/explain";
import { getFirebaseToken } from "@hono/firebase-auth";

type Bindings = {
  ANTHROPIC_API_KEY: string;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// 説明履歴を取得するエンドポイント
app.get("/history", async (c) => {
  try {
    const idToken = getFirebaseToken(c);

    if (!idToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const uid = idToken.uid;
    const history = await getExplainHistory(uid, c.env.DB);
    return c.json(history);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// 特定のIDの説明履歴を取得するエンドポイント
app.get("/:id", async (c) => {
  try {
    const idToken = getFirebaseToken(c);

    if (!idToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const uid = idToken.uid;
    const history = await getExplainHistoryById(id, uid, c.env.DB);

    if (!history) {
      return c.json({ error: "History not found" }, 404);
    }

    return c.json(history);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// 英語表現の説明を生成するエンドポイント
app.post("/", async (c) => {
  try {
    const body = await c.req.json<ExplainRequestBody>();

    if (!body.expression) {
      return c.json({ error: "expression is required" }, 400);
    }

    // ユーザーIDを取得（認証されている場合）
    const idToken = getFirebaseToken(c);
    const uid = idToken?.uid;

    if (!uid) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const result = await explainExpression(
      body.expression,
      c.env.ANTHROPIC_API_KEY,
      uid,
      c.env.DB
    );
    return c.json(result);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
