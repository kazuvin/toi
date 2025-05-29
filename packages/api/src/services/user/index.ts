import { DrizzleD1Database } from "drizzle-orm/d1";
import { DrizzleError, eq } from "drizzle-orm";
import { users } from "@/db/schemas";
import { PostUserBody } from "@toi/shared/src/schemas/user";

/**
 * ユーザー情報取得
 * @param db - DrizzleD1Database
 * @param uid - ユーザーID
 * @returns ユーザー情報
 */
export async function getUser(db: DrizzleD1Database, uid: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.uid, uid))
      .get();

    if (!result) {
      throw new DrizzleError({ message: "User not found." });
    }

    return result;
  } catch (error) {
    if (error instanceof DrizzleError) {
      throw error;
    }
    throw new DrizzleError({ message: "Failed to fetch user." });
  }
}

/**
 * ユーザー情報追加
 * @param db - DrizzleD1Database
 * @param userData - ユーザー情報
 * @returns ユーザー情報
 */
export async function createUser(
  db: DrizzleD1Database,
  userData: PostUserBody
) {
  try {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  } catch (error) {
    throw new DrizzleError({ message: "Failed to create user" });
  }
}
