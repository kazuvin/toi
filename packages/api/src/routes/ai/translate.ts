import { Hono } from "hono";
import { translateToEnglish } from "@/services/ai/translate";
import { TranslateRequestBody } from "@parrot-buddy/shared/src/schemas/ai/translate";

type Bindings = {
  ANTHROPIC_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  try {
    const body = await c.req.json<TranslateRequestBody>();

    if (!body.text) {
      return c.json({ error: "text is required" }, 400);
    }

    const result = await translateToEnglish(body.text, c.env.ANTHROPIC_API_KEY);
    return c.json(result);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
