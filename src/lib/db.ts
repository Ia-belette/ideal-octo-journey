import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export const neondb = (url: string) => {
  const sql = neon(url);
  return drizzle(sql);
};
