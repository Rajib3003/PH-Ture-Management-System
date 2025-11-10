"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment Not Found. You havve not booked this tour", "");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking);
    const userAddress = (booking === null || booking === void 0 ? void 0 : booking.user).address;
    const userEmail = (booking === null || booking === void 0 ? void 0 : booking.user).email;
    const userPhoneNumber = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
    const userName = (booking === null || booking === void 0 ? void 0 : booking.user).name;
    const sslPayload = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId,
    };
    const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL,
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // update Booking status to confirm 
    // update payment status to PAID
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.PAID,
        }, { runValidators: true, session: session });
        if (!updatedPayment) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found", "");
        }
        const updatedBooking = yield booking_model_1.Booking
            .findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.COMPLETE }, { new: true, runValidators: true, session })
            .populate("tour", "title")
            .populate("user", "name email");
        if (!updatedBooking) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found for generating invoice", "");
        }
        const invoiceData = {
            bookingDate: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.createdAt,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
            tourTitle: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.tour).title,
            customerName: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name,
            transactionId: updatedPayment.transactionId,
        };
        const pdfBuffer = yield (0, invoice_1.generatedPdf)(invoiceData);
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice_");
        if (!cloudinaryResult) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Failed to upload invoice to Cloudinary", "");
        }
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment._id, {
            invoiceUrl: cloudinaryResult.secure_url,
        }, { runValidators: true, session });
        console.log(cloudinaryResult);
        // `invoice_${updatedPayment.transactionId}`
        yield (0, sendEmail_1.sendEmail)({
            to: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email,
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
        });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment completed Successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // update Booking status to fail
    // update payment status to fail
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.FAILED,
        }, { runValidators: true, session: session });
        yield booking_model_1.Booking
            .findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.FAILED }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Failed" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // update Booking status to cancel 
    // update payment status to cancel
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCELLED,
        }, { runValidators: true, session: session });
        yield booking_model_1.Booking
            .findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.CANCELLED }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Cancelled" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getInvoiceDownloadUrl = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId)
        .select("invoiceUrl");
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment Not Found.", "");
    }
    if (!payment.invoiceUrl) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Invoice not found for this payment", "");
    }
    return payment.invoiceUrl;
});
exports.PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl
};
