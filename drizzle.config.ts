import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/**/*.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: Bun.env.DATABASE_URL!,
  },
});
