import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { validator } from 'hono/validator';

import { contents } from '#/database/schemas/content';
import { neondb } from '#/lib/db';
import { movieDetails, movieTrailer } from '#/lib/tmdb';

import type { Env } from '#/types';
import { z } from 'zod';

export const app = new Hono<{ Bindings: Env }>();

app.get(
  '/films/featured',
  validator('query', (content, c) => {
    const schema = z.object({
      lang: z.string().default('fr'),
    });
    const parsed = schema.safeParse(content);

    if (!parsed.success) {
      return c.json({ error: 'Invalid request payload' }, 400);
    }

    return parsed.data;
  }),
  async (c) => {
    try {
      const { lang } = c.req.valid('query');
      const db = neondb(c.env.DATABASE_URL);
      const featured = await db
        .select()
        .from(contents)
        .where(eq(contents.type_of_content, 'movie'))
        .limit(1);

      const featuredDetails = await movieDetails(
        Number(featured[0].tb_id),
        c.env.TMDB_API_KEY,
        lang
      );

      return c.json({
        featured: featured,
        featured_details: featuredDetails,
      });
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);

