import { Hono } from 'hono';
import { Env } from '../../types';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { contents } from '../../database/schemas/content';

export const app = new Hono<{ Bindings: Env }>();

app.get('/contents', async (c) => {
  try {
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    const results = await db.select().from(contents);
    return c.json(results);
  } catch (error) {
    return c.json({ error }, 400);
  }
});
