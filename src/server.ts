/* eslint-disable no-console */

import {Server} from "http";

import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";


let server: Server;


// let myAge;

const serverStart = async () => {
    console.log(envVars.NODE_ENV);
    try {
        await mongoose.connect("mongodb+srv://mongodb:mongodb@cluster0.qgah9aq.mongodb.net/tour-db?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Database connected");
        server = app.listen(5000, () => {
            console.log("Server started on port 5000");
        })
    }catch (error) {
        console.log(error);
    }
}
serverStart();

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


