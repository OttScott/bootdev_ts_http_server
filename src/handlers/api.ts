import { Request, Response, NextFunction } from "express";
import { ChirpTooLongError } from "../middleware/errorHandler.js";
import { users } from "../db/schema.js";
import { hashPassword, checkPasswordHash, makeJWT, validateJWT, getBearerToken } from "../auth.js";
import { createUser, findUserByEmail } from "../db/queries/users.js";
import { createChirp, getChirpsfromDB, getSingleChirpfromDB } from "../db/queries/chirps.js";
import { config } from "../config.js";

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
    const email = req.body.email;
    const password = req.body.password;

    console.log("Creating new user with email:", email);

    const hashed_password = await hashPassword(password);
    const user = await createUser({ email, hashed_password });
    if (!user) {
      res.status(409).json({ error: "User already exists" });
      return;
    }
    const { hashed_password: _omit, ...safeUser } = user;
    res.status(201);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(safeUser));
  } catch (err) {
    next(err);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    console.log("Logging in user with email:", email);

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "incorrect email or password" });
      return;
    }

    const isPasswordValid = await checkPasswordHash(password, user.hashed_password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "incorrect email or password" });
      return;
    }

    let expiresInSeconds = 3600;
    if (req.body?.expiresInSeconds) {
      expiresInSeconds = Number(req.body.expiresInSeconds);
      if (isNaN(expiresInSeconds) || expiresInSeconds <= 0) {
        res.status(400).json({ error: "Invalid expiresInSeconds value" });
        return;
      }
      if (expiresInSeconds > 3600) {
        expiresInSeconds = 3600;
      }
    }
    
    const JWTtoken = makeJWT(user.id, expiresInSeconds, config.API.SECRET);
    
    const { hashed_password: _omit, ...safeUser } = user;
    res.status(200);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ ...safeUser, token: JWTtoken }));
  } catch (err) {
    next(err);
  }
}

export async function postChirp(req: Request, res: Response, next: NextFunction) {
  try {
    let userId = "";
    // Validate JWT from Authorization header before allowing chirp creation
    if (req.headers?.authorization) {
      const token = getBearerToken(req);
      try {
        userId = validateJWT(token, config.API.SECRET);
      } catch (err) {
        res.status(401).json({ error: (err as Error).message });
        return;
      }
    } else {
      res.status(401).json({ error: "Missing Authorization header" });
      return;
    }

    const [cleaned, err] = await validateChirp(req, res);
    if (err) {
      next(err);
      return;
    }

    const newChirp = { userId: userId, body : cleaned  };
console.log("Creating new chirp:", newChirp);
    const chirp = await createChirp( newChirp );
    res.status(201);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(chirp));

  } catch (err) {
    next(err);
  }
}

export async function getChirps(req: Request, res: Response, next: NextFunction) {
  try {
    const chirps = await getChirpsfromDB();
    res.status(200);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(chirps));
  } catch (err) {
    next(err);
  }
}

export async function getSingleChirp(
    req: Request<{ chirpId: string }>,
    res: Response,
    next: NextFunction
  ) {
  try {
    const chirpId = req.params.chirpId;
    if (!chirpId || typeof chirpId !== "string") {
      res.status(400).json({ error: "Missing chirp id" });
      next(new Error("Missing chirp id"));
      return;
    }
    const chirp = await getSingleChirpfromDB(chirpId);
    res.status(200);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(chirp[0]));
  } catch (err) {
    next(err);
  }
}