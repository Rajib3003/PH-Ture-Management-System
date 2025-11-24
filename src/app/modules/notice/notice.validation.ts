
import { z } from "zod";

// Zod schema for Notice
export const createNoticeZodSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Title must be at most 200 characters long"),
  
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),

  link: z
    .string()
    .url("Invalid URL")
    .optional(),

  photo: z
    .string()
    .url("Invalid photo URL")
    .optional(),
});

