import { z } from "zod";

export const rejectionSchema = z.object({
  collegeId: z.string(),
  dateRejected: z.string(),
  dateApplied: z.string(),
  image: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  highSchool: z.string().nullable().optional(),
  gpa: z.number(),
  sat: z.number().nullable().optional(),
  act: z.number().nullable().optional(),
  classRank: z.number().nullable().optional(),
  extracurriculars: z.string().nullable().optional(),
  major: z.string().nullable().optional(),
});