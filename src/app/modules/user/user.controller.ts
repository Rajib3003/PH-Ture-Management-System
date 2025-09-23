/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import { userService } from "./user.service";
import { error } from "console";
import catchAsync from "../../utils/catchAsync";
import { success } from "zod";
import sendResponse from "../../utils/sendResponse";
// import AppError from "../../errorHelpers/AppError";






// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // throw new Error("Fack error thorw")
//         // throw new AppError(httpStatusCode.BAD_REQUEST, "Fack error","")
//         const user = await userService.createUser(req.body);
//         res.status(httpStatusCode.CREATED).json({
//             message: "User create sucessfully!!",
//             user
//         })        
//     } catch (error) {        
//        next(error)
//     }
// }
const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
      const user = await userService.createUser(req.body);


        // res.status(httpStatusCode.CREATED).json({
        //     message: "User create sucessfully!!",
        //     user
        // }) 

        sendResponse(res, {
            success: true,
            message: "User create successfully!!",
            statusCode: httpStatusCode.CREATED,
            data: user,
        })
})

const getAllUsers = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    
        const result = await userService.getAllUsers();
        // res.status(httpStatusCode.OK).json({
        //     success: true,
        //     message: "All users Retrieved Successfully",
        //     data: users
        // })

         sendResponse(res, {
            success: true,
            message: "All users Retrieved Successfully!!",
            statusCode: httpStatusCode.OK,
            meta: result.meta,
            data: result.data,
           
        })
   
})

export const userController = {
    createUser,
    getAllUsers
}