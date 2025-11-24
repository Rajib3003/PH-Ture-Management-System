import { QueryBuilder } from './../../utils/QueryBuilder';





import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { INotice, INoticeType } from "./notice.interfaces";
import { Notice, NoticeType } from "./notice.models";
import { noticeSearchableFields } from './notice.constant';
import { deleteImageFromCloudinary } from '../../config/cloudinary.config';

const createNotice = async (payload: INotice) => {  
  const existingNotice = await Notice.findOne({ title: payload.title });
  if (existingNotice){
    throw new AppError(httpStatusCode.BAD_REQUEST,"A notice with this title already exists.","");
  }
  
  const notice = await Notice.create(payload);
  return notice;
};

const getAllNotices= async(query: Record<string,string>)=> {
    const queryBuilder = new QueryBuilder(Notice.find(),query);
    const notices = queryBuilder
    .search(noticeSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()

    const [data, meta] = await Promise.all([
        notices.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }
}
const getSingleNotice = async(slug: string)=> {
    const result = await Notice.findOne({slug})
    return{
        data: result
    }
}
const updateNotice = async(noticeId: string, payload : Partial<INotice>)=> {
    const existingNotice = await Notice.findById(noticeId)
    if(!existingNotice){
        throw new AppError(httpStatusCode.NOT_FOUND,"Notice Id not found","")
    }
  if(payload.images && payload.images.length > 0 && existingNotice.images && existingNotice.images.length > 0){
        
        payload.images = [ ...payload.images, ...existingNotice.images];
    }
   if(payload.deleteImages && payload.deleteImages.length > 0 && existingNotice.images && existingNotice.images.length > 0){
        const restDBImages = existingNotice.images.filter(imageUrl => !payload.deleteImages?.includes(imageUrl))

        const updatePayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
            .filter(imageUrl => !restDBImages.includes(imageUrl))

        payload.images = [...restDBImages, ...updatePayloadImages]; 
    }

    const updateNotice = await Notice.findByIdAndUpdate(noticeId, payload, {new: true, runValidators: true});

      if(payload.deleteImages && payload.deleteImages.length > 0 && existingNotice.images && existingNotice.images.length > 0){
            await Promise.all(payload.deleteImages.map(url=>deleteImageFromCloudinary(url)));
        }

        return updateNotice
}
const deleteNotice= async(noticeId: string)=> {
    await Notice.findByIdAndDelete(noticeId)
    return null; 
}
const createNoticeType= async(payload: INoticeType)=> {
    const existingNoticeType = await NoticeType.findOne({name: payload.name})
    if(existingNoticeType){
        throw new Error("Notice type already exists.");
    }
    const name = payload;
    return await NoticeType.create({name});

}
const getAllNoticeTypes = async()=> {
    return await NoticeType.find();
}
const updateNoticeType= async(noticeTypesId: string, payload: INoticeType)=> {
    const existingNoticeType = await NoticeType.findById(noticeTypesId);
    if(!existingNoticeType){
         throw new AppError(httpStatusCode.NOT_FOUND, "Notice Types ID not found", "");
    }
    const updateNoticeType = await NoticeType.findByIdAndUpdate(noticeTypesId, payload, {new: true, runValidators: true})
    return updateNoticeType
}
const deleteNoticeType = async(noticeTypesId: string)=> {
    const existingNoticeType = await NoticeType.findById(noticeTypesId);
    if(!existingNoticeType){
         throw new AppError(httpStatusCode.NOT_FOUND, "Notice Types ID not found", "")
    }
    await NoticeType.findByIdAndDelete(noticeTypesId);
    return null;

}

export const NoticeService = {
    createNotice,
    getAllNotices,
    getSingleNotice,
    updateNotice,
    deleteNotice,
    createNoticeType,
    getAllNoticeTypes,
    updateNoticeType,
    deleteNoticeType

}
