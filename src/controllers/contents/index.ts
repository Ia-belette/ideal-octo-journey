import { Hono } from 'hono';
import type { Env } from '../../types';
import { contents } from '../../database/schemas/content';
import { neondb } from '../../lib/db';
import { validator } from 'hono/validator';
import { movieDetails } from '../../lib/tmdb';
import {
  contentPostCreateSchema,
  movieDetailsSchema,
} from '../../schemas/content';

export const app = new Hono<{ Bindings: Env }>();

app.get('/contents', async (c) => {
  try {
    const db = neondb(c.env.DATABASE_URL);
    const results = await db.select().from(contents);
    console.log(results, 'results');
    return c.json(results);
  } catch (error) {
    console.log(error, 'error');
    return c.json({ error }, 400);
  }
});

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

      const content = await movieDetails(tmdb_id, c.env.TMDB_API_KEY, 'fr');

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
      console.log(error, 'error');
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
);

app.get(
  '/contents/:id',
  validator('param', (content, c) => {
    const parsed = movieDetailsSchema.safeParse(content.id);
    if (!parsed.success) {
      console.log(parsed.error, 'parsed');
      return c.json({ error: 'Invalid request payload' }, 400);
    }
    return parsed.data;
  }),
  async (c) => {
    try {
      const id = c.req.valid('param');
      const movie = await movieDetails(id, c.env.TMDB_API_KEY, 'fr');
      return c.json({ movie });
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
);
