import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';
import { userSearchableFields } from './user.constant';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createUser = async (payload: Partial<IUser>) => {
        const {email, password, ...rest} = payload;

        const isUserExist = await User.findOne({email})
        if(isUserExist){
            throw new AppError(httpStatusCode.BAD_REQUEST, "User Already Exist","");
        }

        const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))        

        const authProvider: IAuthProvider = {provider: 'credentials', providerId: email as string}

        const user = await User.create({           
            email,        
            password: hashedPassword,      
            auths: [authProvider],
            ...rest
        })
        return user
}

const updateUser = async (userId : string, payload : Partial<IUser> , decodedToken : JwtPayload) => {
    const userIdExist = await User.findById(userId)

    if(!userIdExist){
        throw new AppError(httpStatusCode.NOT_FOUND, "User Id Not Found", "")
    }


    if(payload.role){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not Authorized", "")
        }
        if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
             throw new AppError(httpStatusCode.FORBIDDEN, "You are not Authorized", "")
        }
    }
    if(payload.isActived || payload.isDeleted || payload.isVerified){
         if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not Authorized", "")
        }
    }
    if(payload.password){
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }
    

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})
    
    return newUpdatedUser
}

const getAllUsers = async (query: Record<string, string>) => {
    // const users = await User.find({});
    // const totalUsers = await User.countDocuments();
    // return {
    //     data: users,
    //     meta: {
    //         total : totalUsers,
    //     }
    // };

    const queryBuilder = new QueryBuilder(User.find(), query );
    
        const users = queryBuilder
        .search(userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()
        
    
    
        const [data, meta] = await Promise.all([
            users.build(),
            queryBuilder.getMeta()
    
        ])
    
    
    
        return {
            data,
            meta
        }
}
const getMe = async (userId : string) => {
    const user = await User.findById(userId).select('-password -auths -__v');
    if(!user){
        throw new AppError(httpStatusCode.NOT_FOUND, "User Not Found", "")
    }
    return {
        data: user,
    }
}

export const userService = {
    createUser,
    updateUser,
    getMe,
    getAllUsers
}