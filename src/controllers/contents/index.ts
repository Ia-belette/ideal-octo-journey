import { Hono } from 'hono';
import type { Env } from '../../types';
import { contents } from '../../database/schemas/content';
import { neondb } from '../../lib/db';
import { validator } from 'hono/validator';
import { findByIdImdb } from '../../lib/tmdb';
import { contentPostCreateSchema } from '../../schemas/content';

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
    const parsed = contentPostCreateSchema.safeParse(content);

    if (!parsed.success) {
      return c.json({ error: 'Invalid request payload' }, 400);
    }

    return parsed.data;
  }),
  async (c) => {
    try {
      const { flag, imdb_id, is_family_friendly } = c.req.valid('json');

      const db = neondb(c.env.DATABASE_URL);

      const content = await findByIdImdb(imdb_id, c.env.TMDB_API_KEY, 'fr');

      if (!content || !content.tv_results || content.tv_results.length === 0) {
        return c.json({ error: 'Content not found' }, 404);
      }

      const data = {
        tb_id: content.tv_results[0].id,
        flag,
        is_family_friendly,
        backdrop_path: content.tv_results[0].backdrop_path,
        poster_path: content.tv_results[0].poster_path,
      };

      await db.insert(contents).values(data);

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

app.get(
  '/contents/:id',
  validator('param', (content, c) => {}),
  async (c) => {}
);
