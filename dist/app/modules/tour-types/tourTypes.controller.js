"use strict";
// import httpStatusCode from 'http-status-codes';
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextFunction, Request, Response } from "express";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { tourTypesService } from './tourTypes.service';
// const createTourTypes = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
//     const tourTypes = await tourTypesService.createTourTypes(req.body);
//     sendResponse(res, {
//         success: true,
//         message: "Tour Types create successfully!!",
//         statusCode: httpStatusCode.CREATED,
//         data: tourTypes
//     })
// })
// const getAllTourTypes = catchAsync(async(req:Request, res: Response, next:NextFunction)=> {
//     const result = await tourTypesService.getAllTourTypes();
//     sendResponse(res, {
//         success: true,
//         message: "All Tour Types get successfully!!",
//         statusCode: httpStatusCode.OK,
//         meta: result.meta,
//         data: result.data
//     })
// })  
// const updateTourTypes = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
//     const tourTypesId = req.params.id;
//     const payload = req.body;
//     const updatedTourTypes = await tourTypesService.updateTourTypes(tourTypesId, payload);
//     sendResponse(res, {
//         success: true,
//         message: "Tour Types updated successfully!!",
//         statusCode: httpStatusCode.OK,
//         data: updatedTourTypes
//     })
// }
// );
// const deleteTourTypes = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
//     const tourTypesId = req.params.id;
//     const deletedTourTypes = await tourTypesService.deleteTourTypes(tourTypesId);
//     sendResponse(res, {
//         success: true,
//         message: "Tour Types deleted successfully!!",
//         statusCode: httpStatusCode.OK,
//         data: deletedTourTypes
//     })
// });
// export const tourTypesController = {
//     createTourTypes,
//     getAllTourTypes,
//     updateTourTypes,
//     deleteTourTypes
// }
