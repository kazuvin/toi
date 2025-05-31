import { Hono } from "hono";
import flashcards from "./flashcards";

const app = new Hono();

app.route("/flashcards", flashcards);

export default app;
