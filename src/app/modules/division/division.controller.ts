/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatusCode  from 'http-status-codes';
import {  NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from '../../utils/sendResponse';
import { divisionService } from './division.service';





const createDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const division = await divisionService.createDivision(req.body);
    sendResponse(res, {
        success: true,
        message: "Division create successfully!!",
        statusCode: httpStatusCode.CREATED,
        data: division
    })


})

const getAllDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=> {
    const result = await divisionService.getAllDivision();
    sendResponse(res, {
        success: true,
        message: "All Division get successfully!!",
        statusCode: httpStatusCode.OK,
        meta: result.meta,
        data: result.data
    })
})

const updateDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const divisionId = req.params.id;
    const payload = req.body;
    const updatedDivision = await divisionService.updateDivision(divisionId, payload);
    sendResponse(res, {
        success: true,
        message: "Division updated successfully!!",
        statusCode: httpStatusCode.OK,
        data: updatedDivision
    })
});
const deleteDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    // delete logic will be implemented here
    const divisionId = req.params.id;
    const deletedDivision = await divisionService.deleteDivision(divisionId);
    sendResponse(res, {
        success: true,
        message: "Division deleted successfully!!",
        statusCode: httpStatusCode.OK,
        data: deletedDivision
    })
});

export const divisionController = {
    createDivision,
    getAllDivision,
    updateDivision,
    deleteDivision
}