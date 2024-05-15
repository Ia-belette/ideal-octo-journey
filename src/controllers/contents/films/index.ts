import { Hono } from 'hono';
import { eq, and, isNull, isNotNull } from 'drizzle-orm';
import { validator } from 'hono/validator';

import { contents } from '#/database/schemas/content';
import { neondb } from '#/lib/db';
import { movieDetails, movieTrailer } from '#/lib/tmdb';

import type { Env } from '#/types';

import { langValidator } from '#/lib/lang-validator';

export const app = new Hono<{ Bindings: Env }>();

app.get(
  '/films/featured',
  validator('query', (content, c) => langValidator(content, c)),
  async (c) => {
    try {
      const { lang } = c.req.valid('query');
      const db = neondb(c.env.DATABASE_URL);
      const featured = await db
        .select()
        .from(contents)
        .where(
          and(
            eq(contents.type_of_content, 'movie'),
            eq(contents.featured, true)
          )
        )
        .limit(1);

      if (featured.length === 0) {
        return c.json({ error: 'No featured movie found' }, 404);
      }

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
