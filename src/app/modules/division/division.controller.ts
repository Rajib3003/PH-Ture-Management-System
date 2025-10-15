/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatusCode  from 'http-status-codes';
import {  NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from '../../utils/sendResponse';
import { DivisionService } from './division.service';





const createDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const result = await DivisionService.createDivision(req.body);
    sendResponse(res, {
        success: true,
        message: "Division create successfully!!",
        statusCode: httpStatusCode.CREATED,
        data: result,
    });
});

const getAllDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=> {

    const result = await DivisionService.getAllDivision();
    sendResponse(res, {
        success: true,
        message: "All Division get successfully!!",
        statusCode: httpStatusCode.OK,
        meta: result.meta,
        data: result.data
    });
});

const getSingleDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=> {
    const slug = req.params.slug;
    const result = await DivisionService.getSingleDivision(slug);
    sendResponse(res, {
        success: true,
        message: "Single Division get successfully!!",
        statusCode: httpStatusCode.OK,
        data: result.data
    });

});

const updateDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const divisionId = req.params.id;
    const payload = req.body;
    const result = await DivisionService.updateDivision(divisionId, payload);
    sendResponse(res, {
        success: true,
        message: "Division updated successfully!!",
        statusCode: httpStatusCode.OK,
        data: result,
    });
});
const deleteDivision = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    // delete logic will be implemented here
    const divisionId = req.params.id;
    const result = await DivisionService.deleteDivision(divisionId);
    sendResponse(res, {
        success: true,
        message: "Division deleted successfully!!",
        statusCode: httpStatusCode.OK,
        data: result,
    })
});

export const DivisionController = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
}