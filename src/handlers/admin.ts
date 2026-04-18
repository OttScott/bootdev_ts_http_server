import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { dropUsers } from "../db/queries/users.js";

// Hits
export function showHits(req: Request, res: Response, next: NextFunction) {
  // insert the number of hits to the file server in the response
  res.setHeader("Content-Type", "text/html");
  res.setHeader("charset", "utf-8");
  res.status(200);
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.API.fileserverHits} times!</p> 
  </body>
</html>`);

  next();
}

function resetUsers(req: Request, res: Response, next: NextFunction): boolean {
  dropUsers();
  return true;
}

function resetHits(req: Request, res: Response, next: NextFunction) {
  config.API.fileserverHits = 0;
}

export function reset(req: Request, res: Response, next: NextFunction) {
  if (config.API.PLATFORM !== "dev") {
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("charset", "utf-8");
      res.status(403).send();
  }
  resetHits(req, res, next);
  if (resetUsers(req, res, next)) {
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("charset", "utf-8");
      res.status(200);
      res.send("Hits reset to 0. Users reset.");
    }
  }