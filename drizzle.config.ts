import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/schemas/schema.ts",
  out: "./server/schemas/migrations",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
