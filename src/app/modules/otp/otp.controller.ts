import httpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from '../../utils/sendResponse';
import { OtpService } from './otp.service';

const sendOTP = catchAsync(async(req:Request, res: Response) => {
    const { email, name } = req.body;

    await OtpService.sendOTP(email, name);
    
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "OTP sent successfully",
        data: null,
    });

});
const verifyOTP = catchAsync(async(req:Request, res: Response) => {
    const { email, otp } = req.body;

    await OtpService.verifyOTP(email, otp);
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
});

export const OtpController = {
    sendOTP,
    verifyOTP
};