import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from '../errorHelpers/AppError';
import { verifytoken } from '../utils/jwt';
import { envVars } from '../config/env';
import { User } from '../modules/user/user.model';
import { isActived } from '../modules/user/user.interface';




export const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction)=> {
    try {
        const accessToken = req.headers.authorization;

        if(!accessToken){
            throw new AppError(httpStatusCode.BAD_REQUEST, "accessToken is not access", "")
        }
    
        // const verifiedToken = jwt.verify(accessToken, "secret") 
        const verifiedToken = verifytoken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload 

         const isUserExist = await User.findOne({email: verifiedToken.email})
            if(!isUserExist){
                throw new AppError(httpStatusCode.BAD_REQUEST, "User does not Exist","");
            }
            if(!isUserExist.isVerified){
                throw new AppError(httpStatusCode.BAD_REQUEST, "User is not Verified Yet","");
            }
            if(isUserExist.isActived === isActived.BLOCKED || isUserExist.isActived === isActived.INACTIVE){
                throw new AppError(httpStatusCode.BAD_REQUEST, `User is ${isUserExist.isActived}`,"");
            }
            if(isUserExist.isDeleted){
                throw new AppError(httpStatusCode.BAD_REQUEST, "User is Deleted","");
            }
            
        

        if(!authRoles.includes(verifiedToken.role)){
            throw new AppError(httpStatusCode.BAD_REQUEST, "This Role is not permitated", "")
        }
        req.user = verifiedToken
        next()
    } catch (error) {
        next(error)
    }
  
}