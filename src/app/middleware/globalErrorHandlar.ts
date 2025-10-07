/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"
import { TErrorSources } from "../interfaces/error.types";
import { handlerDuplicatedError } from "../helpers/handlerDuplicatedError";
import { handlerValidationError } from "../helpers/handlerValidationError";
import { handlerCastError } from "../helpers/handlerCastError";
import { handlerZodError } from "../helpers/handlerZodError";



export const globalErrorHandlar = (error:any, req:Request, res:Response, next:NextFunction)=>{
    
    if(envVars.NODE_ENV === "development"){
        console.log("globalErrorHandlar file code:",error)
    }   

    let statusCode = 500
    let message = "Something went wrong!!"
    let errorSources: TErrorSources[] | undefined = undefined;
    //duplicate key error
    if(error.code===11000){        
        const simpifiedError = handlerDuplicatedError(error)
        statusCode = simpifiedError.statusCode
        message = simpifiedError.message       
    }
    // validation error
    else if(error.name === "ValidationError"){
        const simpifiedError = handlerValidationError(error)
        statusCode = simpifiedError.statusCode
        message = simpifiedError.message
    } 
    // cast error/ objectId error
    else if(error.name === "CastError"){
        const simpifiedError = handlerCastError(error)
        statusCode = simpifiedError.statusCode
        message = simpifiedError.message
    }
    // zod error
    else if(error.name === "ZodError"){
        const simpifiedError = handlerZodError(error)
        statusCode = simpifiedError.statusCode
        message = simpifiedError.message
        errorSources = simpifiedError.errorSources
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
        errorSources,
        error:envVars.NODE_ENV === "development" ? error : null,        
        stack: envVars.NODE_ENV === "development" ? error.stack : null, 
    })
}