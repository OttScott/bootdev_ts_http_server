import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/drizzle",
};

type APIConfig = {
    fileserverHits: number;
    PLATFORM: string;
};

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

process.loadEnvFile();

const API_config: APIConfig = {
    fileserverHits: 0,
    PLATFORM: process.env.PLATFORM || "",

};

const DB_config: DBConfig = {
  dbURL: process.env.DB_URL || "",
  migrationConfig,
};

export const config = {
  API: API_config,
  DB: DB_config,
};