import express from "express";
import { Request, Response } from "express";
import { ok } from "node:assert";
import { api_config } from "./config.js";
import './config.js';

const app = express();
const HTTP_PORT = 8080;

function handlerReadiness(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("charset", "utf-8");
  res.status(200);
  res.send("OK");
}

function middlewareLogResponses(req: Request, res: Response, next: () => void) {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
    if (res.statusCode !== 200) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  });
  next();
}

function showHits(req: Request, res: Response, next: () => void) {
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

function resetHits(req: Request, res: Response, next: () => void) {
  api_config.fileserverHits = 0;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("charset", "utf-8");
  res.status(200);
  res.send("Hits reset to 0");

  next();
}

function middlewareMetricsInc(req: Request, res: Response, next: () => void) {
  api_config.fileserverHits += 1;
  
  next();
}

app.get("/api/healthz", handlerReadiness);

app.get("/admin/metrics", showHits);
app.get("/admin/reset", resetHits);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
  app.listen(HTTP_PORT, () => {
    console.log(`Server is running at http://localhost:${HTTP_PORT}`);

    app.use(middlewareLogResponses);

});