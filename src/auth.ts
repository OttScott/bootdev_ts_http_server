import type { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hashedPassword: string): Promise<boolean> {
  return await argon2.verify(hashedPassword, password);
}

export function makeJWT(userId: string, expiresIn: number, secret: string): string {
  type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
  const payload: payload = {} as payload;
  payload.iss = "Chirpy";
  payload.sub = userId;
  payload.iat = Math.floor(Date.now() / 1000);
  payload.exp = payload.iat + expiresIn;
  if (payload.exp < payload.iat) {
    throw new Error("Invalid expiresInSeconds value");
  }
  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  let payload;
  try {
     payload = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (err) {
    throw new Error("Invalid token");
  }
  const currentTime = Math.floor(Date.now() / 1000);
  if (typeof payload && payload.exp) {
    if (payload.exp < currentTime) {
      throw new Error("Token has expired");
    }
  }
  return payload.sub as string;
}

export function getBearerToken(req: Request): string {
  const authHeader = req.headers?.["authorization"];
  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new Error("Invalid Authorization header format");
  }
  return token;
}