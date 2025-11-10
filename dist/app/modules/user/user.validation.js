"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string().refine(val => typeof val === "string", { message: "Name must be a string" })
        .min(2, { message: "Name minimum length 2" })
        .max(50, { message: "Name maximum length 50" }),
    email: zod_1.default.string().email({ message: "Please provide a valid email address" }),
    password: zod_1.default
        .string().refine(val => typeof val === "string", { message: "Password must be a string" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[\W_]/, { message: "Password must contain at least one special character" }),
    phone: zod_1.default
        .string().refine(val => typeof val === "string", { message: "Phone Number must be a string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.default
        .string().refine(val => typeof val === "string", { message: "Address must be a string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional()
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string().refine(val => typeof val === "string", { message: "Name must be a string" })
        .min(2, { message: "Name minimum length 2" })
        .max(50, { message: "Name maximum length 50" })
        .optional(),
    // password: z
    // .string().refine(val => typeof val === "string", { message: "Password must be a string" })
    // .min(8, { message: "Password must be at least 8 characters long" })
    // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    // .regex(/[0-9]/, { message: "Password must contain at least one number" })
    // .regex(/[\W_]/, { message: "Password must contain at least one special character" })
    // .optional(), 
    phone: zod_1.default
        .string().refine(val => typeof val === "string", { message: "Phone Number must be a string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.default
        .string().refine(val => typeof val === "string", { message: "Address must be a string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    isDeleted: zod_1.default
        .boolean().refine(val => typeof val === "boolean", { message: "IsDeleted must be a boolean" })
        .optional(),
    isVerified: zod_1.default
        .boolean().refine(val => typeof val === "boolean", { message: "isVerified must be a boolean" })
        .optional(),
    isActived: zod_1.default.enum(Object.values(user_interface_1.isActived)).optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
});
