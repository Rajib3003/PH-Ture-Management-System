"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const env_1 = require("./env");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password"
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done(null, false, { message: "User does not exist" });
        }
        if (!isUserExist.isVerified) {
            // throw new AppError(httpStatusCode.BAD_REQUEST, "User is not Verified Yet","");
            return done("User is not Verified Yet");
        }
        if (isUserExist.isActived === user_interface_1.isActived.BLOCKED || isUserExist.isActived === user_interface_1.isActived.INACTIVE) {
            // throw new AppError(httpStatusCode.BAD_REQUEST, `User is ${isUserExist.isActived}`,"");
            return done(`User is ${isUserExist.isActived}`);
        }
        if (isUserExist.isDeleted) {
            // throw new AppError(httpStatusCode.BAD_REQUEST, "User is Deleted","");
            return done("User is Deleted");
        }
        const isGoogleAuthenticated = (_a = isUserExist.auths) === null || _a === void 0 ? void 0 : _a.some((providerObjects) => providerObjects.provider === "Google");
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, { message: "User is registered with Google. Please login with Google" });
        }
        if (!isUserExist.password) {
            return done(null, false, { message: "Password is not set for this user" });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatched) {
            return done(null, false, { message: "Password does not match" });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log("Local Strategy Error", error);
        done(error);
    }
})));
passport_1.default.use(
// strategy ke googlestrategy rename kore ai khane bosano hoiche 
new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // googleStrategy te hover korle show korbe accessToken , refreshToken, profile, done then oi khan theke copy kore function a bosaite hobe.
    try {
        // email ta profile 0 index theke value theke pabe 
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        // jodi email na pay ta hole akta message return korbe 
        if (!email) {
            return done(null, false, { message: "NO email found" });
        }
        // email ta diye database theke user ta niye asbe
        let isUserExist = yield user_model_1.User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
            // throw new AppError(httpStatusCode.BAD_REQUEST, "User is not Verified Yet","");           
            return done(null, false, { message: "User is not Verified Yet" });
        }
        if (isUserExist && (isUserExist.isActived === user_interface_1.isActived.BLOCKED || isUserExist.isActived === user_interface_1.isActived.INACTIVE)) {
            // throw new AppError(httpStatusCode.BAD_REQUEST, `User is ${isUserExist.isActived}`,"");
            return done(`User is ${isUserExist.isActived}`);
        }
        if (isUserExist && isUserExist.isDeleted) {
            // throw new AppError(httpStatusCode.BAD_REQUEST, "User is Deleted","");
            return done(null, false, { message: "User is Deleted" });
        }
        // jodi user na pay ta hole new akta user create korbe tar jonno niche ja ja dorkar ta information dite hobe beshi kore profile theke information paoya jabe.
        if (!isUserExist) {
            isUserExist = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: user_interface_1.Role.USER,
                isVerified: true,
                auths: [
                    {
                        provider: "Google",
                        providerId: profile.id
                    }
                ]
            });
        }
        // done ar maje 3 ta argument dite hoy. doner upore hover korle show kore, 2nd argument a user return korte hobe.
        return done(null, isUserExist);
    }
    catch (error) {
        console.log("Google strategy Error", error);
        // next er maje jemon error dite hoiche temon done ar maje error diye dibo.
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
// frontend localhost : 5173 -> localhost:5000/api/v1/auth/google -> passport -> google OAuth consent -> gmail login -> successful ->callback url localhost: 5000/api/v1/auth/google/callback ->
//Bridge ==
//custom -> email, password, role: USER, name... -> registration -> DB -> 1 User create
//google -> req -> google -> successful : jwt Token: Role,email, -> DB -> store
