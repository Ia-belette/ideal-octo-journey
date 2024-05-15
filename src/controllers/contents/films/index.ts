import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { validator } from 'hono/validator';

import { contents } from '#/database/schemas/content';
import { neondb } from '#/lib/db';
import { movieDetails, movieTrailer } from '#/lib/tmdb';

import type { Env } from '#/types';

import { langValidator } from '#/lib/lang-validator';
import { movieIdSchema } from '#/schemas/content';

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

app.get('/films', async (c) => {
  try {
    const db = neondb(c.env.DATABASE_URL);
    const movies = await db
      .select()
      .from(contents)
      .where(eq(contents.type_of_content, 'movie'));

    return c.json(movies);
  } catch (error) {
    return c.json({ error }, 400);
  }
});

app.get(
  '/films/:id',
  validator('param', (content, c) => {
    const parsed = movieIdSchema.safeParse(content);
    if (!parsed.success) {
      return c.json({ error: 'Invalid request payload' }, 400);
    }
    return parsed.data;
  }),
  validator('query', (content, c) => langValidator(content, c)),
  async (c) => {
    const { id } = c.req.valid('param');
    const { lang } = c.req.valid('query');

    try {
      const db = neondb(c.env.DATABASE_URL);
      const movie = await db
        .select()
        .from(contents)
        .where(
          and(
            eq(contents.type_of_content, 'movie'),
            eq(contents.tb_id, Number(id))
          )
        );

      if (movie.length === 0) {
        return c.json({ error: 'Movie not found' }, 404);
      }

      const mvDetails = await movieDetails(
        Number(movie[0].tb_id),
        c.env.TMDB_API_KEY,
        lang
      );
      const mvTrailer = await movieTrailer(
        String(movie[0].tb_id),
        c.env.TMDB_API_KEY,
        lang
      );

      return c.json({
        movie: movie,
        movie_details: mvDetails,
        movie_trailer: mvTrailer,
      });
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);
