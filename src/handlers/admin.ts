import { Request, Response, NextFunction } from "express";
import { api_config } from "../config.js";

// Hits
export function showHits(req: Request, res: Response, next: NextFunction) {
  // insert the number of hits to the file server in the response
  res.setHeader("Content-Type", "text/html");
  res.setHeader("charset", "utf-8");
  res.status(200);
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${api_config.fileserverHits} times!</p> 
  </body>
</html>`);

  next();
}

export function resetHits(req: Request, res: Response, next: NextFunction) {
  api_config.fileserverHits = 0;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("charset", "utf-8");
  res.status(200);
  res.send("Hits reset to 0");

  next();
}