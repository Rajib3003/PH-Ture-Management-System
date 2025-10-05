/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from './env';
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { User } from '../modules/user/user.model';
import { Role } from '../modules/user/user.interface';
import { Strategy as LoacalStrategy } from 'passport-local';
import bcryptjs from 'bcryptjs';

passport.use(
    new LoacalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async(email:string, password:string, done)=>{
        try {
            const isUserExist = await User.findOne({email})

            if(!isUserExist){
                return done(null, false, {message: "User does not exist"})
            }

            const isGoogleAuthenticated = isUserExist.auths?.some((providerObjects)=> providerObjects.provider === "Google")

            if(isGoogleAuthenticated && !isUserExist.password){
                return done(null, false, {message: "User is registered with Google. Please login with Google"})
            }

            if(!isUserExist.password){
                return done(null, false, {message: "Password is not set for this user"})
            }


            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
            if(!isPasswordMatched){
                return done(null, false, {message: "Password does not match"});
            }
            return done(null, isUserExist)
        } catch (error) {
            console.log("Local Strategy Error", error)
            done(error)
        }
    })
)

passport.use(
    // strategy ke googlestrategy rename kore ai khane bosano hoiche 
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback)=>{
        // googleStrategy te hover korle show korbe accessToken , refreshToken, profile, done then oi khan theke copy kore function a bosaite hobe.
        try {
            // email ta profile 0 index theke value theke pabe 
            const email = profile.emails?.[0].value;
            // jodi email na pay ta hole akta message return korbe 
            if(!email){
                return done(null, false, {message: "NO email found"})
            }
            // email ta diye database theke user ta niye asbe
            let user = await User.findOne({email})
            // jodi user na pay ta hole new akta user create korbe tar jonno niche ja ja dorkar ta information dite hobe beshi kore profile theke information paoya jabe.
            if(!user){
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "Google",
                            providerId: profile.id
                        }
                    ]
                })
            }
            // done ar maje 3 ta argument dite hoy. doner upore hover korle show kore, 2nd argument a user return korte hobe.
            return done(null, user)
        } catch (error) {
            console.log("Google strategy Error",error)
            // next er maje jemon error dite hoiche temon done ar maje error diye dibo.
            return done(error)
        }
    })
)


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void)=>{
    done(null, user._id)
})

passport.deserializeUser(async(id: string, done : any)=>{
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error)
        done(error)
    }
})

// frontend localhost : 5173 -> localhost:5000/api/v1/auth/google -> passport -> google OAuth consent -> gmail login -> successful ->callback url localhost: 5000/api/v1/auth/google/callback ->

//Bridge ==
//custom -> email, password, role: USER, name... -> registration -> DB -> 1 User create

//google -> req -> google -> successful : jwt Token: Role,email, -> DB -> store