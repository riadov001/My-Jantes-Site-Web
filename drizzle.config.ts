import { defineConfig } from "drizzle-kit";

const connectionUrl = process.env.PROD_DB_URL || process.env.DATABASE_URL;

if (!connectionUrl) {
  throw new Error("DATABASE_URL or PROD_DB_URL must be set");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionUrl,
  },
});
