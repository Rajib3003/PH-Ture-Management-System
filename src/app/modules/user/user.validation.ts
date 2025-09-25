import z from "zod";
import { isActived, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
    .string().refine(val => typeof val === "string", { message: "Name must be a string" })
    .min(2, { message: "Name minimum length 2" })
    .max(50, { message: "Name maximum length 50" }),
    email: z.string().email({ message: "Please provide a valid email address" }),
    password: z
    .string().refine(val => typeof val === "string", { message: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, { message: "Password must contain at least one special character" }), 
    phone: z
    .string().refine(val => typeof val === "string", { message: "Phone Number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),            
    address: z
    .string().refine(val => typeof val === "string", { message: "Address must be a string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional()               
    }    
)

export const updateUserZodSchema = z.object({
    name: z
    .string().refine(val => typeof val === "string", { message: "Name must be a string" })
    .min(2, { message: "Name minimum length 2" })
    .max(50, { message: "Name maximum length 50" })
    .optional(),
    
    password: z
    .string().refine(val => typeof val === "string", { message: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, { message: "Password must contain at least one special character" })
    .optional(), 
    phone: z
    .string().refine(val => typeof val === "string", { message: "Phone Number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),            
    address: z
    .string().refine(val => typeof val === "string", { message: "Address must be a string"})
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
    isDeleted: z
    .boolean().refine(val => typeof val === "boolean", { message: "IsDeleted must be a boolean"})
    .optional(),
    isVerified: z
    .boolean().refine(val => typeof val === "boolean", { message: "isVerified must be a boolean"})
    .optional(),
    isActived: z.enum(Object.values(isActived) as [string]).optional(),
    role: z.enum(Object.values(Role) as [string]).optional(),
    }            
)