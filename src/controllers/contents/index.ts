import { Hono } from 'hono';
import { Env } from '../../types';
import { contents } from '../../database/schemas/content';
import { neondb } from '../../lib/db';

export const app = new Hono<{ Bindings: Env }>();

app.get('/contents', async (c) => {
  try {
    const db = neondb(c.env.DATABASE_URL);
    const results = await db.select().from(contents);
    return c.json(results);
  } catch (error) {
    return c.json({ error }, 400);
  }
});
