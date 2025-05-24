import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";

export const explainHistory = sqliteTable(
  "explain_history",
  {
    id: text("id").primaryKey(),
    uid: text("uid")
      .notNull()
      .references(() => users.uid),
    expression: text("expression").notNull(),
    explanation: text("explanation").notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  () => []
);
