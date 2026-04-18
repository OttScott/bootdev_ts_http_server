import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";
import { config } from "../config.js";

const dbconn = postgres(config.DB.dbURL);
export const db = drizzle(dbconn, { schema });