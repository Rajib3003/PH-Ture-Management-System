"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerDuplicatedError = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlerDuplicatedError = (error) => {
    const matcheArray = error.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `Duplicate value entered for ${matcheArray[1]} field, please choose another value`
    };
};
exports.handlerDuplicatedError = handlerDuplicatedError;
