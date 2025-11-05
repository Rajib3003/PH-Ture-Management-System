/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";
// import fs from "fs";


const transporter = nodemailer.createTransport({
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
})

interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;    
    templateData?: Record<string, any>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType?: string;
    }[];
};

// http://localhost:5173/reset-password?id=690aeb3a7996b7afd8a65fd6&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBhZWIzYTc5OTZiN2FmZDhhNjVmZDYiLCJlbWFpbCI6InJhamliMjU1LmJzbEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc2MjMyOTc0OCwiZXhwIjoxNzYyMzMwMzQ4fQ.fhoKXmo_b6W6CnUajrzLpuZaakUmAUFpS7iJUQlBVes


export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments,
}: SendEmailOptions) => {

    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData || {});

        const info = await transporter.sendMail({
        from: envVars.EMAIL_SENDER.SMTP_FROM,
        to: to,   
        subject: subject,
        html: html,
        attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
        })),
    });
    console.log(`\u2709\uFE0F Email sent to ${to}:${info.messageId}`);
    } catch (error:any) {
        console.log("Email sending error", error.message)
        throw new AppError(401,"Failed to send email", "");
    }
}