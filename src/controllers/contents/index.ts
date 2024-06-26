import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { validator } from 'hono/validator';

import { contents } from '#/database/schemas/content';
import { neondb } from '#/lib/db';
import { movieDetails, movieTrailer } from '#/lib/tmdb';
import { contentPostCreateSchema, movieDetailsSchema } from '#/schemas/content';

import type { Env } from '#/types';

export const app = new Hono<{ Bindings: Env }>();

app.post(
  '/contents',
  validator('json', (content, c) => {
    const parsed = contentPostCreateSchema.safeParse(content);

    if (!parsed.success) {
      return c.json({ error: 'Invalid request payload' }, 400);
    }

    return parsed.data;
  }),
  async (c) => {
    try {
      const { flag, tmdb_id, is_family_friendly } = c.req.valid('json');

      const db = neondb(c.env.DATABASE_URL);

      const content = await movieDetails(
        Number(tmdb_id),
        c.env.TMDB_API_KEY,
        'fr'
      );
      const data = {
        tb_id: tmdb_id,
        flag,
        is_family_friendly,
        backdrop_path: content.backdrop_path,
        poster_path: content.poster_path,
      };

      await db.insert(contents).values({
        is_family_friendly: data.is_family_friendly,
        flag: data.flag,
        tb_id: Number(data.tb_id),
        backdrop_path: data.backdrop_path,
        poster_path: data.poster_path,
      });

      return c.json(
        {
          message: 'Content created successfully',
        },
        201
      );
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
);

app.delete(
  '/contents/:id',
  validator('param', (content, c) => {
    const parsed = movieDetailsSchema.safeParse(content.id);
    if (!parsed.success) {
      return c.json({ error: 'Invalid request payload' }, 400);
    }
    return parsed.data;
  }),
  async (c) => {
    try {
      const id = c.req.valid('param');
      const db = neondb(c.env.DATABASE_URL);
      await db.delete(contents).where(eq(contents.tb_id, Number(id)));
      return c.json({ message: 'Content deleted successfully' });
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
);
