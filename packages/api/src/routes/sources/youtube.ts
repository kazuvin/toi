import { Hono } from "hono";
import { nanoid } from "nanoid";
import { zValidator } from "@hono/zod-validator";
import { PostSourceFromYoutubeBodySchema } from "@toi/shared";
import { Database } from "../../index";
import { insertSource } from "../../services/sources";
import { extractTextFromYoutube } from "../../services/youtube-content";

const app = new Hono<{ Bindings: Database }>();

app.post("/", zValidator("json", PostSourceFromYoutubeBodySchema), async (c) => {
  const body = c.req.valid("json");
  const uid = c.get("uid");

  try {
    // YouTubeからテキストコンテンツを抽出
    const textContent = await extractTextFromYoutube(body.url);

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
    console.error("YouTube処理エラー:", error);
    return c.json({ error: "YouTubeの処理中にエラーが発生しました" }, 500);
  }
});

export default app;