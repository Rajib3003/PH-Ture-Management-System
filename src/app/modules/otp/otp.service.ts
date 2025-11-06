import httpStatusCode from 'http-status-codes';
import crypto from 'crypto';
import { redisClient } from '../../config/redis.config';
import { sendEmail } from '../../utils/sendEmail';
import AppError from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
const OTP_EXPIRATION = 2 * 60 ;

const generateOtp = (length = 6) => {
    const otp = crypto.randomInt(10**(length-1), 10**length).toString();
    return otp;
}

const sendOTP = async (
    email: string, name: string
) => {
    const user = await User.findOne({email});
    if(!user){
        throw new AppError(httpStatusCode.BAD_REQUEST, "User not found", "");
    }
    if(user.isVerified){
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is already verified", "");
    }

    const otp = generateOtp();
    const rediskey = `otp:${email}`;
    await redisClient.set(rediskey, otp, {
        expiration: {
            type: 'EX',
            value: OTP_EXPIRATION
        }
    } );

    sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp,
        }
    })


};

const verifyOTP = async (
    email: string, otp: string
) => {
        const user = await User.findOne({email});
    if(!user){
        throw new AppError(httpStatusCode.BAD_REQUEST, "User not found", "");
    }
    if(user.isVerified){
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is already verified", "");
    }
    const rediskey = `otp:${email}`;
    const savedOtp = await redisClient.get(rediskey);
    if(!savedOtp){
        throw new AppError(httpStatusCode.BAD_REQUEST, "Invlid OTP", "");
    }
    if(savedOtp !== otp){
        throw new AppError(httpStatusCode.BAD_REQUEST, "Invlid OTP", "");
    }   

    Promise.all([
        User.updateOne({email},{isVerified: true},{runValidators: true}),
        redisClient.del([rediskey])
    ])

    return{};
};

export const OtpService = {
    sendOTP,
    verifyOTP
};
