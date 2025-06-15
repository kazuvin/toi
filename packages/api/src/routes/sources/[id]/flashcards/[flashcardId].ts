import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { Context } from "hono";
import { DrizzleError } from "drizzle-orm";
import { updateFlashcard } from "../../../../services/flashcard";
import { putFlashcardRequestBodySchema, putFlashcardResponseSchema } from "@toi/shared/src/schemas/source";

type Bindings = {
  DB: D1Database;
};

type Variables = {
  uid: string;
};

type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;

// エラーハンドラー
const errorHandler = async (err: Error, c: AppContext) => {
  if (err instanceof DrizzleError) {
    if (err.message === "Flashcard not found") {
      return c.json({ message: err.message }, 404);
    }
    return c.json({ message: err.message }, 400);
  }
  return c.json({ message: "Server Error" }, 500);
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.onError(errorHandler);

app.put("/", async (c) => {
  const db = drizzle(c.env.DB);
  const flashcardId = c.req.param("flashcardId");

  if (!flashcardId) {
    return c.json({ message: "Flashcard ID is required" }, 400);
  }

  try {
    const body = await c.req.json();
    const parsedBody = putFlashcardRequestBodySchema.parse(body);

    const updatedFlashcard = await updateFlashcard(
      db,
      flashcardId,
      parsedBody.question,
      parsedBody.answer
    );

    const response = putFlashcardResponseSchema.parse(updatedFlashcard);
    return c.json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    return c.json({ message: "Invalid request body" }, 400);
  }
});

export default app;