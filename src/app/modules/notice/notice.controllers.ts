/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatusCode  from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { NoticeService } from './notice.service';
import { INotice } from './notice.interfaces';





const createNotice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload : INotice = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map(file=>file.path)
    }    
    const result = await NoticeService.createNotice(payload)    
    sendResponse(res, {
      success: true,
      message: "Notice created successfully!",
      statusCode: httpStatusCode.CREATED,
      data: result,
    });
  }
);

const getAllNotices = catchAsync(async(req: Request, res:Response,next: NextFunction)=>{
  const query = req.query
  const result = await NoticeService.getAllNotices(query as Record<string, string>)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Notice retrieved successfully',
    data: result.data,
    meta: result.meta,

  })
})

const getSingleNotice = catchAsync(async(req: Request, res:Response,next: NextFunction)=>{
  const slug = req.params.slug;
  const result = await NoticeService.getSingleNotice(slug);
   sendResponse(res, {
        success: true,
        message: "Single Notice get successfully!!",
        statusCode: httpStatusCode.OK,
        data: result.data
    });

})

const updateNotice = catchAsync(async(req: Request, res:Response,next: NextFunction)=>{
  const noticeId = req.params.id
  const payload : INotice = {
    ...req.body,
    images : (req.files as Express.Multer.File[]).map(file=>file.path)
  }

  const result = await NoticeService.updateNotice(noticeId, payload);
    sendResponse(res, {
          success: true,
          message: "Notice updated successfully!!",
          statusCode: httpStatusCode.OK,
          data: result
      })
})
const deleteNotice = catchAsync(async(req: Request, res:Response,next: NextFunction)=>{
  const noticeId = req.params.id


  const result = await NoticeService.deleteNotice(noticeId);
    sendResponse(res, {
          success: true,
          message: "Notice delete successfully!!",
          statusCode: httpStatusCode.OK,
          data: result
      })
})

const getAllNoticeTypes = catchAsync(async(req: Request, res:Response,next: NextFunction)=>{
  const result = await NoticeService.getAllNoticeTypes();
    sendResponse(res, {
        success: true,
        message: "All Notice Types get successfully!!",
        statusCode: httpStatusCode.OK,
        data: result,
    })
})
const createNoticeType = catchAsync(async(req: Request, res:Response,next: NextFunction)=>{
  const {name} = req.body
  const result = await NoticeService.createNoticeType(name);
    sendResponse(res, {
        success: true,
        message: "Notice Types successfully!!",
        statusCode: httpStatusCode.CREATED,
        data: result,
    })
})
const updateNoticeType = catchAsync(async(req: Request, res:Response,next: NextFunction)=>{
  const noticeTypesId = req.params.id;
  const payload = req.body
  const result = await NoticeService.updateNoticeType(noticeTypesId, payload);
    sendResponse(res, {
        success: true,
        message: "Notice Type updated successfully!!",
        statusCode: httpStatusCode.OK,
        data: result,
    })
})
const deleteNoticeType = catchAsync(async(req: Request, res:Response,next: NextFunction)=>{
  const noticeTypesId = req.params.id;
  
  const result = await NoticeService.deleteNoticeType(noticeTypesId);
    sendResponse(res, {
        success: true,
        message: "Notice Type deleted successfully!!",
        statusCode: httpStatusCode.OK,
        data: result,
    })
})





export const NoticeController = {
  createNotice,
  getAllNotices,
  getSingleNotice,
  updateNotice,
  deleteNotice,
  getAllNoticeTypes,
  createNoticeType,
  updateNoticeType,
  deleteNoticeType,
}




