import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { Context } from "hono";
import {
  createSource,
  deleteSource,
  getSourceById,
  getSources,
  updateSource,
} from "@/services/sources";
import { getFlashcardsBySourceId } from "@/services/flashcard";
import { zValidator } from "@hono/zod-validator";
import {
  DeleteSourceResponse,
  GetSourceDetailResponse,
  GetSourcesResponse,
  PostSourceBodySchema,
  PostSourceDetailResponse,
  PutSourceBodySchema,
  PutSourceDetailResponse,
} from "@toi/shared/src/schemas/source";
import { ZodError } from "zod";
import urlRoute from "./sources/url";
import pdfRoute from "./sources/pdf";

type Bindings = {
  DB: D1Database;
};

type Variables = {
  uid: string;
};

type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;

const errorHandler = async (err: Error, c: AppContext) => {
  console.error(err);

  if (err instanceof ZodError) {
    return c.json(
      {
        message: "バリデーションエラー",
        errors: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
      400
    );
  }

  return c.json({ message: "Server Error" }, 500);
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.onError(errorHandler);

app
  .get("/", async (c) => {
    const db = drizzle(c.env.DB);
    const sources = await getSources(db);
    
    // 各ソースに対してフラッシュカードの存在確認
    const sourcesWithFlashcardStatus: GetSourcesResponse = await Promise.all(
      sources.map(async (source) => {
        const flashcards = await getFlashcardsBySourceId(db, source.id);
        return {
          id: source.id,
          uid: source.uid ?? undefined,
          title: source.title ?? undefined,
          content: source.content,
          type: source.type,
          isFlashcardGenerated: flashcards.length > 0,
          createdAt: source.createdAt ?? "",
          updatedAt: source.updatedAt ?? "",
        };
      })
    );
    
    return c.json(sourcesWithFlashcardStatus);
  })
  .get("/:id", async (c) => {
    const db = drizzle(c.env.DB);
    const id = c.req.param("id");
    const result = await getSourceById(db, id);

    if (result.length === 0) {
      return c.json({ message: "Source not found" }, 404);
    }

    const flashcards = await getFlashcardsBySourceId(db, id);

    const response: GetSourceDetailResponse = {
      id: result[0].id,
      uid: result[0].uid ?? undefined,
      title: result[0].title ?? undefined,
      content: result[0].content,
      type: result[0].type,
      isFlashcardGenerated: flashcards.length > 0,
      createdAt: result[0].createdAt ?? "",
      updatedAt: result[0].updatedAt ?? "",
    };

    return c.json(response);
  })
  .post("/", zValidator("json", PostSourceBodySchema), async (c) => {
    const json = c.req.valid("json");
    const db = drizzle(c.env.DB);
    const result = await createSource(db, json);

    const response: PostSourceDetailResponse = {
      id: result[0].id,
      uid: result[0].uid ?? undefined,
      title: result[0].title ?? undefined,
      content: result[0].content,
      type: result[0].type,
      isFlashcardGenerated: false, // 新規作成時はフラッシュカードは未生成
      createdAt: result[0].createdAt ?? "",
      updatedAt: result[0].updatedAt ?? "",
    };

    return c.json(response);
  })
  .put("/:id", zValidator("json", PutSourceBodySchema), async (c) => {
    const id = c.req.param("id");
    const json = c.req.valid("json");
    const db = drizzle(c.env.DB);

    const existingSource = await getSourceById(db, id);
    if (existingSource.length === 0) {
      return c.json({ message: "Source not found" }, 404);
    }

    const result = await updateSource(db, id, json);
    
    // 更新後のフラッシュカード存在状況を確認
    const flashcards = await getFlashcardsBySourceId(db, id);

    const response: PutSourceDetailResponse = {
      id: result[0].id,
      uid: result[0].uid ?? undefined,
      title: result[0].title ?? undefined,
      content: result[0].content,
      type: result[0].type,
      isFlashcardGenerated: flashcards.length > 0,
      createdAt: result[0].createdAt ?? "",
      updatedAt: result[0].updatedAt ?? "",
    };

    return c.json(response);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const db = drizzle(c.env.DB);

    const existingSource = await getSourceById(db, id);
    if (existingSource.length === 0) {
      return c.json({ message: "Source not found" }, 404);
    }

    const result = await deleteSource(db, id);

    if (result.length === 0) {
      return c.json({ message: "Failed to delete source" }, 500);
    }

    const response: DeleteSourceResponse = {
      message: "Source deleted successfully",
    };

    return c.json(response);
  });

app.route("/url", urlRoute);
app.route("/pdf", pdfRoute);

export default app;
