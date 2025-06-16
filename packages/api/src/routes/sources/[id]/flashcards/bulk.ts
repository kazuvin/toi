import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { putFlashcardsBulkRequestBodySchema, putFlashcardsBulkResponseSchema } from "@toi/shared/src/schemas/source";
import { updateFlashcardsBulk } from "@/services/flashcard";

const app = new Hono<{
  Bindings: {
    DB: D1Database;
  };
}>();

app.put(
  "/",
  zValidator("json", putFlashcardsBulkRequestBodySchema),
  async (c) => {
    try {
      const { flashcards } = c.req.valid("json");
      const sourceId = c.req.param("id");

      const updatedFlashcards = await updateFlashcardsBulk(
        c.env.DB,
        sourceId,
        flashcards
      );

      const response = putFlashcardsBulkResponseSchema.parse({
        updatedCount: updatedFlashcards.length,
        flashcards: updatedFlashcards,
      });

      return c.json(response);
    } catch (error) {
      console.error("Failed to update flashcards in bulk:", error);
      return c.json(
        { error: "Failed to update flashcards" },
        500
      );
    }
  }
);

export default app;