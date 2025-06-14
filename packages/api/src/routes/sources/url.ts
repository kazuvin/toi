import { Hono } from "hono";
import { nanoid } from "nanoid";
import { zValidator } from "@hono/zod-validator";
import { PostSourceFromUrlBodySchema } from "@toi/shared";
import { Database } from "../../index";
import { insertSource } from "../../services/sources";
import { fetchContentFromUrl } from "../../services/url-content";

const app = new Hono<{ Bindings: Database }>();

app.post("/", zValidator("json", PostSourceFromUrlBodySchema), async (c) => {
  const body = c.req.valid("json");
  const uid = c.get("uid");

  try {
    // URLからコンテンツを取得
    const textContent = await fetchContentFromUrl(body.url);

    // ソースを作成
    const sourceId = nanoid();
    const source = await insertSource(c.env.DB, {
      id: sourceId,
      uid,
      content: textContent,
      type: "TEXT" as const,
    });

    return c.json(source);
  } catch (error) {
    console.error("URL処理エラー:", error);
    return c.json({ error: "URLの処理中にエラーが発生しました" }, 500);
  }
});

export default app;