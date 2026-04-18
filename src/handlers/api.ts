import { Request, Response, NextFunction } from "express";
import { ChirpTooLongError } from "../middleware/errorHandler.js";
import { users } from "../db/schema.js";
import { createUser } from "../db/queries/users.js";

// Readiness
export function handlerReadiness(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("charset", "utf-8");
  res.status(200);
  res.send("OK");
}

// Profanity Filter
const profaneWords = ["kerfuffle", "sharbert", "fornax"];

export async function validateChirp(req: Request, res: Response, next: NextFunction) {
  try {
    const chirp = req.body?.body;

    if (typeof chirp !== "string") {
      return res.status(400).json({ error: "Something went wrong" });
    }

    if (chirp.length <= 140) {
      // "Profane" word check
      let cleaned = chirp;
      
      const containsProfane = profaneWords.some(word => chirp.toLowerCase().includes(word));
      if (containsProfane) {
        for (const badword of profaneWords) {
          cleaned = cleaned.replaceAll(new RegExp(badword, "gi"), "****") ;
        }
      }

      // Valid (Cleaned) Response
      res.status(200);
      res.header("Content-Type", "application/json");
      res.send(JSON.stringify({cleanedBody: cleaned}));
    }

    // Length Exceeded 140
    else {
      throw new ChirpTooLongError("Chirp is too long");
    }

  } catch (err) {
    next(err);
  }
}; // export async function validateChirp(req: Request, res: Response, next: NextFunction) {

export async function newUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    console.log("Creating new user with email:", email);

    const user = await createUser({ email });
    res.status(201);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(user));
  } catch (err) {
    next(err);
  }
}
