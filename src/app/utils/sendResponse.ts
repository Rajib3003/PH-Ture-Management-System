import { Response } from "express";


interface TMeta {
    page: number;
    limit: number;
    totalPage: number;
    total : number;
};

interface TResponse<T>{
    success: boolean;
    message: string;
    statusCode: number;
    data: T;
    meta?: TMeta;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.statusCode).json({
        success : data.success,
        message: data.message,
        statuscode: data.statusCode,
        meta: data.meta,
        data: data.data,
        
    })
}

export default sendResponse;