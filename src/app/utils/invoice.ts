
/* eslint-disable @typescript-eslint/no-explicit-any */

import PDFDocument from 'pdfkit';
import AppError from '../errorHelpers/AppError';

export interface IInvoiceData {
    transactionId: string;
    bookingDate: Date;
    customerName: string;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
    // Add other relevant fields as needed
}

export const generatedPdf = async (invoiceData: IInvoiceData) : Promise<Buffer<ArrayBufferLike>> => {
    try {
        return new Promise((resolve, reject)=> {            

            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const buffer: Uint8Array[] = [];

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

        })
    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `PDF creation error ${error.message}`, "");
    }
}