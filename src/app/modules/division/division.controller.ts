import  httpStatusCode  from 'http-status-codes';
import {  NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from '../../utils/sendResponse';
import { divisionService } from './division.service';




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const division = await divisionService.createDivision(req.body);
    sendResponse(res, {
        success: true,
        message: "Division create successfully!!",
        statusCode: httpStatusCode.CREATED,
        data: division
    })


})

export const divisionController = {
    createDivision
}