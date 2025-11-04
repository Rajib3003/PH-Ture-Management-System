/* eslint-disable @typescript-eslint/no-explicit-any */
import  httpStatusCode  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model"
import { BOOKING_STATUS, IBooking } from "./booking.interface"
import { Booking } from './booking.model';
import { Payment } from '../payment/payment.model';
import { PAYMENT_STATUS } from '../payment/payment.interface';
import { Tour } from '../tour/tour.model';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { bookingSearchableFields } from './booking.constant';
import { getTransactionId } from '../../utils/getTransactionId';




const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    
    const transactionId = getTransactionId()


    const session = await Booking.startSession();
    session.startTransaction()
    try {

         const user = await User.findById(userId);
 
    if(!user?.phone || !user.address){
        throw new AppError(httpStatusCode.BAD_REQUEST, "Please Update Your Profile to Book a Tour phone number and address","");
    }

    const tour = await Tour.findById(payload.tour).select("costFrom")

    if(!tour?.costFrom){
        throw new AppError(httpStatusCode.BAD_REQUEST, "No Tour Cost Found","")
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom) * Number(payload.guestCount!)
    console.log(amount)

    const booking = await Booking.create([{
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    }],{session})
    const payment = await Payment.create([{
        booking : booking[0]._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transactionId,
        amount: amount,
    }],{session})

    const updatedBooking = await Booking
    .findByIdAndUpdate(
        booking[0]._id, 
        {payment: payment[0]._id},
        {new: true, runValidators:true, session}
    )
    .populate("user","name email phone address")
    .populate("tour", "title costFrom")
    .populate("payment");

    const userAddress = (updatedBooking?.user as any).address
    const userEmail = (updatedBooking?.user as any).email
    const userPhoneNumber = (updatedBooking?.user as any).phone
    const userName = (updatedBooking?.user as any).name

    const sslPayload : ISSLCommerz = {
        address : userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: amount,
        transactionId: transactionId
    } 
    
    const sslPayment = await SSLService.sslPaymentInit(sslPayload)
    

    await session.commitTransaction();
    session.endSession();

    return {
        paymentURL: sslPayment.GatewayPageURL,
        booking: updatedBooking
    }
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }

   
}

const getAllBookings = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Booking.find(), query );
    
    const divisions = queryBuilder
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()         

    const [data, meta] = await Promise.all([
        divisions.build(),
        queryBuilder.getMeta()    
    ])         

    return {
        data,
        meta
    }
   
}
const getBookingById = async (bookingId : string) => {
    // const bookingId = payload.
    const result = await Booking.findById(bookingId)
    
     return {
        data: result,
    }
}

const getUserBookings = async (userId : string) => {
    const result = await Booking.find({ user: userId })    
    return {
        data: result,
    }
}

const updateBookingStatus = async (bookingId: string, status: string) => {
   
    const result = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true, runValidators: true })
      return {
        data: result,
    }
}





export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    getAllBookings,    
    updateBookingStatus
}