"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNoticeZodSchema = exports.createNoticeZodSchema = exports.updateNoticeTypesZodSchema = exports.createNoticeTypesZodSchema = void 0;
const zod_1 = require("zod");
exports.createNoticeTypesZodSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .refine(val => typeof val === "string", {
        message: "Name must be a string",
    })
        .min(2, { message: "Name minimum length 2" })
        .max(50, { message: "Name maximum length 50" }),
});
exports.updateNoticeTypesZodSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .refine(val => typeof val === "string", {
        message: "Name must be a string",
    })
        .min(2, { message: "Name minimum length 2" })
        .max(50, { message: "Name maximum length 50" })
        .optional(),
});
// Zod schema for Notice
exports.createNoticeZodSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(200, "Title must be at most 200 characters long"),
    date: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    description: zod_1.z
        .string()
        .max(1000, "Description must be at most 1000 characters")
        .optional(),
    noticeType: zod_1.z.string().optional(),
});
exports.updateNoticeZodSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(200, "Title must be at most 200 characters long")
        .optional(),
    date: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    })
        .optional(),
    description: zod_1.z
        .string()
        .max(1000, "Description must be at most 1000 characters")
        .optional(),
    noticeType: zod_1.z
        .string()
        .optional(),
    deleteImages: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .optional()
        .transform((val) => {
        if (typeof val === "string")
            return JSON.parse(val);
        return val;
    }),
    // deleteImages: z
    //   .array(z.string())
    //   .optional(),
});
