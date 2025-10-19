/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatusCode from 'http-status-codes';

import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { SSLService } from '../sslCommerz/sslCommerz.service';




const initPayment = async (bookingId : string) => {

    const payment = await Payment.findOne({booking: bookingId})
    
    if(!payment){
        throw new AppError(httpStatusCode.NOT_FOUND, "Payment Not Found. You havve not booked this tour","");
    }

    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address
        const userEmail = (booking?.user as any).email
        const userPhoneNumber = (booking?.user as any).phone
        const userName = (booking?.user as any).name
    
        const sslPayload : ISSLCommerz = {
            address : userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: payment.amount,
            transactionId: payment.transactionId,
        } 
        
        const sslPayment = await SSLService.sslPaymentInit(sslPayload)
        
        return {
            paymentUrl : sslPayment.GatewayPageURL,
        }



}
const successPayment = async (query : Record<string, string>) => {
    // update Booking status to confirm 
    // update payment status to PAID

    
    const session = await Booking.startSession();
    session.startTransaction()
    try {    
    const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId},{        
        status: PAYMENT_STATUS.PAID,        
    },{runValidators:true, session:session})

    await Booking
    .findByIdAndUpdate(
        updatedPayment?.booking, 
        {status: BOOKING_STATUS.COMPLETE},
        {runValidators:true, session}
    )
    await session.commitTransaction();
    session.endSession();
    return {success : true, message: "Payment completed Successfully"}        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }

}



const failPayment = async (query : Record<string, string>) => {
    // update Booking status to fail
    // update payment status to fail

    const session = await Booking.startSession();
    session.startTransaction()
    try {    
    const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId},{        
        status: PAYMENT_STATUS.FAILED,        
    },{runValidators:true, session:session})

    await Booking
    .findByIdAndUpdate(
        updatedPayment?.booking, 
        {status: BOOKING_STATUS.FAILED},
        {runValidators:true, session}
    )
    await session.commitTransaction();
    session.endSession();
    return {success : false, message: "Payment Failed"}        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }
};
const cancelPayment = async (query : Record<string, string>) => {
    // update Booking status to cancel 
    // update payment status to cancel
    const session = await Booking.startSession();
    session.startTransaction()
    try {    
    const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId},{        
        status: PAYMENT_STATUS.CANCELLED,        
    },{runValidators:true, session:session})

    await Booking
    .findByIdAndUpdate(
        updatedPayment?.booking, 
        {status: BOOKING_STATUS.CANCELLED},
        {runValidators:true, session}
    )
    await session.commitTransaction();
    session.endSession();
    return {success : false, message: "Payment Cancelled"}        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }
};

export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
}