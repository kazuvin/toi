import { Hono } from "hono";
import flashcards from "./flashcards";
import flashcardId from "./flashcards/[flashcardId]";
import flashcardsBulk from "./flashcards/bulk";

const app = new Hono();

app.route("/flashcards", flashcards);
app.route("/flashcards/:flashcardId", flashcardId);
app.route("/flashcards/bulk", flashcardsBulk);

export default app;
