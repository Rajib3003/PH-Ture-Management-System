import httpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';
import { JwtPayload } from 'jsonwebtoken';


const createBooking = catchAsync(async (req: Request, res: Response)=>{
    const decodeToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(req.body, decodeToken.userId);
    sendResponse(res, {
        statusCode : httpStatusCode.CREATED,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
});

const getUserBookings = catchAsync(async(req:Request, res: Response)=>{
    const bookings = await BookingService.getUserBookings();
      sendResponse(res, {
        statusCode : httpStatusCode.OK,
        success: true,
        message: "Bookings recieved successfully",
        data: bookings,
    });
});
const getSingleBooking = catchAsync(async(req:Request, res:Response)=>{
    const booking = await BookingService.getBookingById();
      sendResponse(res, {
        statusCode : httpStatusCode.OK,
        success: true,
        message: "Booking retrieved successfully",
        data: booking,
    });
})
const getAllBookings = catchAsync(async(req:Request, res:Response)=>{
    const bookings = await BookingService.getAllBookings();
      sendResponse(res, {
        statusCode : httpStatusCode.OK,
        success: true,
        message: "Booking retrieved successfully",
        data: {bookings}
        // meta: {}
    });
})
const updateBookingStatus = catchAsync(async(req:Request, res:Response)=>{
    const updated = await BookingService.updateBookingStatus();
      sendResponse(res, {
        statusCode : httpStatusCode.OK,
        success: true,
        message: "Booking Status Updated successfully",
        data: updated,
        // meta: {}
    });
})

export const BookingController = {
    createBooking,
    getUserBookings,
    getSingleBooking,
    getAllBookings,   
    updateBookingStatus
}