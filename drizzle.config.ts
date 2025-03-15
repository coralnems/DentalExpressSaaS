import type { Config } from 'drizzle-kit';

export default {
  schema: './src/models/Schema.ts',
  out: './migrations',
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/social_media_platform',
} satisfies Config;
