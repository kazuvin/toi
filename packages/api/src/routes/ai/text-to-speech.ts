import { Hono } from "hono";
import { textToSpeech } from "@/services/ai/text-to-speech";
import { zValidator } from "@hono/zod-validator";
import { PostTextToSpeechBodySchema } from "@parrot-buddy/shared/src/schemas/ai/text-to-speech";

type Bindings = {
  GOOGLE_CLOUD_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", zValidator("json", PostTextToSpeechBodySchema), async (c) => {
  const { text, language } = c.req.valid("json");

  try {
    const data = await textToSpeech(c.env.GOOGLE_CLOUD_API_KEY, text, language);

    return c.json(data, 200);
  } catch (error) {
    console.error("Error in text-to-speech route:", error);
    return c.json({ message: "Failed to convert text to speech" }, 500);
  }
});

export default app;
