import { Hono } from "hono";
import chat from "./chat";
import explain from "./explain";
import translate from "./translate";
import transcribe from "./transcribe";
import textToSpeech from "./text-to-speech";
import recommend from "./recommend";
import feedback from "./feedback";
import situations from "./situations";

const app = new Hono();

app.route("/chat", chat);
app.route("/explain", explain);
app.route("/translate", translate);
app.route("/transcribe", transcribe);
app.route("/text-to-speech", textToSpeech);
app.route("/recommend", recommend);
app.route("/feedback", feedback);
app.route("/situations", situations);

export default app;
