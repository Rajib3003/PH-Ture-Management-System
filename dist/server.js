"use strict";
/* eslint-disable no-console */
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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./app/config/redis.config");
let server;
// let myAge;
const serverStart = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Database connected");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server started on port ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield serverStart();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection is detected, we are closing our server....", error);
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", (error) => {
    console.log("uncaught Exception is detected, we are closing our server....", error);
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("SIGTERM singnal recieved, we are closing our server....");
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT singnal recieved, we are closing our server....");
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        });
    }
    process.exit(1);
});
// unhandledRejection test code
// Promise.reject(new Error("I am unhandled rejection error"));
// uncaughtException test code
// throw new Error("I am uncaught exception error");
