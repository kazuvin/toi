import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { source } from "@/db/schemas";
import { PostSourceBody, PutSourceBody } from "@toi/shared/src/schemas/source";
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

export const insertSource = async (
  db: D1Database,
  data: {
    id: string;
    uid?: string;
    content: string;
    type: "TEXT";
    title?: string;
  }
) => {
  const drizzleDb = drizzle(db);
  return await drizzleDb
    .insert(source)
    .values({
      id: data.id,
      uid: data.uid,
      content: data.content,
      type: data.type,
      title: data.title,
    })
    .returning()
    .then((result) => result[0]);
};

export const updateSource = async (
  db: DrizzleD1Database,
  id: string,
  data: PutSourceBody
) => {
  return await db
    .update(source)
    .set({
      content: data.content,
      type: data.type,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(source.id, id))
    .returning();
};

export const deleteSource = async (db: DrizzleD1Database, id: string) => {
  return await db.delete(source).where(eq(source.id, id)).returning();
};
