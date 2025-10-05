/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"

export const globalErrorHandlar = (error:any, req:Request, res:Response, next:NextFunction)=>{
    console.log("globalErrorHandlar file code:",error)


    let statusCode = 500
    let message = "Something went wrong!!"
    //duplicate key error
    if(error.code===11000){        
        const matcheArray = error.message.match(/"([^"]*)"/)
              
        statusCode = 400
        // message = `Duplicate value entered for ${Object.keys(error.keyValue)} field, please choose another value`
        message = `globalErrorHandlar file code:Duplicate value entered for ${matcheArray[1]} field, please choose another value`
    }
    // validation error
    else if(error.name === "ValidationError"){
        statusCode = 400
        message = Object.values(error.errors).map((value:any)=> value.message).join(", ")
    } 
    // cast error/ objectId error
    else if(error.name === "CastError"){
        statusCode = 400
        message = `globalErrorHandlar file code:Invalid ${error.path} : ${error.value}`
    }
    else if(error instanceof AppError){
        statusCode = error.statusCode
        message = error.message
    } else if (error instanceof Error){
        statusCode = 500;
        message = error.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        error,
        stack: envVars.NODE_ENV === "development" ? error.stack : null, 
    })
}