import { Hono } from "hono";
import flashcards from "./flashcards";
import flashcardId from "./flashcards/[flashcardId]";

const app = new Hono();

app.route("/flashcards", flashcards);
app.route("/flashcards/:flashcardId", flashcardId);

export default app;
