import express from "express";
import { Request, Response } from "express";
import { ok } from "node:assert";
import { api_config } from "./config.js";
import './config.js';

const app = express();
const HTTP_PORT = 8080;

app.use(express.json());

// -------- Health
function handlerReadiness(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("charset", "utf-8");
  res.status(200);
  res.send("OK");
}

// -------- Logging
function middlewareLogResponses(req: Request, res: Response, next: () => void) {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
    if (res.statusCode !== 200) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  });
  next();
}

// -------- Hits
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

// -------- Validate Chirp
function validateChirp(req: Request, res: Response, next: () => void) {
  try {
    const chirp = req.body?.body;

    if (typeof chirp !== "string") {
      return res.status(400).json({ error: "Something went wrong" });
    }

    if (chirp.length <= 140) {
      // "Profane" word check
      let cleaned = chirp;
      const profaneWords = ["kerfuffle", "sharbert", "fornax"];
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
      res.header("Content-Type", "application/json");
      res.status(400).send(JSON.stringify({ error: "Chirp is too long" }));
    }

  } catch (err) {
    res.header("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({ error: "Something went wrong" }));
  }
};



// -------- Routes
app.get("/api/healthz", handlerReadiness);

app.get("/admin/metrics", showHits);
app.post("/admin/reset", resetHits);
app.post("/api/validate_chirp", validateChirp);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.listen(HTTP_PORT, () => {
  console.log(`Server is running at http://localhost:${HTTP_PORT}`);
  app.use(middlewareLogResponses);
});