import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { app as contents } from './controllers/contents';

const app = new Hono();

app.use(
  cors({
    origin: ['cleann.dereje.fr'],
    allowMethods: ['GET', 'POST', 'DELETE'],
    credentials: true,
    maxAge: 600,
    allowHeaders: ['Content Type', 'Authorization'],
  })
);

app.use(
  csrf({
    origin: ['cleann.dereje.fr'],
  })
);

app.route('/', contents);

export default app;
