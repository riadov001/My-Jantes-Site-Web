import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

const connectionString =
  process.env.NODE_ENV === "production" && process.env.PROD_DB_URL
    ? process.env.PROD_DB_URL
    : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
  max: 10,
});

pool.on("error", (err) => {
  console.error("[db] Pool error:", err.message);
});

const isNeonSleepError = (err: any) =>
  err?.code === "XX000" ||
  err?.message?.includes("endpoint") ||
  err?.message?.includes("disabled") ||
  err?.code === "ECONNRESET" ||
  err?.code === "ECONNREFUSED";

const originalQuery = pool.query.bind(pool);
(pool as any).query = async function (...args: any[]) {
  let lastErr: any;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await originalQuery(...args);
    } catch (err: any) {
      lastErr = err;
      if (isNeonSleepError(err) && attempt < 3) {
        const delay = 1000 * Math.pow(2, attempt);
        console.warn(`[db] Neon waking up (attempt ${attempt + 1}/3), retry in ${delay}ms…`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
  throw lastErr;
};

export const db = drizzle(pool, { schema });
