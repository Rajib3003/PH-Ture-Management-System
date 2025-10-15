

import httpStatusCode from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TourService } from './tour.service';










const createTour = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result = await TourService.createTour(req.body);
    sendResponse(res, {
        success: true,
        message: "Tour create successfully!!",
        statusCode: httpStatusCode.CREATED,
        data: result,
    })
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {

    const query = req.query
    const result = await TourService.getAllTours(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tours retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});


const updateTour = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const tourId = req.params.id;
    const payload = req.body;
    const result = await TourService.updateTour(tourId, payload);
    sendResponse(res, {
        success: true,
        message: "Tour updated successfully!!",
        statusCode: httpStatusCode.OK,
        data: result
    })
}
);
const deleteTour = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const tourId = req.params.id;
    const result = await TourService.deleteTour(tourId);
    sendResponse(res, {
        success: true,
        message: "Tour deleted successfully!!",
        statusCode: httpStatusCode.OK,
        data: result
    })
});

const getAllTourTypes = catchAsync(async(req:Request, res: Response, next:NextFunction)=> {
    const result = await TourService.getAllTourTypes();
    sendResponse(res, {
        success: true,
        message: "All Tour Types get successfully!!",
        statusCode: httpStatusCode.OK,
        data: result,
    })
})  
const createTourType = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const {name} = req.body;
    const result = await TourService.createTourType(name);
    sendResponse(res, {
        success: true,
        message: "Tour Types create successfully!!",
        statusCode: httpStatusCode.CREATED,
        data: result
    })

})
const updateTourType = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const tourTypesId = req.params.id;
    const payload = req.body;
    const result = await TourService.updateTourType(tourTypesId, payload);
    sendResponse(res, {
        success: true,
        message: "Tour Type updated successfully!!",
        statusCode: httpStatusCode.OK,
        data: result
    })
}
);


const deleteTourType = catchAsync(async(req:Request, res: Response, next:NextFunction)=>{
    const tourTypesId = req.params.id;
    const result = await TourService.deleteTourType(tourTypesId);
    sendResponse(res, {
        success: true,
        message: "Tour Type deleted successfully!!",
        statusCode: httpStatusCode.OK,
        data: result
    })
});

export const TourController = {    
    createTour,
    getAllTours,    
    updateTour,
    deleteTour,
    getAllTourTypes,
    createTourType, 
    updateTourType,
    deleteTourType
}


