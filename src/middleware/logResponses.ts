import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError } from "./errorHandler.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
    if (res.statusCode !== 200) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  });
  next();
}