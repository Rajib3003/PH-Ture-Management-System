
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs, { hash } from 'bcryptjs';
import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
// import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken } from '../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import { IAuthProvider, isActived } from '../user/user.interface';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';


// const credentialsLogin = async (payload : Partial<IUser>) => {
//     const {email, password} = payload

//      const isUserExist = await User.findOne({email})
//             if(!isUserExist){
//                 throw new AppError(httpStatusCode.BAD_REQUEST, "Email does not Exist","");
//             }

//     const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

//     if (!isPasswordMatch){
//         throw new AppError(httpStatusCode.BAD_REQUEST, "Increect password!!","");
//     }

//     // const jwtPayload = {
//     //     userId: isUserExist._id,
//     //     email: isUserExist.email,
//     //     role: isUserExist.role,
//     // }

//     // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

//     // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)
    
//     const userTokens = createUserTokens(isUserExist)


//     // const accessToken = jwt.sign(jwtPayload, "secret", {
//     //     expiresIn : "1d"
//     // })

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: _password, ...userWithoutPassword } = isUserExist.toObject();



    
    

//     return {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: {
//             userWithoutPassword
//         }
//     }
    
// }
const getNewAccessToken = async (refreshToken: string) => {
    
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)


    return {
        accessToken : newAccessToken      
    }
    
}
const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    
    const user = await User.findById(decodedToken.userId)
    if(!user){
        throw new AppError(httpStatusCode.BAD_REQUEST, "auth service User do not recieved", "")
    }

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password as string)

    if(!isOldPasswordMatch){
        throw new AppError(httpStatusCode.BAD_REQUEST, "Old password does not match", "")
    }

    user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND)) 
    user.save();
    
}

const resetPassword = async (newPassword: string, id: string, decodedToken: JwtPayload) => {
    
   

    return{};
    
}
const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId)
    if(!user){
        throw new AppError(httpStatusCode.BAD_REQUEST, "auth service User do not recieved", "")
    }
    
    if(user.password && user.auths.some(providerObject=> providerObject.provider === "Google")){         
        throw new AppError(httpStatusCode.BAD_REQUEST, "You have already set you password . Now you can change the password from your profile password update", "")
    }

    const hashedPassword = await bcryptjs.hash(
        plainPassword, Number(envVars.BCRYPT_SALT_ROUND)
    )
    const credentialProvider : IAuthProvider = {
        provider : "credentials",
        providerId : user.email as string,
    }
    const auths: IAuthProvider[] = [...user.auths,  credentialProvider]
    user.password = hashedPassword
    user.auths = auths
    await user.save();
    
}
const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({email})

       if(!isUserExist){
            throw new AppError(httpStatusCode.BAD_REQUEST, "User does not Exist","");
        }
        if(!isUserExist.isVerified){
            throw new AppError(httpStatusCode.BAD_REQUEST, "User is not Verified Yet","");
        }
        if(isUserExist.isActived === isActived.BLOCKED || isUserExist.isActived === isActived.INACTIVE){
            throw new AppError(httpStatusCode.BAD_REQUEST, `User is ${isUserExist.isActived}`,"");
        }
        if(isUserExist.isDeleted){
            throw new AppError(httpStatusCode.BAD_REQUEST, "User is Deleted","");
        }

        const jwtPayload = {
            userId: isUserExist._id,
            email: isUserExist.email,
            role: isUserExist.role,
        }
    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
        expiresIn : "10m"
    })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`
    sendEmail({
        to: isUserExist.email as string,
        subject: "Password Reset Link",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink: resetUILink
        }
    })
}

export const AuthService = {
    // credentialsLogin,
    getNewAccessToken,
    changePassword,
    resetPassword,
    forgotPassword,
    setPassword
}