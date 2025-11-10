"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerZodError = void 0;
const handlerZodError = (error) => {
    const errorSources = [];
    error.issues.forEach((issue) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        });
    });
    return {
        statusCode: 400,
        message: "globalErrorHandlar file code: zod error",
        errorSources
    };
};
exports.handlerZodError = handlerZodError;
