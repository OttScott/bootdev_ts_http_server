import express, { NextFunction } from "express";
import { config } from "./config.js";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import apiRoutes from "./routes/api.js";
import adminRoutes from "./routes/admin.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { middlewareMetricsInc } from "./middleware/metrics.js"
import { handleErrors } from "./middleware/errorHandler.js";

const app = express();
const HTTP_PORT = 8080;

console.log("DB Migrations starting...");
const migrationClient = postgres(config.DB.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.DB.migrationConfig);

app.use(express.json());
app.use(middlewareLogResponses);

// -------- Routes
app.use("/api", apiRoutes);
app.use("/admin", adminRoutes);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(handleErrors);
app.listen(HTTP_PORT, () => {
  console.log(`Server is running at http://localhost:${HTTP_PORT}`);
  app.use(middlewareLogResponses);
});