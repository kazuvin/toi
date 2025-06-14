import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { Context } from "hono";
import {
  createSource,
  getSourceById,
  getSources,
  updateSource,
} from "@/services/sources";
import { getFlashcardsBySourceId } from "@/services/flashcard";
import { zValidator } from "@hono/zod-validator";
import {
  GetSourceDetailResponse,
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
    const result = await getSources(db);
    return c.json(result);
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

    const response: PutSourceDetailResponse = {
      id: result[0].id,
      uid: result[0].uid ?? undefined,
      title: result[0].title ?? undefined,
      content: result[0].content,
      type: result[0].type,
      createdAt: result[0].createdAt ?? "",
      updatedAt: result[0].updatedAt ?? "",
    };

    return c.json(response);
  });

app.route("/url", urlRoute);
app.route("/pdf", pdfRoute);

export default app;
