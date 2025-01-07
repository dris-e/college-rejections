import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"];

export const rejectionSchema = z.object({
  collegeId: z.string(),
  dateRejected: z.string(),
  dateApplied: z.string(),
  image: z.string(),
  name: z.string(),
  description: z.string().optional().nullish(),
  highSchool: z.string().optional().nullish(),
  gpa: z.number().min(0).max(4),
  sat: z.number().min(0).max(1600).nullable().optional(),
  act: z.number().min(0).max(36).nullable().optional(),
  classRank: z.number().optional().nullish(),
  extracurriculars: z.string().optional().nullish(),
  major: z.string().optional().nullish(),
});

export const createRejectionSchema = z.object({
  collegeId: z.string(),
  dateRejected: z.string(),
  dateApplied: z.string(),
  image: z
    .any()
    .refine((file) => !file || file instanceof File, "Must be a File object")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .nullish(),
  name: z.string().min(2),
  description: z.string().nullable().optional(),
  highSchool: z.string().nullable().optional(),
  gpa: z.number().min(0).max(4),
  sat: z.number().min(0).max(1600).nullable().optional(),
  act: z.number().min(0).max(36).nullable().optional(),
  classRank: z.number().nullable().optional(),
  extracurriculars: z.string().nullable().optional(),
  major: z.string().nullable().optional(),
});

export const updateSchema = z
  .object({
    views: z.literal(1).optional(),
    upvotes: z.union([z.literal(1), z.literal(-1)]).optional(),
  })
  .refine((data) => Object.keys(data).length === 1, { message: "Exactly one field must be provided" });
