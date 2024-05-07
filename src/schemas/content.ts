import { z } from 'zod';

export const cotentSchema = z.object({
  tb_id: z.string(),
  ib_id: z.string(),
  name: z.string(),
  flag: z.enum(['none', 'moderate']),
  poster_path: z.string(),
  backdrop_path: z.string(),
});
