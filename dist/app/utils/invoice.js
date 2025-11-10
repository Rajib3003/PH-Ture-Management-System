"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.generatedPdf = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const generatedPdf = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on('data', (chunk) => buffer.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffer)));
            doc.on('error', (err) => reject(err));
            // HEADER
            doc
                .fontSize(26)
                .fillColor("#001F5B")
                .text("INVOICE", { align: "left" });
            doc.moveDown(0.5);
            doc
                .fontSize(12)
                .fillColor("#000")
                .text("Tour Booking Agency", 50, 80)
                .text("123 Travel Street, City, Country")
                .text("Email: info@travelagency.com");
            // Right-side invoice info
            const rightStart = 300;
            doc
                .fontSize(12)
                .text(`INVOICE #`, rightStart, 80, { continued: true })
                .font("Helvetica-Bold")
                .text(`${invoiceData.transactionId}`)
                .font("Helvetica")
                .text(`DATE`, rightStart, 100, { continued: true })
                .font("Helvetica-Bold")
                .text(`${invoiceData.bookingDate.toLocaleDateString()}`);
            // Divider
            doc.moveTo(50, 140).lineTo(550, 140).strokeColor("#E63946").stroke();
            // BILL TO section
            doc.moveDown(1);
            doc.font("Helvetica-Bold").fontSize(12).text("BILL TO", 50, 150);
            doc
                .font("Helvetica")
                .fontSize(11)
                .text(invoiceData.customerName)
                .text("Address: Provided by customer")
                .text("Email: user@email.com");
            // SHIP TO
            doc.font("Helvetica-Bold").fontSize(12).text("TOUR DETAILS", 300, 150);
            doc
                .font("Helvetica")
                .fontSize(11)
                .text(`Tour: ${invoiceData.tourTitle}`, 300)
                .text(`Guests: ${invoiceData.guestCount}`, 300)
                .text(`Status: Paid`, 300);
            // Divider
            doc.moveTo(50, 230).lineTo(550, 230).strokeColor("#E63946").stroke();
            // Table Headers
            doc
                .font("Helvetica-Bold")
                .fontSize(12)
                .text("QTY", 50, 240)
                .text("DESCRIPTION", 120, 240)
                .text("UNIT PRICE", 350, 240)
                .text("AMOUNT", 460, 240);
            // Line under header
            doc.moveTo(50, 255).lineTo(550, 255).strokeColor("#E63946").stroke();
            // Table Content (Single row for tour booking)
            doc
                .font("Helvetica")
                .fontSize(11)
                .text("1", 50, 270)
                .text(`${invoiceData.tourTitle}`, 120, 270)
                .text(`${invoiceData.totalAmount.toFixed(2)}`, 350, 270)
                .text(`${invoiceData.totalAmount.toFixed(2)}`, 460, 270);
            // Summary
            doc.font("Helvetica-Bold");
            doc.text("Subtotal", 350, 320).text(`${invoiceData.totalAmount.toFixed(2)}`, 460, 320);
            doc.text("Tax (0%)", 350, 340).text("0.00", 460, 340);
            doc.fontSize(13).fillColor("#001F5B").text("TOTAL", 350, 370).text(`$${invoiceData.totalAmount.toFixed(2)}`, 460, 370);
            // Signature
            doc.moveDown(3);
            doc.font("Helvetica-Oblique").fontSize(12).fillColor("#000").text("Authorized Signature", 400, 450);
            // Footer
            doc.moveDown(3);
            doc
                .font("Helvetica-Bold")
                .fillColor("#E63946")
                .fontSize(12)
                .text("TERMS & CONDITIONS", 50, 520);
            doc
                .font("Helvetica")
                .fillColor("#000")
                .fontSize(10)
                .text("Payment has been received in full for the above booking.")
                .text("Thank you for choosing our service!", { align: "center" });
            doc.moveDown(2);
            doc.font("Helvetica-Bold").fillColor("#001F5B").fontSize(20).text("Thank You!", { align: "center" });
            doc.end();
        });
    }
    catch (error) {
        console.log(error);
        throw new AppError_1.default(401, `PDF creation error ${error.message}`, "");
    }
});
exports.generatedPdf = generatedPdf;
