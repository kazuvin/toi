import { Hono } from "hono";
import { getSituations } from "@/services/ai/situations";
import { zValidator } from "@hono/zod-validator";
import { situationRequestSchema } from "@parrot-buddy/shared/src/schemas/ai/situations";

type Bindings = {
  ANTHROPIC_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", zValidator("json", situationRequestSchema), async (c) => {
  const { expression } = c.req.valid("json");

  try {
    const data = await getSituations({ expression }, c.env.ANTHROPIC_API_KEY);
    return c.json(data, 200);
  } catch (error) {
    console.error("Error in situations route:", error);
    return c.json({ message: "Failed to get situations" }, 500);
  }
});

export default app;
