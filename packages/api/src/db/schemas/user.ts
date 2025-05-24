import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    uid: text("uid").primaryKey(),
    email: text("email"),
    displayName: text("display_name"),
    photoURL: text("photo_url"),
    createdAt: text("created_at").default(sql`CURRENT_DATE`),
    updatedAt: text("updated_at").default(sql`CURRENT_DATE`),
    userType: text("user_type", {
      enum: ["ANONYMOUS", "REGISTERED"],
    }).notNull(),
    subscriptionPlan: text("subscription_plan", { enum: ["Pro"] }),
    subscriptionExpiresAt: text("subscription_expires_at"),
    isAdmin: integer("is_admin", { mode: "boolean" }).notNull(),
  },
  () => []
);
