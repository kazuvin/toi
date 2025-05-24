import { Hono } from "hono";
import { transcribeAudio } from "@/services/ai/transcribe";
import { zValidator } from "@hono/zod-validator";
import {
  PostTranscribeBodySchema,
  PostTranscribeResponseSchema,
} from "@parrot-buddy/shared/src/schemas/ai/transcribe";

type Bindings = {
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", zValidator("json", PostTranscribeBodySchema), async (c) => {
  const { audio, language } = c.req.valid("json");

  try {
    const transcribedText = await transcribeAudio(
      c.env.OPENAI_API_KEY,
      audio,
      language
    );
    const response = PostTranscribeResponseSchema.parse({
      text: transcribedText,
    });
    return c.json(response);
  } catch (error) {
    console.error("Error in transcribe route:", error);
    return c.json({ message: "Failed to transcribe audio" }, 500);
  }
});

export default app;
