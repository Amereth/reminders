import { defineConfig } from "drizzle-kit";
import { env } from "./src/utils/env";

export default defineConfig({
  schema: "./src/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  out: "./migrations",
});
