



import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { INotice } from "./notice.interfaces";
import { Notice } from "./notice.models";

const createNotice = async (payload: INotice) => {  
  const existingNotice = await Notice.findOne({ title: payload.title });
  if (existingNotice){
    throw new AppError(httpStatusCode.BAD_REQUEST,"A notice with this title already exists.","");
  }
  
  const notice = await Notice.create({...payload,date: new Date(payload.date), });
  return notice;
};

export const NoticeService = {
    createNotice
}
