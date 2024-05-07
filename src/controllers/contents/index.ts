import { Hono } from 'hono';
import { Env } from '../../types';
import { contents } from '../../database/schemas/content';
import { neondb } from '../../lib/db';
import { validator } from 'hono/validator';
import { z } from 'zod';
import { cotentSchema } from '../../schemas/content';

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

app.post(
  '/contents',
  validator('json', (content, c) => {
    const parsed = cotentSchema.safeParse(content);
    if (!parsed.success) {
      return c.text('Invalid!', 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { ib_id, name, tb_id, backdrop_path, flag, poster_path } =
      c.req.valid('json');

    const db = neondb(c.env.DATABASE_URL);

    await db.insert(contents).values({
      tb_id,
      ib_id,
      name,
      flag,
      backdrop_path,
      poster_path,
    });

    return c.json(
      {
        message: 'Created!',
      },
      201
    );
  }
);
