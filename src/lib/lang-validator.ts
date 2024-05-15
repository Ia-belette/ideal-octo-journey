import { Context } from 'hono';
import { langSchema } from '#/schemas/content';

export const langValidator = (
  content: Record<string, string | string[]>,
  c: Context<any, string, {}>
) => {
  const parsed = langSchema.safeParse(content);
  if (!parsed.success) {
    return c.json({ error: 'Invalid request payload' }, 400);
  }
  return parsed.data;
};
