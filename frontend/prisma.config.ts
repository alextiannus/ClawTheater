import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Uses DATABASE_URL env var if set (PostgreSQL in production on Render),
    // falls back to SQLite for local development
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL || "file:./dev.db",
  },
});
