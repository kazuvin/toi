import { Hono } from "hono";
import { ChatRequest } from "@parrot-buddy/shared/src/schemas/ai/chat";
import { chatWithAI } from "@/services/ai/chat";

type Bindings = {
  ANTHROPIC_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  try {
    const body = await c.req.json<ChatRequest>();

    if (
      !body.aiRole ||
      !body.userRole ||
      !body.situation ||
      !body.learningContent
    ) {
      return c.json(
        {
          error:
            "aiRole, userRole, situation, and learningContent are required",
        },
        400
      );
    }

    const result = await chatWithAI(body, c.env.ANTHROPIC_API_KEY);

    return c.json(result);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
