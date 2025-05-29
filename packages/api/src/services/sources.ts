import { DrizzleD1Database } from "drizzle-orm/d1";
import { source } from "@/db/schemas";
import { PostSourceBody } from "@toi/shared/src/schemas/source";
import { eq } from "drizzle-orm";

export const getSources = async (db: DrizzleD1Database) => {
  return await db.select().from(source);
};

export const getSourceById = async (db: DrizzleD1Database, id: string) => {
  return await db.select().from(source).where(eq(source.id, id)).limit(1);
};

export const createSource = async (
  db: DrizzleD1Database,
  data: PostSourceBody
) => {
  return await db
    .insert(source)
    .values({
      id: crypto.randomUUID(),
      content: data.content,
      type: data.type,
    })
    .returning();
};
