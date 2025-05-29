import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";

export const source = sqliteTable(
  "source",
  {
    id: text("id").primaryKey(),
    uid: text("uid").references(() => users.uid),
    title: text("title"),
    content: text("content").notNull(),
    type: text("type", { enum: ["TEXT"] }).notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  () => []
);
