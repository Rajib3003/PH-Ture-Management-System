
import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import { userService } from "./user.service";
// import AppError from "../../errorHelpers/AppError";

const createUser = async (req: Request, res: Response, next: NextFunction) => {


    try {
        // throw new Error("Fack error thorw")
        // throw new AppError(httpStatusCode.BAD_REQUEST, "Fack error","")

        const user = await userService.createUser(req.body);
        res.status(httpStatusCode.CREATED).json({
            message: "User create sucessfully!!",
            user
        })        
    } catch (error) {        
       next(error)
    }
}

export const userController = {
    createUser
}