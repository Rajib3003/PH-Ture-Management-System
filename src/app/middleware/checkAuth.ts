import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from '../errorHelpers/AppError';
import { verifytoken } from '../utils/jwt';
import { envVars } from '../config/env';



export const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction)=> {
    try {
        const accessToken = req.headers.authorization;

        if(!accessToken){
            throw new AppError(httpStatusCode.BAD_REQUEST, "accessToken is not access", "")
        }
    
        // const verifiedToken = jwt.verify(accessToken, "secret") 
        const verifiedToken = verifytoken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload 
        

        if(!authRoles.includes(verifiedToken.role)){
            throw new AppError(httpStatusCode.BAD_REQUEST, "This Role is not permitated", "")
        }
        
        next()
    } catch (error) {
        next(error)
    }
  
}