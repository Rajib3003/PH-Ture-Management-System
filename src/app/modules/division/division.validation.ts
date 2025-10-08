import z from "zod";

export const createDivisionZodSchema = z.object({
     name: z
    .string()
    .refine(val => typeof val === "string", {
        message: "Name must be a string",
    })
    .min(2, { message: "Name minimum length 2" })
    .max(50, { message: "Name maximum length 50" }),

  slug: z
    .string()
    .refine(val => typeof val === "string", {
        message: "Slug Name must be a string",
    })
    .min(2, { message: "Slug minimum length 2" })
    .max(50, { message: "Slug maximum length 50" })
    .optional(),

  description: z
    .string()
    .refine(val => typeof val === "string", {
        message: "Description must be a string",
    })
    .max(500, { message: "Description maximum length 500" })
    .optional(),
    
})