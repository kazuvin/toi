import { Hono } from "hono";
import { getRecommendations } from "@/services/ai/recommend";
import { zValidator } from "@hono/zod-validator";
import { postRecommendBodySchema } from "@toi/shared/src/schemas/ai/recommend";

type Bindings = {
  ANTHROPIC_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", zValidator("json", postRecommendBodySchema), async (c) => {
  const { messages, aiRole, userRole, situation, learningContent } =
    c.req.valid("json");

  try {
    const data = await getRecommendations(
      { messages, aiRole, userRole, situation, learningContent },
      c.env.ANTHROPIC_API_KEY
    );
    return c.json(data, 200);
  } catch (error) {
    console.error("Error in recommend route:", error);
    return c.json({ message: "Failed to get recommendations" }, 500);
  }
});

export default app;
