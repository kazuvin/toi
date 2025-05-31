import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { source } from "./source";

export const flashcard = sqliteTable(
  "flashcard",
  {
    id: text("id").primaryKey(),
    sourceId: text("source_id").references(() => source.id),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  () => []
);
