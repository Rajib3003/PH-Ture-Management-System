import httpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatsService } from './stats.service';



const getBookingStats = catchAsync(async(req : Request, res: Response) => {
    const result = await StatsService.getBookingStats();    
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "Booking stats fetched successfully",
        data: result,
    });
});

const getPaymentStats = catchAsync(async(req : Request, res: Response) => {
    const result = await StatsService.getPaymentStats();    
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "Payment stats fetched successfully",
        data: result,
    });
});
const getUserStats = catchAsync(async(req : Request, res: Response) => {
    const result = await StatsService.getUserStats();    
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "User stats fetched successfully",
        data: result,
    });
});
const getTourStats = catchAsync(async(req : Request, res: Response) => {
    const result = await StatsService.getTourStats();    
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "Tour stats fetched successfully",
        data: result,
    });
});

export const StatsController = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats
};