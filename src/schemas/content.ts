import { z } from 'zod';

export const contentPostCreateSchema = z.object({
  tmdb_id: z.string(),
  flag: z.enum(['none', 'moderate']),
  is_family_friendly: z.boolean(),
});

export const movieDetailsSchema = z.string();

export const langSchema = z.object({
  lang: z.string().default('fr'),
});

export const movieIdSchema = z.object({
  id: z.string(),
});
