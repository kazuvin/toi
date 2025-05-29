import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";
import { source } from "./source";

export const learningContent = sqliteTable(
  "learning_content",
  {
    id: text("id").primaryKey(),
    uid: text("uid")
      .notNull()
      .references(() => users.uid),
    sourceId: text("source_id")
      .notNull()
      .references(() => source.id),
    type: text("type", {
      enum: ["FLASHCARD", "MULTIPLE_CHOICE", "FILL_IN_BLANK"],
    }).notNull(),
    content: text("content").notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  () => []
);
