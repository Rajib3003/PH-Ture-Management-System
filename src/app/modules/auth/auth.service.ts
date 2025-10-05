import bcryptjs from 'bcryptjs';
import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
// import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken } from '../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';


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
const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    
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

export const AuthService = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword
}