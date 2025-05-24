import { Hono } from "hono";
import {
  VerifyFirebaseAuthConfig,
  VerifyFirebaseAuthEnv,
  verifyFirebaseAuth,
  getFirebaseToken,
} from "@hono/firebase-auth";
import user from "./routes/user";
import loginUser from "./routes/login-user";
import ai from "./routes/ai";

type Bindings = VerifyFirebaseAuthEnv & {
  ENV: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("api");

const config: VerifyFirebaseAuthConfig = {
  projectId: "parrot-buddy",
};

app.use("*", verifyFirebaseAuth(config));

app.get("/token", (c) => {
  const idToken = getFirebaseToken(c);
  return c.json(idToken);
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/login-user", loginUser);
app.route("/user", user);
app.route("/ai", ai);

export default app;
