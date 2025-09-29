import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export enum isActived {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProvider {
    provider : "Google" | "credentials"; //Google , credential(email password)
    providerId : string;
}


export interface IUser {
    _id?: Types.ObjectId
    name : string;
    email : string ;
    password ?: string; 
    phone ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: string;
    isActived ?: isActived;
    isVerified ?: boolean;
    role : Role;
    auths : IAuthProvider[];
    booking ?: Types.ObjectId[];
    guides ?: Types.ObjectId[];
}