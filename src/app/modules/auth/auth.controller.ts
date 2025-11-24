
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from './auth.service';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookie';
import { createUserTokens } from '../../utils/userTokens';
import { envVars } from '../../config/env';
import passport from 'passport';
import { JwtPayload } from 'jsonwebtoken';

const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

    // const loginInfo = await AuthService.credentialsLogin(req.body);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (err:any, user: any, info: any)=>{
        if(err){
            return next(err)
            // return next(new AppError(err.httpStatusCode || 401, err.message, ""))
        }
        if(!user){
            return next(new AppError(httpStatusCode.UNAUTHORIZED, info.message, ""))
        }

        const { password: _password, ...userWithoutPassword } = user.toObject();
        const userTokens = createUserTokens(user)
       
        
        setAuthCookie(res, userTokens)
        sendResponse(res, {
            success: true,
            message: "User Logined In Successfully!!",
            statusCode: httpStatusCode.OK,
            data: {
                accessToken : userTokens.accessToken,
                refreshToken : userTokens.refreshToken,
                user: userWithoutPassword
            },
        })
    })(req, res, next)

    // res.cookie("accessToken", loginInfo.accessToken,{
    //     httpOnly: true,
    //     secure: false,
    // })
    // res.cookie("refreshToken", loginInfo.refreshToken,{
    //     httpOnly: true,
    //     secure: false,
    // })

    // setAuthCookie(res, loginInfo)


    // sendResponse(res, {
    //     success: true,
    //     message: "User Login successfully!!",
    //     statusCode: httpStatusCode.OK,
    //     data: loginInfo,
    // })
})

const getNewAccessToken = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError(httpStatusCode.BAD_REQUEST, "No refresh token recieved from cookies", "")
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);    
    setAuthCookie(res, tokenInfo)
    sendResponse(res, {
        success: true,
        message: "User access recieved successfully!!",
        statusCode: httpStatusCode.OK,
        data: tokenInfo,
    })
})
const logout = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    res.clearCookie("accessToken",{
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })

    sendResponse(res, {
        success: true,
        message: "User logged successfully!!",
        statusCode: httpStatusCode.OK,
        data: null,
    })
})
const changePassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    if(!decodedToken){
        throw new AppError(httpStatusCode.BAD_REQUEST, " Decoded token is not recieved ", "")
    }

    await AuthService.changePassword(oldPassword, newPassword, decodedToken)

    sendResponse(res, {
        success: true,
        message: "Password Changed successfully!!",
        statusCode: httpStatusCode.OK,
        data: null,
    })
})
const resetPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    
   
    
     const decodedToken = req.user;

    if(!decodedToken){
        throw new AppError(httpStatusCode.BAD_REQUEST, " Decoded token is not recieved ", "")
    }

    await AuthService.resetPassword(req.body, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        message: "Password Changed successfully!!",
        statusCode: httpStatusCode.OK,
        data: null,
    })
})
const setPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    
    const decodedToken = req.user as JwtPayload;
    const {password} = req.body

    if(!decodedToken){
        throw new AppError(httpStatusCode.BAD_REQUEST, " Decoded token is not recieved ", "")
    }

    await AuthService.setPassword( decodedToken.userId, password)

    sendResponse(res, {
        success: true,
        message: "Password Changed successfully!!",
        statusCode: httpStatusCode.OK,
        data: null,
    })
})
const forgotPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    
    
    const {email} = req.body

  

    await AuthService.forgotPassword(email)

    sendResponse(res, {
        success: true,
        message: "Email sent successfully!!",
        statusCode: httpStatusCode.OK,
        data: null,
    })
})
const googleCallbackController= catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    let redirectTo = req.query.state ? req.query.state as string : "";
    if(redirectTo.startsWith("/")){
        redirectTo = redirectTo.slice(1)
    }


    const user = req.user;

    if(!user){
        throw new AppError(httpStatusCode.NOT_FOUND,"User Not Found","")
    }
    const tokenInfo = createUserTokens(user);

    setAuthCookie(res,tokenInfo)
    
    // sendResponse(res, {
    //     success: true,
    //     message: "Password Changed successfully!!",
    //     statusCode: httpStatusCode.OK,
    //     data: null,
    // })
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})



export const AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    resetPassword,    
    setPassword,  
    forgotPassword,  
    googleCallbackController
}