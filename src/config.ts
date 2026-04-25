import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/drizzle",
};

type APIConfig = {
  fileserverHits: number;
  PLATFORM: string;
  SECRET: string;
};

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

process.loadEnvFile();

const API_config: APIConfig = {
  fileserverHits: 0,
  PLATFORM: process.env.PLATFORM || "",
  SECRET: process.env.SECRET || "",
};
if (API_config.SECRET === "") {
  throw new Error("Missing SECRET in environment variables");
}
if (API_config.PLATFORM === "") {
  throw new Error("Missing PLATFORM in environment variables");
}

const DB_config: DBConfig = {
  dbURL: process.env.DB_URL || "",
  migrationConfig,
};
if (DB_config.dbURL === "") {
  throw new Error("Missing DB_URL in environment variables");
}

export const config = {
  API: API_config,
  DB: DB_config,
};