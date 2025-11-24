"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoticeZodSchema = void 0;
const zod_1 = require("zod");
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
    link: zod_1.z
        .string()
        .url("Invalid URL")
        .optional(),
    photo: zod_1.z
        .string()
        .url("Invalid photo URL")
        .optional(),
});
