// import z from "zod";

// export const createTourTypesZodSchema = z.object({
//     name: z
//    .string()
//     .refine(val => typeof val === "string", {
//         message: "Name must be a string",
//     })
//    .min(2, { message: "Name minimum length 2" })
//    .max(50, { message: "Name maximum length 50" }),
// })
// export const updateTourTypesZodSchema = z.object({
//     name: z
//    .string()    
//     .refine(val => typeof val === "string", {
//         message: "Name must be a string",
//     })
//     .min(2, { message: "Name minimum length 2" })
//     .max(50, { message: "Name maximum length 50" })
//     .optional(),
// })