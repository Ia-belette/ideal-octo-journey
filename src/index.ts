import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { cache } from 'hono/cache';
import { basicAuth } from 'hono/basic-auth';
import { prettyJSON } from 'hono/pretty-json';
import { logger } from 'hono/logger';

import { app as contents } from '#/controllers/contents';
import { app as films } from '#/controllers/contents/films';

import type { Env } from '#/types';

const app = new Hono<{
  Bindings: Env;
}>();

app.use(logger());

app.use(prettyJSON());

app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 600,
  })
);

app.use(
  csrf({
    origin: ['cleann.dereje.fr', 'localhost:3000'],
  })
);

app.use('*', async (c, next) => {
  const auth = basicAuth({
    username: c.env.BASIC_USERNAME,
    password: c.env.BASIC_PASSWORD,
    verifyUser: async (username, password) => {
      if (
        username === c.env.BASIC_USERNAME &&
        password === c.env.BASIC_PASSWORD
      ) {
        return true;
      }
      return false;
    },
  });
  return auth(c, next);
});

// app.get(
//   '*',
//   cache({
//     cacheName: 'cleann-cache',
//     cacheControl: 'max-age=3600',
//   })
// );

app.route('/', contents);
app.route('/contents', films);

export default app;
