
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
            const doc = new PDFDocument({size: "A4", margin: 50});
            const buffer: Uint8Array[] = [];

            doc.on('data', (chunk)=> buffer.push(chunk));
            doc.on('end', ()=> resolve(Buffer.concat(buffer)))
            doc.on('error', (err)=> reject(err))

            // PDF content

            doc.fontSize(20).text('Invoice', {align: 'center'});
            doc.moveDown();
            doc.fontSize(12).text(`Transaction ID: ${invoiceData.transactionId}`, {
                align: 'left'
            });
            doc.moveDown();
            doc.text(`Booking Date: ${invoiceData.bookingDate.toDateString()}`);
            doc.moveDown();
            doc.text(`Customer: ${invoiceData.customerName}`);
            doc.moveDown();
            doc.text(`Tour: ${invoiceData.tourTitle}`);
            doc.moveDown();
            doc.text(`Number of Guests: ${invoiceData.guestCount}`);
            doc.moveDown();
            doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);
            doc.moveDown();
            doc.text('Thank you for your booking!', {align: 'center'});

            doc.end();

        })
    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `PDF creation error ${error.message}`, "");
    }
}