import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { categories, contents, contentFlag } from './schemas/content';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    contents,
    categories,
    content_flag: contentFlag,
  },
});
