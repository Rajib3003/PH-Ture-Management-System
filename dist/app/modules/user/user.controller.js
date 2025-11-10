"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
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
exports.userController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
// import AppError from "../../errorHelpers/AppError";
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // throw new Error("Fack error thorw")
//         // throw new AppError(httpStatusCode.BAD_REQUEST, "Fack error","")
//         const user = await userService.createUser(req.body);
//         res.status(httpStatusCode.CREATED).json({
//             message: "User create sucessfully!!",
//             user
//         })        
//     } catch (error) {        
//        next(error)
//     }
// }
const createUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.createUser(req.body);
    // res.status(httpStatusCode.CREATED).json({
    //     message: "User create sucessfully!!",
    //     user
    // }) 
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User create successfully!!",
        statusCode: http_status_codes_1.default.CREATED,
        data: user,
    });
}));
const updatedUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    // const token = req.headers.authorization;
    // const verifiedToken = verifytoken(token as string, envVars.JWT_ACCESS_SECRET ) as JwtPayload
    const verifiedToken = req.user;
    if (!verifiedToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, " Decoded token is not recieved ", "");
    }
    const user = yield user_service_1.userService.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User updated successfully!!",
        statusCode: http_status_codes_1.default.CREATED,
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield user_service_1.userService.getAllUsers(query);
    // res.status(httpStatusCode.OK).json({
    //     success: true,
    //     message: "All users Retrieved Successfully",
    //     data: users
    // })
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "All users Retrieved Successfully!!",
        statusCode: http_status_codes_1.default.OK,
        meta: result.meta,
        data: result.data,
    });
}));
const getMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.userService.getMe(decodedToken.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Your profile Retrieved Successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result.data,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield user_service_1.userService.getMe(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User Retrieved Successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result.data,
    });
}));
exports.userController = {
    createUser,
    updatedUser,
    getMe,
    getAllUsers,
    getSingleUser
};
