import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import { categories, contents, contentFlag } from '#/database/schemas/content';

config({
  path: '../../.dev.vars',
});

const sql = neon(process.env.DATABASE_URL || '');

export const db = drizzle(sql, {
  schema: {
    contents,
    categories,
    content_flag: contentFlag,
  },
});
