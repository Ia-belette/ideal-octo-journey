import { z } from "zod";

export const contentPostCreateSchema = z.object({
	imdb_id: z.string(),
	flag: z.enum(["none", "moderate"]),
	is_family_friendly: z.boolean(),
});
