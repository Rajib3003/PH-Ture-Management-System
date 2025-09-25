import bcryptjs from 'bcryptjs';
import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import { createUserTokens } from '../../utils/userTokens';

const credentialsLogin = async (payload : Partial<IUser>) => {
    const {email, password} = payload

     const isUserExist = await User.findOne({email})
            if(!isUserExist){
                throw new AppError(httpStatusCode.BAD_REQUEST, "Email does not Exist","");
            }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatch){
        throw new AppError(httpStatusCode.BAD_REQUEST, "Increect password!!","");
    }

    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role,
    // }

    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    // const refershToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)
    
    const userTokens = createUserTokens(isUserExist)


    // const accessToken = jwt.sign(jwtPayload, "secret", {
    //     expiresIn : "1d"
    // })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = isUserExist.toObject();



    
    

    return {
        accessToken: userTokens.accessToken,
        refershToken: userTokens.refershToken,
        user: {
            userWithoutPassword
        }
    }
    
}

export const AuthService = {
    credentialsLogin
}