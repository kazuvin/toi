import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  VerifyFirebaseAuthConfig,
  VerifyFirebaseAuthEnv,
  verifyFirebaseAuth,
  getFirebaseToken,
} from "@hono/firebase-auth";
import user from "./routes/users";
import loginUser from "./routes/login-user";
import ai from "./routes/ai";
import sources from "./routes/sources";
import source from "./routes/sources/[id]";
import flashcard from "./routes/sources/flashcard";

type Bindings = VerifyFirebaseAuthEnv & {
  ENV: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("api");

// CORSミドルウェアの設定
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://toi-1ih.pages.dev"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

// app.use("*", verifyFirebaseAuth(config));

// app.get("/token", (c) => {
//   const idToken = getFirebaseToken(c);
//   return c.json(idToken);
// });

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// app.route("/login-user", loginUser);
// app.route("/user", user);
// app.route("/ai", ai);
app.route("/sources", sources);
app.route("/sources/:id", source);
app.route("/sources/flashcard", flashcard);

export default app;
