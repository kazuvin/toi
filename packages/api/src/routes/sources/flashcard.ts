import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { Context } from "hono";
import { DrizzleError } from "drizzle-orm";
import { generateFlashcards } from "../../services/flashcard";
import { postFlashcardRequestBody } from "@toi/shared/src/schemas/source";

type Bindings = {
  DB: D1Database;
  ANTHROPIC_API_KEY: string;
};

type Variables = {
  uid: string;
};

type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;

// エラーハンドラー
const errorHandler = async (err: Error, c: AppContext) => {
  if (err instanceof DrizzleError) {
    if (err.message === "Source not found") {
      return c.json({ message: err.message }, 404);
    }
    return c.json({ message: err.message }, 400);
  }
  return c.json({ message: "Server Error" }, 500);
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.onError(errorHandler);

app.post("/", async (c) => {
  try {
    const db = drizzle(c.env.DB);
    // const currentUid = c.get("uid");

    // if (!currentUid) {
    //  return c.json({ message: "Unauthorized access" }, 403);
    //}

    const body = await c.req.json();
    const validatedBody = postFlashcardRequestBody.parse(body);

    const flashcards = await generateFlashcards(
      db,
      validatedBody.sourceId,
      c.env.ANTHROPIC_API_KEY
    );

    return c.json({ flashcards });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Server Error" }, 500);
  }
});

export default app;
