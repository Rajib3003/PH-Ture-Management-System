/* eslint-disable no-console */

import {Server} from "http";

import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";



let server: Server;


// let myAge;

const serverStart = async () => {    
    try {
        await mongoose.connect(envVars.DB_URL as string);
        console.log("Database connected");
        server = app.listen(envVars.PORT, () => {
            console.log(`Server started on port ${envVars.PORT}`);
        })
    }catch (error) {
        console.log(error);
    }
}

(async()=>{
    await connectRedis();
    await serverStart();
    await seedSuperAdmin();
})()

process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection is detected, we are closing our server....",error);
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        })}

        process.exit(1);

})

process.on("uncaughtException", (error) => {
    console.log("uncaught Exception is detected, we are closing our server....",error);
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        })}

        process.exit(1);

})
process.on("SIGTERM", () => {
    console.log("SIGTERM singnal recieved, we are closing our server....");
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        })}

        process.exit(1);

})
process.on("SIGINT", () => {
    console.log("SIGINT singnal recieved, we are closing our server....");
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        })}

        process.exit(1);

})
// unhandledRejection test code
// Promise.reject(new Error("I am unhandled rejection error"));
// uncaughtException test code
// throw new Error("I am uncaught exception error");


