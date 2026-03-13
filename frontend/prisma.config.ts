import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Uses DATABASE_URL env var if set (PostgreSQL in production on Render),
    // strictly requires Postgres now for both local and prod
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  },
});
