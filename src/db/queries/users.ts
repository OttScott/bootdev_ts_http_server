import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

    return result;
}

export async function dropUsers() {
  const [result] = await db.
  delete(users)
  .execute();
}

export async function findUserByEmail(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).execute();
  return user[0];
}