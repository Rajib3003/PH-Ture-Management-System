
import { z } from "zod";

export const createNoticeTypesZodSchema = z.object({
    name: z
   .string()
    .refine(val => typeof val === "string", {
        message: "Name must be a string",
    })
   .min(2, { message: "Name minimum length 2" })
   .max(50, { message: "Name maximum length 50" }),
})
export const updateNoticeTypesZodSchema = z.object({
    name: z
   .string()    
    .refine(val => typeof val === "string", {
        message: "Name must be a string",
    })
    .min(2, { message: "Name minimum length 2" })
    .max(50, { message: "Name maximum length 50" })
    .optional(),
})

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
    noticeType: z.string().optional(),
   

});
export const updateNoticeZodSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Title must be at most 200 characters long")
    .optional(),
  
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),

  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
  noticeType: z
    .string()
    .optional(),

    deleteImages: z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((val) => {
    if (typeof val === "string") return JSON.parse(val);
    return val;
  }),

  // deleteImages: z
  //   .array(z.string())
  //   .optional(),
});




