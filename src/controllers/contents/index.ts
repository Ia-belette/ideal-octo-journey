import { Hono } from 'hono';
import { db } from '../../database/index';
const app = new Hono();

app.get('/contents', async (c) => {
  c.json({ contents: [] });
});
