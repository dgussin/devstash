import { defineConfig } from 'prisma/config'

// Load .env.local for Prisma CLI commands (migrate, studio, etc.)
// Next.js loads this automatically at runtime; the CLI does not.
try {
  process.loadEnvFile('.env.local')
} catch {
  // .env.local not present (CI, production, etc.)
}

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // Neon: prefer a direct (non-pooled) connection for DDL migrations.
    // Set DIRECT_URL to your non-pooled Neon connection string.
    // Falls back to DATABASE_URL if DIRECT_URL is not set.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
