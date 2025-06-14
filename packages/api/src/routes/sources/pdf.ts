import { Hono } from "hono";
import { nanoid } from "nanoid";
import { zValidator } from "@hono/zod-validator";
import { PostSourceFromPdfBodySchema } from "@toi/shared";
import { Database } from "../../index";
import { insertSource } from "../../services/sources";
import { extractTextFromPdf } from "../../services/pdf-content";

const app = new Hono<{ Bindings: Database }>();

app.post("/", zValidator("json", PostSourceFromPdfBodySchema), async (c) => {
  const body = c.req.valid("json");
  const uid = c.get("uid");

  try {
    // PDFからテキストコンテンツを抽出
    const textContent = await extractTextFromPdf(body.fileContent);

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
    console.error("PDF処理エラー:", error);
    return c.json({ error: "PDFの処理中にエラーが発生しました" }, 500);
  }
});

export default app;