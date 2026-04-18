import { Request, Response, NextFunction } from "express";
import { ChirpTooLongError } from "../middleware/errorHandler.js";
import { users } from "../db/schema.js";
import { createUser } from "../db/queries/users.js";
import { createChirp } from "../db/queries/chirps.js";

// Readiness
export function handlerReadiness(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("charset", "utf-8");
  res.status(200);
  res.send("OK");
}

// Profanity Filter
const profaneWords = ["kerfuffle", "sharbert", "fornax"];

async function validateChirp(req: Request, res: Response): Promise<[string, Error?]> {
  try {
    const chirp = req.body?.body;

    if (typeof chirp !== "string") {
      return ["", new Error("Chirp is not a string")];
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
      return [cleaned, undefined];
    }

    // Length Exceeded 140
    else {
      return ["", new ChirpTooLongError("Chirp is too long")];
    }

  } catch (err) {
    return ["", err as Error];
  }
}; // async function validateChirp(req: Request, res: Response) {

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

export async function postChirp(req: Request, res: Response, next: NextFunction) {
  try {
    const [cleaned, err] = await validateChirp(req, res);
    if (err) {
      next(err);
      return;
    }
    const userId = req.body?.userId;
    const newChirp = { userId: userId, body : cleaned  };
    const chirp = await createChirp( newChirp );
    res.status(201);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(chirp));

  } catch (err) {
    next(err);
  }
}