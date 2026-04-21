import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createChirp(newChirp: NewChirp) {
  const result = await db
    .insert(chirps)
    .values(newChirp)
    .returning();

  console.log("DB Insert Chirp:", result);
  return result[0];
}

export async function getChirpsfromDB() {
  const result = await db
    .select()
    .from(chirps)
    .orderBy(asc(chirps.createdAt));

  console.log("DB Get Chirps:", result);
  return result;
}

export async function getSingleChirpfromDB(chirpId: string) {
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, chirpId));

  console.log("DB Get Single Chirp:", result);
  return result;
}

