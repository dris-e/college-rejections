import { z } from "zod";

export const collegeSchema = z.object({
  id: z.string(),
  name: z.string(),
  acceptanceRate: z.number().min(0).max(100).nullish(),
  gradRate: z.number().min(0).max(100).nullish(),
});

export const createCollegeSchema = z.object({
  name: z.string().min(2),
  acceptanceRate: z.number().min(0).max(100).optional().nullish(),
  gradRate: z.number().min(0).max(100).optional().nullish(),
});
