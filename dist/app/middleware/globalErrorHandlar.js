"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandlar = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handlerDuplicatedError_1 = require("../helpers/handlerDuplicatedError");
const handlerValidationError_1 = require("../helpers/handlerValidationError");
const handlerCastError_1 = require("../helpers/handlerCastError");
const handlerZodError_1 = require("../helpers/handlerZodError");
const cloudinary_config_1 = require("../config/cloudinary.config");
const globalErrorHandlar = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log("globalErrorHandlar file code:", error);
    }
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = req.files.map(file => file.path);
        yield Promise.all(imageUrls.map(url => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    let statusCode = 500;
    let message = "Something went wrong!!";
    let errorSources = undefined;
    //duplicate key error
    if (error.code === 11000) {
        const simpifiedError = (0, handlerDuplicatedError_1.handlerDuplicatedError)(error);
        statusCode = simpifiedError.statusCode;
        message = simpifiedError.message;
    }
    // validation error
    else if (error.name === "ValidationError") {
        const simpifiedError = (0, handlerValidationError_1.handlerValidationError)(error);
        statusCode = simpifiedError.statusCode;
        message = simpifiedError.message;
    }
    // cast error/ objectId error
    else if (error.name === "CastError") {
        const simpifiedError = (0, handlerCastError_1.handlerCastError)(error);
        statusCode = simpifiedError.statusCode;
        message = simpifiedError.message;
    }
    // zod error
    else if (error.name === "ZodError") {
        const simpifiedError = (0, handlerZodError_1.handlerZodError)(error);
        statusCode = simpifiedError.statusCode;
        message = simpifiedError.message;
        errorSources = simpifiedError.errorSources;
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof Error) {
        statusCode = 500;
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: env_1.envVars.NODE_ENV === "development" ? error : null,
        stack: env_1.envVars.NODE_ENV === "development" ? error.stack : null,
    });
});
exports.globalErrorHandlar = globalErrorHandlar;
