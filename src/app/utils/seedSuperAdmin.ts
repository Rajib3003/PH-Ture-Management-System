import { envVars } from './../config/env';
import { User } from "../modules/user/user.model"
import { IAuthProvider, IUser, Role } from '../modules/user/user.interface';
import bcrypt from "bcryptjs"

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})

        if(isSuperAdminExist){
            console.log("Super Admin Allready Exist!!");
            return;
        }

        console.log("Trying to create super admin... ")

        const provider : IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL,

        }
        const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))
        const payload: IUser = {
            name: "super admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            auths: [provider],
            isVerified: true,


        }
        const superAdmin = User.create(payload) 
        console.log("super admin created successfully \n")
        console.log(superAdmin)

    } catch (error) {
        console.log(error)
    }
}