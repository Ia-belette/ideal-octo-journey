import { Hono } from 'hono';

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
  return c.text(`Hello Hono!`);
});

export default app;
