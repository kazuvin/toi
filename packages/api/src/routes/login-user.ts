import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { Context } from "hono";
import { DrizzleError } from "drizzle-orm";
import { getUser } from "@/services/user";

type Bindings = {
  DB: D1Database;
};

type Variables = {
  uid: string;
};

type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;

// エラーハンドラー
const errorHandler = async (err: Error, c: AppContext) => {
  console.error(err);
  if (err instanceof DrizzleError) {
    if (err.message === "User not found") {
      return c.json({ message: err.message }, 404);
    }
    return c.json({ message: err.message }, 400);
  }
  return c.json({ message: "Server Error" }, 500);
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.onError(errorHandler);

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const currentUid = c.get("uid");

  if (!currentUid) {
    return c.json({ message: "Unauthorized access" }, 403);
  }

  const result = await getUser(db, currentUid);
  return c.json(result);
});

export default app;
