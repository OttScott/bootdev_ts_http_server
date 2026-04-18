import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(newChirp: NewChirp) {
  const result = await db
    .insert(chirps)
    .values(newChirp)
    .returning();

  console.log("DB Insert Chirp:", result);
  return result[0];
}