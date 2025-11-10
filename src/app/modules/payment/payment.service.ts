/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatusCode from 'http-status-codes';

import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { generatedPdf, IInvoiceData } from '../../utils/invoice';
import { ITour } from '../tour/tour.interface';
import { IUser } from '../user/user.interface';
import { sendEmail } from '../../utils/sendEmail';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config';





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

    if(!updatedPayment) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Payment not found", "")
    }

   const updatedBooking = await Booking
    .findByIdAndUpdate(
        updatedPayment?.booking, 
        {status: BOOKING_STATUS.COMPLETE},
        {new : true, runValidators:true, session}
    )
    .populate("tour", "title")
    .populate("user","name email");

    if(!updatedBooking) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Booking not found for generating invoice", "")
    }

    const invoiceData: IInvoiceData = {
        bookingDate: updatedBooking?.createdAt as Date,
        guestCount: updatedBooking.guestCount,
        totalAmount: updatedPayment.amount,
        tourTitle: (updatedBooking?.tour as unknown as ITour).title,
        customerName: (updatedBooking?.user as unknown as IUser).name,        
        transactionId: updatedPayment.transactionId, 
    }

    const pdfBuffer = await generatedPdf(invoiceData)

    const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer,"invoice_");

    if(!cloudinaryResult) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Failed to upload invoice to Cloudinary", "")
    }

    await Payment.findByIdAndUpdate(updatedPayment._id,{
        invoiceUrl : cloudinaryResult.secure_url,
    },{runValidators:true, session})
    
    console.log(cloudinaryResult);

    // `invoice_${updatedPayment.transactionId}`


    await sendEmail({
        to: (updatedBooking?.user as unknown as IUser).email,
        subject: "Your Booking Invoice",
        templateName: "invoice",
        // templateData: {
        //     name: (updatedBooking?.user as unknown as IUser).name,
        //     tourTitle: (updatedBooking?.tour as unknown as ITour).title,
        //     bookingDate: updatedBooking?.createdAt as Date,
        //     guestCount: updatedBooking.guestCount,
        //     totalAmount: updatedPayment.amount,
        //     transactionId: updatedPayment.transactionId,
        // },   
        templateData: invoiceData,     
        attachments: [
            {
                filename: `invoice_${updatedPayment.transactionId}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            }
        ]
    })



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
const getInvoiceDownloadUrl = async (paymentId : string) => {
    const payment = await Payment.findById(paymentId)
    .select("invoiceUrl");

    if(!payment){
        throw new AppError(httpStatusCode.NOT_FOUND, "Payment Not Found.","");
    }

    if(!payment.invoiceUrl){
        throw new AppError(httpStatusCode.NOT_FOUND, "Invoice not found for this payment", "");
    }

    return  payment.invoiceUrl
     
};

export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl
}