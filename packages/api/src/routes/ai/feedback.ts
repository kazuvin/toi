import { Hono } from "hono";
import { getFeedback } from "@/services/ai/feedback";
import { zValidator } from "@hono/zod-validator";
import { postFeedbackBodySchema } from "@toi/shared/src/schemas/ai/feedback";

type Bindings = {
  ANTHROPIC_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", zValidator("json", postFeedbackBodySchema), async (c) => {
  const { previousMessage, userMessage } = c.req.valid("json");

  try {
    const data = await getFeedback(
      { previousMessage, userMessage },
      c.env.ANTHROPIC_API_KEY
    );
    return c.json(data, 200);
  } catch (error) {
    console.error("Error in feedback route:", error);
    return c.json({ message: "Failed to get feedback" }, 500);
  }
});

export default app;
