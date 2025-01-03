import { z } from "zod";

export const collegeSchema = z.object({
  id: z.string(),
  name: z.string(),
  acceptanceRate: z.number().nullable(),
  gradRate: z.number().nullable(),
});