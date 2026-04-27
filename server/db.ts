import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

const connectionString =
  process.env.NODE_ENV === "production" && process.env.PROD_DB_URL
    ? process.env.PROD_DB_URL
    : process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
